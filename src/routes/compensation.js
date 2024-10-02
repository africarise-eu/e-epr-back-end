const express = require('express');
const { validationMiddleware, authenticationMiddleware } = require('../middlewares');
const compensationController = require('../controllers/compensationController');
const router = express.Router();

/**
 * @swagger
 * /compensation/addCompensation:
 *   post:
 *     summary: To add compensation request
 *     description: Create compensation request
 *     tags: ['Compensation']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compensation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error creating compensation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryToEdDate:
 *                 type: string
 *                 format: date
 *               materialId:
 *                 type: integer
 *               deliveredKgs:
 *                 type: number
 *               edOrganisationId:
 *                 type: integer
 *               status:
 *                 type: string
 *               documents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     documentUrl:
 *                       type: string
 *                       format: uri
 *                     description:
 *                       type: string
 */
router.post('/addCompensation', authenticationMiddleware(), compensationController.addCompensation);

/**
 * @swagger
 * /compensation/addEndDestination:
 *   post:
 *     summary: Add an end destination
 *     description: Creates a new end destination.
 *     tags: ['Compensation']
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-08-13T18:30:00Z"
 *               companyId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               orgType:
 *                 type: string
 *               orgName:
 *                 type: string
 *               companyRegNo:
 *                 type: string
 *               phone:
 *                 type: string
 *                 pattern: '^\\d+$'
 *               email:
 *                 type: string
 *                 format: email
 *               contactPerson:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *             required:
 *               - date
 *               - companyId
 *               - userId
 *               - orgType
 *               - orgName
 *               - companyRegNo
 *               - phone
 *               - email
 *               - contactPerson
 *               - address
 *               - city
 *               - country
 *     responses:
 *       200:
 *         description: End destination created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

router.post('/addEndDestination', authenticationMiddleware(), compensationController.addEndDestination);

/**
 * @swagger
 * /compensation/getCompensationById:
 *   get:
 *     summary: Get compensation using id
 *     description: Retrieve a single compensation details
 *     tags: ['Compensation']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Selected compensation details retrieved successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error retrieving selected compensation
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
router.get('/getCompensationById/:id', authenticationMiddleware(), compensationController.getCompensationById);

/**
 * @swagger
 * /compensation/getAllCompensations:
 *   get:
 *     summary: Get all compensations
 *     description: Retrieve compensation with pagination
 *     tags: ['Compensation']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listed all the compensations
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error retrieving compensations
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
 *     parameters:
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
 *          - in: query
 *            name: status
 *            required: false
 *            schema:
 *              type: array of strings
 */
router.get('/getAllCompensations', authenticationMiddleware(), compensationController.getAllCompensations);

/**
 * @swagger
 * /compensation/getEndDestinationsByCompany:
 *   get:
 *     summary: Get all end destinations based on company
 *     description: Retrieve E-D with pagination
 *     tags: ['Compensation']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listed all the E-Ds based on company
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error retrieving E-Ds
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
 *     parameters:
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
 *          - in: query
 *            name: status
 *            required: false
 *            schema:
 *              type: array of strings
 */
router.get('/getEndDestinationsByCompany', authenticationMiddleware(), compensationController.getEndDestinationsByCompany);

/**
 * @swagger
 * /compensation/update/{id}:
 *   put:
 *     summary: Update a compensation
 *     description: Updates an existing compensation request.
 *     tags: ['Compensation']
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the compensation request to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryToEdDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-08-13T18:30:00Z"
 *               materialId:
 *                 type: integer
 *               deliveredKgs:
 *                 type: number
 *                 format: float
 *               edOrganisationId:
 *                 type: integer
 *               status:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               documents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     documentUrl:
 *                       type: string
 *                     description:
 *                       type: string
 *     responses:
 *       200:
 *         description: Compensation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

router.put('/updateCompensation/:id', authenticationMiddleware(), compensationController.updateCompensation);

/**
 * @swagger
 * /compensation/updateCompensation/{id}:
 *   delete:
 *     summary: Delete compensation
 *     description: Delete compensation
 *     tags: ['Compensation']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: compensation deleted successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error deleting product
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

router.delete('/deleteCompensation/:id', authenticationMiddleware(), compensationController.deleteCompensation);

/**
 * @swagger
 * /compensation/getTotalWeight:
 *   get:
 *     summary: Get total weights of materials
 *     description: Retrieve total weights
 *     tags: ['Compensation']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listed all the E-Ds
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error retrieving E-Ds
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
router.get('/getTotalWeight', authenticationMiddleware(), compensationController.getTotalWeight);

/**
 * @swagger
 * /compensation/updateEndDestination/{id}:
 *   put:
 *     summary: Update an end destination
 *     description: Updates an existing end destination by ID.
 *     tags: ['Compensation']
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the end destination to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-08-13T18:30:00Z"
 *               companyId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               orgType:
 *                 type: string
 *               orgName:
 *                 type: string
 *               companyRegNo:
 *                 type: string
 *               phone:
 *                 type: string
 *                 pattern: '^\\d+$'
 *               email:
 *                 type: string
 *                 format: email
 *               contactPerson:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *             required:
 *               - date
 *               - companyId
 *               - userId
 *               - orgType
 *               - orgName
 *               - companyRegNo
 *               - phone
 *               - email
 *               - contactPerson
 *               - address
 *               - city
 *               - country
 *     responses:
 *       200:
 *         description: End destination updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 *       404:
 *         description: End destination not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
router.put('/updateEndDestination/:id', authenticationMiddleware(), compensationController.updateEndDestination);

/**
 * @swagger
 * /compensation/deleteEndDestination/{id}:
 *   delete:
 *     summary: Delete an end destination
 *     description: Deletes an existing end destination by ID.
 *     tags: ['Compensation']
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the end destination to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: End destination deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 *       404:
 *         description: End destination not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
router.delete('/deleteEndDestination/:id', authenticationMiddleware(), compensationController.deleteEndDestination);

/**
 * @swagger
 * /compensation/getEndDestination/{id}:
 *   get:
 *     summary: Get an end destination by ID
 *     description: Retrieves an end destination by its ID.
 *     tags: ['Compensation']
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the end destination to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: End destination retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EndDestination'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 *       404:
 *         description: End destination not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
router.get('/getEndDestination/:id', authenticationMiddleware(), compensationController.getEndDestinationById);

/**
 * @swagger
 * /compensation/getEndDestinations:
 *   get:
 *     summary: Get all end destinations
 *     description: Retrieve E-D with pagination
 *     tags: ['Compensation']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listed all the E-Ds
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error retrieving E-Ds
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
 *     parameters:
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
 *          - in: query
 *            name: status
 *            required: false
 *            schema:
 *              type: array of strings
 */
router.get('/getEndDestinations', authenticationMiddleware(), compensationController.getEndDestinations);

module.exports = router;
