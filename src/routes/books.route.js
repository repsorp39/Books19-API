const { GetBooks, GetSingleBook } = require('../controllers/books.controllers');

const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   - name:  Books
 *     description: Edit and get books
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The primary key of the book
 *           example: 6812c781d29a8c2e9e733a5f
 *         title:
 *           type: string
 *           description: The title of the book
 *           example: Emma
 *         author:
 *           type: string
 *           description: The author of the book
 *           example: Jane Austen
 *         nbPages:
 *           type: integer
 *           description: Number of pages
 *           example: 380
 *         previewImg:
 *           type: string
 *           description: Cover of the book
 *           example: https://assets.books19.com/emma.jpg
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           description: Available languages for this book
 *           example: ["French", "English"]
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           description: All categories for this book
 *           example: ["Fiction", "Humor"]
 *         yearOfRelease:
 *           type: integer
 *           description: Year the book was released
 *           example: 2025
 *         urlDownload:
 *           type: string
 *           description: Link for download
 *           example: https://assets.books19.com/download/emma.pdf
 *         urlStream:
 *           type: string
 *           description: Link to get book in chunks for PDF.js
 *           example: https://assets.books19.com/chunks/emma.pdf
 *         synopsis:
 *           type: string
 *           description: Short summary of the plot
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get books
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: string
 *           description: The current page, default is 1
 *     description: Provide books based on page query params
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Book'
 */
router.get('/', GetBooks);

/**
 * @swagger
 * /books/{bookid}:
 *   get:
 *     summary: Get book by id
 *     parameters:
 *       - in: path
 *         name: bookid
 *         required: true
 *         schema:
 *           type: string
 *           description: the id of the book to be fetch
 *     description: Provide book based on the book id
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Book'
 */
router.get('/:bookid', GetSingleBook);

module.exports = router;
