import { GoogleGenAI } from "@google/genai";
import ApiError from "../utils/ApiError.js";
import { redis } from "../lib/redis.js";
import logger from "../utils/logger.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateDescription = async (req, res, next) => {
  try {
    const { productName } = req.body;

    if (!productName || !productName.trim()) {
      return next(new ApiError(400, "Product name is required"));
    }

    const normalizedName = productName.trim().toLowerCase();
    const cacheKey = `desc:${normalizedName}`;

    try {
      const cached = await redis.get(cacheKey);

      if (cached) {
        return res.json({ description: cached });
      }
    } catch (error) {
      logger.error(`Redis read error: ${error.message}`);
    }

    const prompt = `
            Write a professional e-commerce product description for: "${productName}"

            Rules:
            - Give ONLY ONE description
            - Keep it strictly 3 to 4 lines
            - Make it attractive and concise
            - Do NOT provide multiple options
            - Do NOT add headings or labels
            - Focus on key benefits

            Output only the final description.
        `;

    let description = "";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      description = response.text.trim();
    } catch (aiError) {
      return next(
        new ApiError(503, "AI service unavailable. Please try again later."),
      );
    }

    if (!description) {
      return next(new ApiError(500, "Failed to generate description"));
    }

    try {
      await redis.set(cacheKey, description, "EX", 86400);
    } catch (error) {
      logger.error(`Redis write error: ${error.message}`);
    }

    res.json({ description });
  } catch (error) {
    return next(error);
  }
};
