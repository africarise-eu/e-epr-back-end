const express = require('express');
const { authenticationMiddleware } = require('../middlewares');
const router = express.Router();
const importController = require('../controllers/importshipments');

/**
 * @swagger
 * /imports/addImports:
 *   post:
 *     summary: To add imports
 *     description: Create imports
 *     tags: ['Imports']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Import created successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error creating import
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cdNo:
 *                 type: string
 *               etaDate:
 *                 type: date
 *               productUnits:
 *                 type: string
 *               taeValue:
 *                 type: string
 *               payStatus:
 *                 type: string  
 *               arrivalPort:
 *                 type: integer
 *               countryId:
 *                 type: integer
 *               fromPort:
 *                 type: string
 *               status:
 *                 type: string
 *               products: 
 *                 type: array  
 *                 properties:
 *                   units:
 *                     type: string
 */
router.post('/addImports',authenticationMiddleware(),importController.addImports);

/**
 * @swagger
 * /imports/updateImports:
 *   patch:
 *     summary: To update imports
 *     description: Update imports
 *     tags: ['Imports']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Import updated successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error updating import
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cdNo:
 *                 type: string
 *               etaDate:
 *                 type: date
 *               productUnits:
 *                 type: string
 *               taeValue:
 *                 type: string
 *               payStatus:
 *                 type: string  
 *               arrivalPort:
 *                 type: integer
 *               countryId:
 *                 type: integer
 *               fromPort:
 *                 type: string
 *               status:
 *                 type: string
 *               products: 
 *                 type: array  
 *                 properties:
 *                   units:
 *                     type: string
 */
router.patch('/updateImports',authenticationMiddleware(),importController.updateImports);

/**
 * @swagger
 *  /imports/getImports:
 *  get:
 *      summary: List imports
 *      description: List imports
 *      tags: ['Imports']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List of imports
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error getting imports
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
 *          - in: query
 *            name: status
 *            required: false
 *            schema:
 *              type: array of strings
 */
router.get('/getImports',authenticationMiddleware(),importController.getImports);

/**
 * @swagger
 * /imports/getImport:
 *   get:
 *     summary: Get import using id
 *     description: Retrieve a single import details
 *     tags: ['Imports']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Selected import details retrieved successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error retrieving selected import
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
router.get('/getImport/:id',authenticationMiddleware(),importController.getImportById);

/**
 * @swagger
 * /imports/getTaeStatus:
 *   get:
 *     summary: Get import details by year
 *     description: Retrieve import details by year
 *     tags: ['Imports']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Selected import details retrieved successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error retrieving import details
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
 *         - in: query
 *           name: year
 *           required: true
 *           schema:
 *             type: string
 */
router.get('/getTaeStatus',authenticationMiddleware(),importController.getImportByYear);

/**
 * @swagger
 * /imports/:
 *   delete:
 *     summary: Delete import
 *     description: Delete import along with products
 *     tags: ['Imports']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Import deleted successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error deleting import
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
router.delete('/:id',authenticationMiddleware(),importController.deleteImports);

module.exports = router;