import cloudinary from "../lib/cloudinary.js";

export const createOrderImage = async (imageUrl, orderId, productId) => {
  const publicId = `${orderId.toString()}_${productId.toString()}`;

  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: "ecommerce/order_images",
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    quality: "auto",
    fetch_format: "auto",
  });

  return {
    image: result.secure_url,
    publicId: result.public_id,
  };
};
