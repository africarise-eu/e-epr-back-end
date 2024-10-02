const express = require('express');
const companyController = require('../controllers/company');
const { validationMiddleware, authenticationMiddleware } = require('../middlewares');
const router = express.Router();
const { companySchema } = require('../validations/company');

/**
 * @swagger
 *  /company/register:
 *  post:
 *      summary: Register a company or a user
 *      description: Register a company or a user
 *      tags: ['Company']
 *      responses:
 *       201:
 *         description: Company Created
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               companyId:
 *                 type: integer
 */
router.post('/register', validationMiddleware(companySchema.addUser), companyController.register);

/**
 * @swagger
 *  /company/profile:
 *  post:
 *      summary: Create company profile
 *      description: Register a company or a user
 *      tags: ['Company']
 *      security:
 *          - bearerAuth: []
 *      responses:
 *       201:
 *         description: Create company profile
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
 *               companyName:
 *                 type: string
 *               isProducer:
 *                 type: boolean
 *               isImporter:
 *                 type: boolean
 *               registrationNumber:
 *                 type: string
 *               activityCode:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: integer
 *               country:
 *                 type: integer
 *               phoneNumber:
 *                 type: string
 *               bankAccount:
 *                 type: string
 *               website:
 *                 type: string
 *               logo:
 *                 type: string
 *
 */
router.post(
    '/profile',
    authenticationMiddleware(),
    // authorization('company'),
    validationMiddleware(companySchema.createCompanyProfile),
    companyController.companyProfile
);

/**
 * @swagger
 *  /company/profile:
 *  get:
 *      summary: Get company profile
 *      description: Get company profile
 *      tags: ['Company']
 *      security:
 *          - bearerAuth: []
 *      responses:
 *       201:
 *         description: Get company profile
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
 *
 */
router.get('/profile', authenticationMiddleware(), companyController.getProfile);

/**
 * @swagger
 *  /company/profile:
 *  patch:
 *      summary: Update company profile
 *      description: Update a company profile
 *      tags: ['Company']
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
 *               companyName:
 *                 type: string
 *               isProducer:
 *                 type: boolean
 *               isImporter:
 *                 type: boolean
 *               registrationNumber:
 *                 type: string
 *               activityCode:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: integer
 *               country:
 *                 type: integer
 *               phoneNumber:
 *                 type: string
 *               bankAccount:
 *                 type: string
 *               website:
 *                 type: string
 *               logo:
 *                 type: string
 */
router.patch(
    '/profile',
    authenticationMiddleware(),
    validationMiddleware(companySchema.createCompanyProfile),
    companyController.updateProfile
);

/**
 * @swagger
 *  /company/invite-user:
 *  post:
 *      summary: Invite User
 *      description: Invite user to company
 *      tags: ['Company']
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
 */
router.post('/invite-user', authenticationMiddleware(), validationMiddleware(companySchema.inviteUser), companyController.inviteUser);

/**
 * @swagger
 *  /company/list-users:
 *  get:
 *      summary: List users
 *      description: Invite user to company
 *      tags: ['Company']
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
router.get('/list-users', authenticationMiddleware(), validationMiddleware(companySchema.pagination), companyController.listUsers);

/**
 * @swagger
 *  /company/status:
 *  patch:
 *      summary: Invite User
 *      description: Invite user to company
 *      tags: ['Company']
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
 *               userId:
 *                 type: integer
 *               status:
 *                 type: string
 */
router.patch('/status', authenticationMiddleware(), validationMiddleware(companySchema.status), companyController.enableDisableUser);

/**
 * @swagger
 *  /company/list-company:
 *  get:
 *      summary: List company
 *      description: Invite user to company
 *      tags: ['Company']
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
 */
router.get('/list-company', companyController.listCompany);
module.exports = router;
