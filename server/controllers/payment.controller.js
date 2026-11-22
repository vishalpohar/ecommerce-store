import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import Address from "../models/address.model.js";

import { stripe } from "../lib/stripe.js";

import ApiError from "../utils/ApiError.js";
import { createOrderImage } from "../utils/createOrderImage.js";

export const createCheckoutSession = async (req, res, next) => {
  try {
    const { products, couponCode, addressId } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return next(new ApiError(400, "Invalid or empty products array"));
    }

    if (!addressId) {
      throw new ApiError(400, "Shipping address is required");
    }

    // 2. Get the user's saved address
    const address = await Address.findOne({
      _id: addressId,
      user: req.user._id,
    }).lean();

    if (!address) {
      throw new ApiError(404, "Shipping address not found");
    }

    const productIds = products.map((item) => item._id);
    const uniqueProductIds = new Set(productIds.map((id) => id.toString()));

    if (uniqueProductIds.size !== productIds.length) {
      throw new ApiError(400, "Duplicate products are not allowed");
    }
    const dbProducts = await Product.find({ _id: { $in: productIds } }).lean();

    if (dbProducts.length !== productIds.length) {
      return next(new ApiError(404, "One or more products not found"));
    }

    const productMap = new Map(
      dbProducts.map((product) => [product._id.toString(), product]),
    );

    const orderProducts = products.map((item) => {
      const product = productMap.get(item._id.toString());
      const quantity = Number(item.quantity);

      if (!Number.isSafeInteger(quantity) || quantity < 1) {
        throw new ApiError(400, "Invalid product quantity");
      }

      if (!product.image) {
        throw new ApiError(400, `Product image missing: ${product.name}`);
      }

      return {
        product: product._id,
        name: product.name,
        image: product.image,
        imagePublicId: null,
        seller: product.seller,
        quantity,
        price: product.price,
        itemTotal: product.price * quantity,
      };
    });

    let totalAmount = 0;

    const lineItems = orderProducts.map((product) => {
      const amount = Math.round(product.price * 100);

      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
        expirationDate: { $gt: new Date() },
      });

      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100,
        );
      }
    }

    const productsMetadata = JSON.stringify(
      orderProducts.map(({ product, quantity }) => ({
        product: product.toString(),
        quantity,
      })),
    );

    if (productsMetadata.length > 500) {
      throw new ApiError(400, "Too many products in checkout");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      currency: "inr",

      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,

      discounts: coupon
        ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
        : [],

      metadata: {
        userId: req.user._id.toString(),
        addressId: address._id.toString(),
        couponCode: coupon?.code ?? "",
        products: productsMetadata,
      },
    });

    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    return next(error);
  }
};

export const checkoutSuccess = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return next(new ApiError(400, "Session ID is required"));
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return next(new ApiError(400, "Payment not completed"));
    }

    // Verify the session belongs to the authenticated user.
    if (session.metadata.userId !== req.user._id.toString()) {
      return next(new ApiError(403, "Unauthorized checkout session"));
    }

    // Prevent duplicate order creation.
    const existingOrder = await Order.findOne({
      stripeSessionId: sessionId,
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already processed",
        orderId: existingOrder._id,
        totalAmount: existingOrder.totalAmount,
      });
    }

    // Retrieve address.
    const address = await Address.findOne({
      _id: session.metadata.addressId,
      user: req.user._id,
    }).lean();

    if (!address) {
      throw new ApiError(404, "Shipping address not found");
    }

    // Retrieve products from MongoDB.
    const requestedProducts = JSON.parse(session.metadata.products);

    const productIds = requestedProducts.map((item) => item.product);

    const dbProducts = await Product.find({
      _id: { $in: productIds },
    }).lean();

    if (dbProducts.length !== productIds.length) {
      throw new ApiError(404, "One or more products not found");
    }

    const productMap = new Map(
      dbProducts.map((product) => [product._id.toString(), product]),
    );

    const orderProducts = requestedProducts.map((item) => {
      const product = productMap.get(item.product);

      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      return {
        product: product._id,
        name: product.name,
        image: product.image,
        imagePublicId: null,
        seller: product.seller,
        quantity: item.quantity,
        price: product.price,
        itemTotal: product.price * item.quantity,
      };
    });

    // Create the order only after successful payment.
    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      address: address._id,
      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      },
      totalAmount: session.amount_total / 100,
      paymentMethod: "card",
      paymentStatus: "paid",
      stripeSessionId: session.id,
    });

    // Copy each product image into the order_images folder.
    for (const item of order.products) {
      const orderImage = await createOrderImage(
        item.image,
        order._id,
        item.product,
      );

      item.image = orderImage.image;
      item.imagePublicId = orderImage.publicId;
    }

    await order.save();

    if (session.metadata.couponCode) {
      await Coupon.findOneAndUpdate(
        {
          code: session.metadata.couponCode,
          userId: session.metadata.userId,
        },
        { isActive: false },
      );
    }

    if (session.amount_total >= 300000) {
      await createNewCoupon(req.user._id);
    }

    res.status(200).json({
      success: true,
      message:
        "Payment successful, order created, and coupon deactivated if used.",
      orderId: order._id,
      totalAmount: order.totalAmount,
    });
  } catch (error) {
    return next(error);
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const couponCode =
    "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const newCoupon = new Coupon({
    code: couponCode,
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  });
  await newCoupon.save();

  return newCoupon;
}
