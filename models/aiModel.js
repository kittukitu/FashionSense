const axios = require('axios');

// Function to generate AI content using RapidAPI
async function generateAIContent(prompt) {
  const url = 'https://chat-gpt26.p.rapidapi.com/';
  const options = {
    method: 'POST',
    headers: {
      // Replace with your actual RapidAPI key
      'x-rapidapi-key': 'ea86ec0756msh17e532df1e1c9c9p170c20jsnebad0933d91c',
      'x-rapidapi-host': 'chat-gpt26.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    },
  };

  try {
    // Send request to AI API
    const response = await axios(url, options);
    console.log('ai response', response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = { generateAIContent };
