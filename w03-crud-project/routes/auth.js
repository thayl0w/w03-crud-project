const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth');

// Local register and login
router.post('/register', authController.register);
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Authenticate with GitHub
 *     description: Redirects to GitHub for authentication
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to GitHub
 */
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     description: Handles the callback from GitHub OAuth
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to home page on success, login page on failure
 */
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     description: Logs out the current user
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to home page
 */
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

/**
 * @swagger
 * /auth/status:
 *   get:
 *     summary: Get authentication status
 *     description: Returns the current user's authentication status
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Returns user information if authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     displayName:
 *                       type: string
 *       401:
 *         description: Not authenticated
 */
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        displayName: req.user.displayName
      }
    });
  } else {
    res.status(401).json({
      authenticated: false,
      message: 'Not authenticated'
    });
  }
});

module.exports = router; 