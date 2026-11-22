import mongoose from "mongoose";
import Product from "./models/product.model.js";
import dotenv from "dotenv";

dotenv.config();

const getPublicIdFromCloudinaryUrl = (url) => {
  try {
    const pathname = new URL(url).pathname;
    const uploadIndex = pathname.indexOf("/upload/");

    if (uploadIndex === -1) return null;

    let publicId = pathname.slice(uploadIndex + 8);

    // Remove version prefix, e.g. v1720000000/
    publicId = publicId.replace(/^v\d+\//, "");

    // Remove file extension
    publicId = publicId.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch {
    return null;
  }
};

const migrateProductImagePublicIds = async () => {
  try {
    const products = await Product.find({
      image: { $ne: "" },
      $or: [
        { imagePublicId: { $exists: false } },
        { imagePublicId: null },
        { imagePublicId: "" },
      ],
    });

    console.log(`Found ${products.length} products to migrate`);

    for (const product of products) {
      const publicId = getPublicIdFromCloudinaryUrl(product.image);

      if (!publicId) {
        console.log(`Could not extract public ID: ${product._id}`);
        continue;
      }

      product.imagePublicId = publicId;
      await product.save();

      console.log(`Migrated product: ${product._id}`);
    }

    console.log("Product image migration completed");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  }
};

const startMigration = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await migrateProductImagePublicIds();
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

startMigration();
