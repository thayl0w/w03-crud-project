const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book');
const { ensureAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - publishedYear
 *         - genre
 *         - isbn
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the book
 *           example: "507f1f77bcf86cd799439011"
 *         title:
 *           type: string
 *           description: The title of the book
 *           example: "The Great Gatsby"
 *         author:
 *           type: string
 *           description: The author of the book
 *           example: "F. Scott Fitzgerald"
 *         publishedYear:
 *           type: number
 *           description: The year the book was published
 *           example: 1925
 *         genre:
 *           type: string
 *           description: The genre of the book
 *           example: "Fiction"
 *         isbn:
 *           type: string
 *           description: The ISBN of the book
 *           example: "978-3-16-148410-0"
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           description: The rating of the book (0-5)
 *           example: 4.5
 *         summary:
 *           type: string
 *           description: A summary of the book
 *           example: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan."
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Unauthorized access"
 *     ValidationError:
 *       description: Invalid input data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "title is required"
 *     NotFoundError:
 *       description: The specified book was not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Book not found"
 *     Success:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Operation successful"
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     description: Retrieve a list of all books in the database
 *     tags: [Books]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 title: "The Great Gatsby"
 *                 author: "F. Scott Fitzgerald"
 *                 publishedYear: 1925
 *                 genre: "Fiction"
 *                 isbn: "978-3-16-148410-0"
 *                 rating: 4.5
 *                 summary: "A story of the fabulously wealthy Jay Gatsby"
 *               - _id: "507f1f77bcf86cd799439012"
 *                 title: "To Kill a Mockingbird"
 *                 author: "Harper Lee"
 *                 publishedYear: 1960
 *                 genre: "Fiction"
 *                 isbn: "978-0-06-112008-4"
 *                 rating: 4.8
 *                 summary: "The story of racial injustice and the loss of innocence"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', ensureAuthenticated, bookController.getAllBooks);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     description: Add a new book to the database
 *     tags: [Books]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *           example:
 *             title: "The Great Gatsby"
 *             author: "F. Scott Fitzgerald"
 *             publishedYear: 1925
 *             genre: "Fiction"
 *             isbn: "978-3-16-148410-0"
 *             rating: 4.5
 *             summary: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan."
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               title: "The Great Gatsby"
 *               author: "F. Scott Fitzgerald"
 *               publishedYear: 1925
 *               genre: "Fiction"
 *               isbn: "978-3-16-148410-0"
 *               rating: 4.5
 *               summary: "A story of the fabulously wealthy Jay Gatsby"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', ensureAuthenticated, bookController.createBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     description: Update an existing book's information
 *     tags: [Books]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *           example:
 *             title: "The Great Gatsby (Updated)"
 *             author: "F. Scott Fitzgerald"
 *             publishedYear: 1925
 *             genre: "Fiction"
 *             isbn: "978-3-16-148410-0"
 *             rating: 4.8
 *             summary: "Updated summary of the book"
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               title: "The Great Gatsby (Updated)"
 *               author: "F. Scott Fitzgerald"
 *               publishedYear: 1925
 *               genre: "Fiction"
 *               isbn: "978-3-16-148410-0"
 *               rating: 4.8
 *               summary: "Updated summary of the book"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', ensureAuthenticated, bookController.updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     description: Remove a book from the database
 *     tags: [Books]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *             example:
 *               message: "Book deleted successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', ensureAuthenticated, bookController.deleteBook);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     description: Retrieve a specific book by its ID
 *     tags: [Books]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid book ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid book ID format"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', ensureAuthenticated, bookController.getBookById);

module.exports = router;