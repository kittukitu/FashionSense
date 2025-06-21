const fetch = require('node-fetch');
require('dotenv').config();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const api_key = 'SG_6d1bfc8e747b5f7e';
const url = 'https://api.segmind.com/v1/try-on-diffusion';

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const vtoController = async (req, res) => {
  try {
    const { modelImageUrl, clothImageUrl } = req.body;

    if (!modelImageUrl || !clothImageUrl) {
      return res
        .status(400)
        .json({ error: 'Model and cloth image URLs are required' });
    }

    const data = {
      model_image: await imageUrlToBase64(modelImageUrl),
      cloth_image: await imageUrlToBase64(clothImageUrl),
      category: 'Upper body',
      num_inference_steps: 35,
      guidance_scale: 2,
      seed: 12467,
      base64: false,
    };

    console.log('Post request generated:', data);

    const response = await axios.post(url, data, {
      headers: { 'x-api-key': api_key },
      responseType: 'arraybuffer', // Ensures binary data
    });

    // Generate unique filename using timestamp
    const timestamp = Date.now();
    const generatedFilename = `${timestamp}_generated_image.png`;
    const modelFilename = `${timestamp}_original_model.jpg`;
    const clothFilename = `${timestamp}_original_cloth.jpg`;

    const generatedPath = path.join('public', 'generated', generatedFilename);
    const modelPath = path.join('public', 'generated', modelFilename);
    const clothPath = path.join('public', 'generated', clothFilename);

    // Ensure directory exists
    fs.mkdirSync(path.dirname(generatedPath), { recursive: true });

    // Save generated image
    fs.writeFileSync(generatedPath, response.data);
    console.log('Generated Image saved successfully at:', generatedPath);

    // Download and save model image
    const modelImage = await axios.get(modelImageUrl, {
      responseType: 'arraybuffer',
    });
    fs.writeFileSync(modelPath, modelImage.data);
    console.log('Model Image saved successfully at:', modelPath);

    // Download and save cloth image
    const clothImage = await axios.get(clothImageUrl, {
      responseType: 'arraybuffer',
    });
    fs.writeFileSync(clothPath, clothImage.data);
    console.log('Cloth Image saved successfully at:', clothPath);

    console.log('response', {
      message: 'Form submitted successfully!',
      imageUrl: `/generated/${generatedFilename}`,
      modelImageUrl: `/generated/${modelFilename}`,
      clothImageUrl: `/generated/${clothFilename}`,
    });
    // Send response with image URLs
    res.json({
      message: 'Form submitted successfully!',
      imageUrl: `/generated/${generatedFilename}`,
      modelImageUrl: `/generated/${modelFilename}`,
      clothImageUrl: `/generated/${clothFilename}`,
    });
  } catch (error) {
    console.error(
      'Error:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Use this function to convert an image file from the filesystem to base64
function imageFileToBase64(imagePath) {
  const imageData = fs.readFileSync(path.resolve(imagePath));
  return Buffer.from(imageData).toString('base64');
}

// Use this function to fetch an image from a URL and convert it to base64
async function imageUrlToBase64(imageUrl) {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

module.exports = { vtoController };
