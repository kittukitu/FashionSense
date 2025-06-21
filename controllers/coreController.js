// Render index page
exports.getIndex = async (req, res) => {
  try {
    let message = 'Welcome!'; // Default welcome message
    console.log('Message:', message); // Debugging line
    res.render('index', { message, user: req.session.user }); // Render the index page
  } catch (err) {
    console.error('Error fetching pages:', err); // Log errors
    res.status(500).json({ message: 'Internal Server Error' }); // Return server error response
  }
};
