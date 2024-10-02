const express = require('express');
const { validationMiddleware, authenticationMiddleware } = require('../middlewares');
const verifierController = require('../controllers/verifier');
const { verifierSchema, pagination } = require('../validations/verifier');
const router = express.Router();

/**
 * @swagger
 *  /verifier:
 *  get:
 *      summary: Counts for verifier
 *      description: Counts for verifier
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all company
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 */
router.get('/', authenticationMiddleware([2]), verifierController.getCounts);

/**
 * @swagger
 *  /verifier/list-verifier:
 *  get:
 *      summary: List all verifier
 *      description: List all verifier
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all company
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 */
router.get('/list-verifier', authenticationMiddleware([2]), verifierController.listAllVerifier);

/**
 * @swagger
 *  /verifier/company:
 *  patch:
 *      summary: Update company status
 *      description: Update company status
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all company
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 *                          id:
 *                              type: integer
 *                          rejectedReason:
 *                              type: string
 */
router.patch(
    '/company',
    authenticationMiddleware([2]),
    validationMiddleware(verifierSchema.changeStatus),
    verifierController.changeCompanyStatus
);

/**
 * @swagger
 *  /verifier/product:
 *  patch:
 *      summary: Update product status
 *      description: Update product status
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all company
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 *                          id:
 *                              type: integer
 *                          rejectedReason:
 *                              type: string
 */
router.patch(
    '/product',
    authenticationMiddleware([2]),
    validationMiddleware(verifierSchema.changeStatus),
    verifierController.changeProductStatus
);

/**
 * @swagger
 *  /verifier/company:
 *  get:
 *      summary: List Company
 *      description: List Company
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all city
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 *          - in: query
 *            name: status
 *            schema:
 *              type: string
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 */
router.get('/company', authenticationMiddleware([2]), verifierController.listCompany);

/**
 * @swagger
 *  /verifier/product:
 *  get:
 *      summary: List Product
 *      description: List product
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all city
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 *          - in: query
 *            name: status
 *            schema:
 *              type: string
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *          - in: query
 *            name: companyId
 *            schema:
 *              type: integer
 */
router.get('/product', authenticationMiddleware([2]), verifierController.listProduct);

/**
 * @swagger
 *  /verifier/material:
 *  patch:
 *      summary: Update product status
 *      description: Update product status
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all company
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 *                          id:
 *                              type: integer
 *                          rejectedReason:
 *                              type: string
 */
router.patch('/material', authenticationMiddleware([2]), verifierController.updateMaterial);

// router.patch('/production', authenticationMiddleware([2]), verifierController.updateProductionPlan)
/**
 * @swagger
 *  /verifier/production/{id}:
 *  get:
 *      summary: List Production
 *      description: List production
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all city
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 */
router.get('/production/:id', authenticationMiddleware([2]), verifierController.getAllProduction);

/**
 * @swagger
 *  /verifier/production:
 *  patch:
 *      summary: Update production status
 *      description: Update product status
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all company
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          planVerification:
 *                              type: string
 *                          id:
 *                              type: integer
 *                          actualStatus:
 *                              type: string
 *                          planRejectReason:
 *                              type: string
 *                          actualRejectedReason:
 *                              type: string
 */
router.patch('/production', authenticationMiddleware([2]), verifierController.updateProductionPlan);

/**
 * @swagger
 *  /verifier/company/{id}:
 *  get:
 *      summary: company profile
 *      description: List production
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all city
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 */
router.get('/company/:id', authenticationMiddleware([2]), verifierController.getCompanyProfile);

/**
 * @swagger
 *  /verifier/production-plan/{id}:
 *  get:
 *      summary: List Production by production id
 *      description: List production
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all city
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 */
router.get('/production-plan/:id', authenticationMiddleware([2]), verifierController.getAProductionPlan);

/**
 * @swagger
 *  /verifier/end-destination:
 *  get:
 *      summary: List end destination
 *      description: List production
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all city
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 */
router.get('/end-destination', authenticationMiddleware([2]), verifierController.getEndDestination);

/**
 * @swagger
 *  /verifier/compensation:
 *  patch:
 *      summary: Update compensation status
 *      description: Update product status
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all company
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 *                          id:
 *                              type: integer
 *                          rejectedReason:
 *                              type: string
 */
router.patch(
    '/compensation',
    authenticationMiddleware([2]),
    validationMiddleware(verifierSchema.changeStatus),
    verifierController.updateCompensation
);

/**
 * @swagger
 *  /verifier/end-destination:
 *  patch:
 *      summary: Update end destination status
 *      description: Update product status
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all company
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 *                          id:
 *                              type: integer
 *                          rejectedReason:
 *                              type: string
 */
router.patch(
    '/end-destination',
    authenticationMiddleware([2]),
    validationMiddleware(verifierSchema.changeStatus),
    verifierController.updateEndDestination
);

/**
 * @swagger
 *  /verifier/import/{id}:
 *  get:
 *      summary: List import
 *      description: List product
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all city
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *          - in: query
 *            name: status
 *            schema:
 *              type: string
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 */
router.get('/import/:id', authenticationMiddleware([2]), verifierController.listImportByCompany);

/**
 * @swagger
 *  /verifier/import:
 *  patch:
 *      summary: Update import status
 *      description: Update end import status
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: Update end import status
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 *                          id:
 *                              type: integer
 *                          rejectedReason:
 *                              type: string
 */
router.patch('/import', authenticationMiddleware([2]), validationMiddleware(verifierSchema.changeStatus), verifierController.updateImport);

/**
 * @swagger
 *  /verifier/logs/{userId}:
 *  get:
 *      summary: List Logs
 *      description: List LOgs
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all logs
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: integer
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 */
router.get('/logs/:userId', authenticationMiddleware([2]), verifierController.listLogs);

/**
 * @swagger
 *  /verifier/payment:
 *  get:
 *      summary: List Logs
 *      description: List LOgs
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all logs
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: query
 *            name: companyId
 *            schema:
 *              type: integer
 */
router.get('/payment', authenticationMiddleware([2]), verifierController.listPaymentStatus);

/**
 * @swagger
 *  /verifier/detailed-log:
 *  get:
 *      summary: List Logs
 *      description: List LOgs
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all logs
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: query
 *            name: objectType
 *            schema:
 *              type: integer
 *          - in: query
 *            name: id
 *            schema:
 *              type: integer
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 */
router.get(
    '/detailed-log',
    authenticationMiddleware(),
    validationMiddleware(verifierSchema.detailedLog),
    verifierController.getLogByObjectId
);

/**
 * @swagger
 *  /verifier/all-production:
 *  get:
 *      summary: List company for production
 *      description: List LOgs
 *      tags: ['Verifier']
 *      security:
 *      - bearerAuth: []
 *      responses:
 *       200:
 *         description: List all logs
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 */
router.get('/all-production', authenticationMiddleware([2]), verifierController.listAllProductionCompany);
module.exports = router;
