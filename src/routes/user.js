const express = require('express');
const { validationMiddleware, authenticationMiddleware } = require('../middlewares');
const userController = require('../controllers/user');
const { userSchema } = require('../validations/user');
const router = express.Router();

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User Login
 *     description: Login user
 *     tags: ['Users']
 *     responses:
 *       200:
 *         description: User Login
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid  Username or password
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/login', validationMiddleware(userSchema.login), userController.login);

/**
 * @swagger
 * /user/send-otp:
 *   post:
 *     summary: Send otp for forgot password
 *     description: Send otp for forgot password
 *     tags: ['Users']
 *     responses:
 *       200:
 *         description: User Login
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid  Username or password
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 */
router.post('/send-otp', validationMiddleware(userSchema.email), userController.sendOtp);

/**
 * @swagger
 * /user/verify-otp:
 *   post:
 *     summary: Verify otp
 *     description: Verify otp for forgot password
 *     tags: ['Users']
 *     responses:
 *       200:
 *         description: User Login
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid  Username or password
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: number
 *               token:
 *                 type: string
 */
router.post('/verify-otp', validationMiddleware(userSchema.otp), userController.verifyOtp);

/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset password of forgot password
 *     tags: ['Users']
 *     responses:
 *       200:
 *         description: Reset Password
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid  otp or token
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *               otp:
 *                 type: integer
 *               token:
 *                 type: string
 */
router.post('/reset-password', validationMiddleware(userSchema.resetPassword), userController.resetPassword);

/**
 * @swagger
 * /user/change-password-otp:
 *   post:
 *     summary: Otp for Change Password
 *     description: Otp for Change Password
 *     tags: ['Users']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Otp for Change Password
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid  otp or token
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 */
router.post('/change-password-otp', authenticationMiddleware(), userController.changePasswordOtp);

/**
 * @swagger
 * /user/change-password:
 *   post:
 *     summary: Change password from profile
 *     description: Change password from profile
 *     tags: ['Users']
 *     security:
 *          - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Change Password
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid  otp or token
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *               otp:
 *                 type: integer
 *               token:
 *                 type: string
 */
router.post('/change-password', authenticationMiddleware(), validationMiddleware(userSchema.changePassword), userController.changePassword);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout user
 *     description: Logout user
 *     tags: ['Users']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid token
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 */
router.post('/logout', authenticationMiddleware(), userController.logout);

/**
 * @swagger
 * /user/invite-user/set-password:
 *   post:
 *     summary: Set password for invite user
 *     description: Set password for invite user
 *     tags: ['Users']
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               url:
 *                 type: string
 */
router.post('/invite-user/set-password', validationMiddleware(userSchema.setPassword), userController.setPassword);

/**
 * @swagger
 * /user/profile:
 *   patch:
 *     summary: Update user profile
 *     description: Update user profile
 *     tags: ['Users']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               profileImage:
 *                 type: string
 */
router.patch('/profile', authenticationMiddleware(), validationMiddleware(userSchema.userUpdate), userController.updateProfile);

/**
 * @swagger
 * /user/verify-email-otp:
 *   post:
 *     summary: Send email for email verification
 *     description: Update user profile
 *     tags: ['Users']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *     requestBody:
 *       required: true
 */
router.post('/verify-email-otp', authenticationMiddleware(), userController.verifyEmailOtp);

/**
 * @swagger
 * /user/verify-email:
 *   post:
 *     summary: Email verification
 *     description: Email verification
 *     tags: ['Users']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: integer
 */
router.post('/verify-email', authenticationMiddleware(), validationMiddleware(userSchema.verifyEmail), userController.verifyEmail);

module.exports = router;
