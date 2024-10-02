const express = require('express');
const productionController = require('../controllers/production');
const { validationMiddleware, authenticationMiddleware } = require('../middlewares');
const { productionSchema } = require('../validations/production');

const router = express.Router();

/**
 * @swagger
 *  /production:
 *  post:
 *      summary: Create a production plan
 *      description: Register a company or a user
 *      tags: ['Production']
 *      responses:
 *       201:
 *         description: Production plan created
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Production already exist
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               isDraft:
 *                 type: boolean
 *               product:
 *                 type: array
 *                 items:
 *                  type: object
 *                  properties:
 *                      productId:
 *                          type: integer
 *                      plan:
 *                          type: number
 *                      actual:
 *                          type: number
 *
 */
router.post(
    '/',
    authenticationMiddleware(),
    validationMiddleware(productionSchema.createProduction),
    productionController.createProductionPlan
);

/**
 * @swagger
 *  /production/{id}:
 *  patch:
 *      summary: Update a production plan
 *      description: RUpdate a production plan
 *      tags: ['Production']
 *      responses:
 *       201:
 *         description: Production plan created
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Production already exist
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
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               isDraft:
 *                 type: boolean
 *               product:
 *                 type: array
 *                 items:
 *                  type: object
 *                  properties:
 *                      productId:
 *                          type: integer
 *                      plan:
 *                          type: number
 *                      actual:
 *                          type: number
 *
 */
router.patch(
    '/:id',
    authenticationMiddleware(),
    validationMiddleware(productionSchema.createProduction),
    productionController.updateProductionPlan
);

/**
 * @swagger
 *  /production/{id}:
 *  get:
 *      summary: Get a production plan
 *      description: Get a production plan
 *      tags: ['Production']
 *      responses:
 *       200:
 *         description: Get a production plan
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 */
router.get('/:id', authenticationMiddleware(), productionController.getAProductionPlan);

/**
 * @swagger
 *  /production:
 *  get:
 *      summary: List Production plan
 *      description: List Production plan
 *      tags: ['Production']
 *      responses:
 *       200:
 *         description: List all company
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 */
router.get('/', authenticationMiddleware(), productionController.listProductionPlan);

/**
 * @swagger
 *  /production/{id}:
 *  delete:
 *      summary: Delete production plan
 *      description: List Production plan
 *      tags: ['Production']
 *      responses:
 *       200:
 *         description: List all company
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: params
 *            name: id
 *            schema:
 *              type: integer
 */
router.delete('/:id', authenticationMiddleware(), productionController.deleteProduction);

/**
 * @swagger
 *  /production/list-product/{year}:
 *  get:
 *      summary: Get a production plan by Year
 *      description: Get a production plan by Year
 *      tags: ['Production']
 *      responses:
 *       200:
 *         description: Get a production plan
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: path
 *            name: year
 *            schema:
 *              type: integer
 */
router.get('/list-product/:year', authenticationMiddleware(), productionController.getProductionProductByYear);

module.exports = router;
