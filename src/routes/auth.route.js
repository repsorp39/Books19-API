const router        = require("express").Router();
const authManager   = require("../controllers/user.controllers");
const authUser      = require("../middlewares/user-auth");

    /**
    * @swagger
    * tags:
    *   - name:  Authentication
    *     description: Authentication endpoints
    */

   /**
    * @swagger
    * components:
    *   schemas:
    *     User:
    *       type: object
    *       properties:
    *         fullname:
    *           type: string
    *           description: The user's fullname
    *         email:
    *           type: string
    *           description: The user's email
    *         password:
    *           type: string
    *           description: The user's password
    *         pseudo:
    *           type: string
    *           description: The user's pseudo
    */

   /**
    * @swagger
    * components:
    *   schemas:
    *     UserCredentials:
    *       type: object
    *       properties:
    *         email:
    *           type: string
    *           description: The user's email
    *         password:
    *           type: string
    *           description: The user's password
    */

// Routes definitions

/**
    * @swagger
    * /auth/user:
    *   post:
    *     summary: Create a new user
    *     tags:
    *       - Authentication
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/User'
    *     responses:
    *       201:
    *         description: User created
    */

router.post("/user" ,authManager.Register)


/**
    * @swagger
    * /auth/login:
    *   post:
    *     summary: Login a new user
    *     tags:
    *       - Authentication   
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/UserCredentials'
    *     responses:
    *       200:
    *         description: User logged in
    */

router.post("/login" ,authManager.Login)



/**
    * @swagger
    * /auth/user:
    *   get:
    *     summary: Get user info
    *     tags:
    *       - Authentication
    *     responses:
    *       200:
    *         description: Basics users info
    */

router.get("/user", [authUser] ,authManager.GetUserInfo);

/**
 * @swagger
 * /auth/google-login:
 *   post:
 *     summary: Sign up a new user with a Google token
 *     description: Creates a new user account using a Google authentication token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: The Google authentication token (JWT)
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Invalid token or missing required fields
 */

router.post("/google-login", authManager.AuthWithGoogle);


/**
 * @swagger
 * /auth/password-edit:
 *   patch:
 *     summary: Change user password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current user password
 *               newPassword:
 *                 type: string
 *                 description: New password to set 
 *     responses:
 *       200:
 *         description: Updated successfully!
 *       400:
 *         description: Invalid password or missing required fields
 */

router.patch("/password-edit",[authUser], authManager.EditPassword);

/**
 * @swagger
 * /auth/password-reset-email:
 *   post:
 *     summary: Send reset password email
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: user email
 *     responses:
 *       200:
 *         description: Reset email sent!
 *       400:
 *         description: Missing email
 */

router.post("/password-reset-email", authManager.HandleResetEmailPassword);

/**
 * @swagger
 * /auth/password-reset:
 *   put:
 *     summary: Reset password 
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: token receive by email
 *               newPassword:
 *                 type: string
 *                 description: the new password to be set
 *               email:
 *                 type: string
 *                 description: user email
 *     responses:
 *       200:
 *         description: Reset email sent!
 *       400:
 *         description: Missing | invalid email,token or new password
 */
router.put("/password-reset", authManager.ResetPassword);

module.exports = router;



