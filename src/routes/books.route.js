const router = require('express').Router();
const { 
    GetBooks, 
    GetSingleBook, 
    GetCategories, 
    GetLanguages, 
    GetBookByLanguage,
    GetBookByCategory,
    ManageUserBookPreference,
    UpdateReadingProgress
} = require('../controllers/books.controllers');
const userAuth = require('../middlewares/user-auth');


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
 * components:
 *   schemas:
 *     Lang:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The primary key of the language or categorie
 *           example: 6812c781d29a8c2e9e733a5f
 *         wording:
 *           type: string
 *           description: The name of the categorie or of the languages
 * */

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
 * /books/one/{bookid}:
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
router.get('/one/:bookid', GetSingleBook);


/**
 * @swagger
 * /books/categories:
 *   get:
 *     summary: Get all available categories
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Books categories array
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lang'
 */
router.get('/categories', GetCategories);


/**
 * @swagger
 * /books/languages:
 *   get:
 *     summary: Get all available languages
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: languages array
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lang'
 */
router.get('/languages', GetLanguages);

/**
 * @swagger
 * /books/categories/{category}:
 *   get:
 *     summary: Get alls books in the specified category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           description: the wording of the categorie to be fetched
 *     description: Provide book based on category
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
router.get('/languages/:lang',GetBookByLanguage);


/**
 * @swagger
 * /books/languages/{lang}:
 *   get:
 *     summary: Get alls books in the specified languages
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           description: the wording of the lang to be fetched
 *     description: Provide book based on language
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
router.get('/categories/:category',GetBookByCategory);


/**
 * @swagger
 * /books/{action}/{bookid}:
 *   patch:
 *     summary: Set a book as downloaded,starred or bookmarked
 *     parameters:
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           description: bookmarked | starred | downloaded
 *       - in: path
 *         name: bookid
 *         required: true
 *         schema:
 *           type: string
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: OK
 */
router.patch("/:action/:bookid", userAuth, ManageUserBookPreference);

/**
 * @swagger
 * /books/trackprogress:
 *   patch:
 *     summary: Define the number of page read
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookid
 *               - pageRead
 *             properties:
 *               bookid:
 *                 type: string
 *               pageRead:
 *                 type: number
 */
router.patch("/trackprogress",userAuth, UpdateReadingProgress);

module.exports = router;
