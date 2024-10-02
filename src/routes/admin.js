const express = require('express');
const { validationMiddleware, authenticationMiddleware } = require('../middlewares');
const adminController = require('../controllers/admin');
const router = express.Router();
const { adminSchema } = require('../validations/admin');

/**
 * @swagger
 *  /admin/invite-user:
 *  post:
 *      summary: Invite Verifier or Company
 *      description: Invite Verifier or Company
 *      tags: ['Admin']
 *      security:
 *          - bearerAuth: []
 *      responses:
 *       201:
 *         description: Update company profile
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: User already exists
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firsName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               roleId:
 *                 type: integer
 */
router.post('/invite-user', authenticationMiddleware([1]), validationMiddleware(adminSchema.inviteUser), adminController.inviteUsers);

/**
 * @swagger
 *  /admin/getAllUsers:
 *  get:
 *      summary: List users
 *      description: Get all users
 *      tags: ['Admin']
 *      security:
 *          - bearerAuth: []
 *      responses:
 *       201:
 *         description: list users
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: User already exists
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *      parameters:
 *          - in: query
 *            name: search
 *            required: false
 *            schema:
 *              type: string
 *          - in: query
 *            name: limit
 *            required: false
 *            schema:
 *              type: integer
 *          - in: query
 *            name: page
 *            required: false
 *            schema:
 *              type: integer
 */
router.get('/getAllUsers', authenticationMiddleware(), adminController.getAllUsers);

/**
 * @swagger
 *  /admin/users/{userId}/toggleStatus:
 *  patch:
 *      summary: Toggle User Active Status
 *      description: Enable or disable a user's active status.
 *      tags: ['Admin']
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: userId
 *            required: true
 *            schema:
 *              type: integer
 *            description: ID of the user to update
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: boolean
 *                              description: Set to `true` to activate the user, or `false` to deactivate
 *      responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid user ID or bad request
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Unauthorized'
 *       404:
 *         description: User not found
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/NotFound'
 */

router.patch('/toggleActivation/:userId', authenticationMiddleware(), adminController.toggleUserStatus);

/**
 * @swagger
 *  /admin/getTaePayments:
 *  get:
 *      summary: Get TAE payments
 *      description: Get the total actuals grouped by company name for prod and imports with approved status for a given year.
 *      tags: ['Admin']
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: query
 *            name: year
 *            required: true
 *            schema:
 *              type: integer
 *            description: Year to filter the productions
 *      responses:
 *       200:
 *         description: Successfully fetched TAE payments
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      companyName:
 *                          type: string
 *                      totalActuals:
 *                          type: number
 *       400:
 *         description: Bad request
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 */
router.get('/getTaePayments', authenticationMiddleware(), adminController.getTaePayments);

module.exports = router;
