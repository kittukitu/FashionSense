// Import user model
const userModel = require('../models/userModel');

// Get user profile
exports.getProfile = (req, res) => {
  const userId = req.session.user.id;

  // Redirect to login if no user session
  if (!userId) {
    return res.redirect('/login');
  }

  // Fetch user data by ID
  userModel.findUserById(userId, (err, results) => {
    if (err || results.length === 0) {
      console.log(err); // Log error
      return res.redirect('/login'); // Redirect on error or no user found
    }
    const user = results[0];
    res.render('profile', { user }); // Render profile page
  });
};
