const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const chatController = async (req, res) => {
  const { prompt, style, resolution, gender, styleOption } = req.body;

  // Validate input
  if (!prompt || !style || !resolution || !gender || !styleOption) {
    return res.render("chatC", {
      response: "❌ Please fill in all fields.",
      user: req.session.user || null,
    });
  }

  try {
    // Construct content description
    const contents = `Generate a ${style} style image with ${resolution} resolution featuring a ${gender} character in ${styleOption}. ${prompt}`;

    // Generate the image using Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: contents,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    let imageUrl = null;

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");

        // 📌 Ensure the directory exists before saving the file
        const imageDir = path.join(__dirname, "../public/generated_images");
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }

        // 📌 Generate unique file name and save
        const imagePath = path.join(imageDir, `${Date.now()}.png`);
        fs.writeFileSync(imagePath, buffer);
        imageUrl = `/generated_images/${path.basename(imagePath)}`;
      }
    }

    if (!imageUrl) {
      return res.render("chatC", {
        response: "⚠️ No image generated. Please try with a different prompt.",
        user: req.session.user || null,
      });
    }

    res.render("result", {
      response: "✅ Image generated successfully!",
      user: req.session.user || null,
      imageUrl,
      prompt,
      style,
      resolution,
      gender,
      styleOption,
    });
  } catch (error) {
    console.error("❌ Error generating image:", error);
    res.render("chatC", {
      response: "🚨 Error processing your request. Please try again later.",
      user: req.session.user || null,
    });
  }
};

module.exports = { chatController };
