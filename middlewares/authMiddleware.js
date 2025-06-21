// Middleware to check if user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
  // Proceed if user is logged in
  if (req.session.user && req.session.user.id) {
    return next();
  } else {
    // Redirect to login if not authenticated
    res.redirect('/login');
  }
};
