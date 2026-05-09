import dotenv from "dotenv";

dotenv.config();

const envars = {
  mongo_uri: process.env.MONGO_URI,
  port: process.env.PORT,
  client_url: process.env.CLIENT_URL,

  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,

  upstash_redis_url: process.env.UPSTASH_REDIS_URL,
  upstash_redis_token: process.env.UPSTASH_REDIS_TOKEN,

  stripe_secret_key: process.env.STRIPE_SECRET_KEY,

  resend_api_key: process.env.RESEND_API_KEY,
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
  gemini_api_key: process.env.GEMINI_API_KEY,
};

export default envars;
