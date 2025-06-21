const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { chatController } = require('../controllers/chatController');
const { vtoController } = require('../controllers/vtoController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// Route to render the AI application page
router.get('/aiapp', ensureAuthenticated, aiController.getAIApp);
// Route to handle AI content generation
router.post('/aiapp', ensureAuthenticated, aiController.generateAIContent);

// Render the index page
router.get('/index', ensureAuthenticated, (req, res) => {
  res.render('chatC', {
    response: '',
    user: req.session.user || null,
  });
});
router.post('/index', ensureAuthenticated, chatController);

// Render the index page
router.get('/vto', ensureAuthenticated, (req, res) => {
  res.render('vto', {
    response: '',
    user: req.session.user || null,
  });
});
router.post('/vto', ensureAuthenticated, vtoController);

module.exports = router;
