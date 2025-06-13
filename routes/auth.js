const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - displayName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               displayName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get('/logout', authController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Current user information
 *       401:
 *         description: Not authenticated
 */
router.get('/me', authController.getCurrentUser);

// Google OAuth routes (only if credentials are available)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  /**
   * @swagger
   * /auth/google:
   *   get:
   *     summary: Login with Google
   *     tags: [Auth]
   *     responses:
   *       302:
   *         description: Redirect to Google for authentication
   */
  router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  /**
   * @swagger
   * /auth/google/callback:
   *   get:
   *     summary: Google OAuth callback
   *     tags: [Auth]
   *     responses:
   *       302:
   *         description: Redirect to home page after successful authentication
   *       401:
   *         description: Authentication failed
   */
  router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    }
  );
}

// GitHub OAuth routes (only if credentials are available)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  /**
   * @swagger
   * /auth/github:
   *   get:
   *     summary: Login with GitHub
   *     tags: [Auth]
   *     responses:
   *       302:
   *         description: Redirect to GitHub for authentication
   */
  router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
  );

  /**
   * @swagger
   * /auth/github/callback:
   *   get:
   *     summary: GitHub OAuth callback
   *     tags: [Auth]
   *     responses:
   *       302:
   *         description: Redirect to home page after successful authentication
   *       401:
   *         description: Authentication failed
   */
  router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    }
  );
}

module.exports = router;