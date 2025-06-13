const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review');
const { ensureAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - bookId
 *         - rating
 *         - title
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the review
 *         bookId:
 *           type: string
 *           description: The ID of the book being reviewed
 *         userId:
 *           type: string
 *           description: The ID of the user who wrote the review
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: The rating given to the book (1-5)
 *         title:
 *           type: string
 *           description: The title of the review
 *         content:
 *           type: string
 *           description: The content of the review
 *         helpfulVotes:
 *           type: number
 *           description: Number of helpful votes
 *         isVerifiedPurchase:
 *           type: boolean
 *           description: Whether the reviewer purchased the book
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     description: Retrieve a list of all reviews
 *     tags: [Reviews]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 */
router.get('/', ensureAuthenticated, reviewController.getAllReviews);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     description: Retrieve a specific review by its ID
 *     tags: [Reviews]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid review ID format
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.get('/:id', ensureAuthenticated, reviewController.getReviewById);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     description: Add a new review for a book
 *     tags: [Reviews]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - rating
 *               - title
 *               - content
 *             properties:
 *               bookId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               isVerifiedPurchase:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Validation error
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.post('/', ensureAuthenticated, reviewController.createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     description: Update an existing review
 *     tags: [Reviews]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               isVerifiedPurchase:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Validation error
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized to update this review
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.put('/:id', ensureAuthenticated, reviewController.updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Delete an existing review
 *     tags: [Reviews]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized to delete this review
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', ensureAuthenticated, reviewController.deleteReview);

module.exports = router; 