// Import user model
const userModel = require('../models/userModel');

exports.adminPage = (req, res) => {
  const currentUser = req.session.user;

  // Redirect if not logged in
  if (!currentUser) {
    return res.redirect('/login');
  }

  // Deny access if not an admin
  if (currentUser.role === 'user') {
    return res.status(401).send(`
      <html>
        <head>
          <title>Unauthorized</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .message {
              text-align: center;
              background-color: #fff;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              max-width: 450px;
              width: 100%;
            }
            h1 {
              color: #e74c3c;
              margin-bottom: 20px;
            }
            button {
              background-color: #3498db;
              color: white;
              padding: 12px 20px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
            button:hover {
              background-color: #2980b9;
            }
          </style>
        </head>
        <body>
          <div class="message">
            <h1>Unauthorized Access</h1>
            <p>You do not have permission to view this page.</p>
            <a href="/" style="text-decoration: none;">
              <button>Go Back</button>
            </a>
          </div>
        </body>
      </html>
    `);
  }

  // Fetch and display all users
  userModel.getAllUsers((err, results) => {
    if (err) {
      console.error(err);
      return res.redirect('/');
    }
    res.render('admin', { users: results, user: currentUser });
  });
};
