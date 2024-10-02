const express = require('express');
const { validationMiddleware, authenticationMiddleware } = require('../middlewares');
const productController = require('../controllers/product');
// const { userSchema } = require('../validations/user');
const router = express.Router();

/**
 * @swagger
 * /product/getTAE_Fees:
 *   get:
 *     summary: Get TAE Fees
 *     description: Retrieve TAE Fees
 *     tags: ['Products']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: TAE Fees retrieved successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error retrieving TAE Fees
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
router.get('/getTAE_Fees', authenticationMiddleware(), productController.getTAE_Fees);

/**
 * @swagger
 * /product/add:
 *   post:
 *     summary: To add products
 *     description: Create products
 *     tags: ['Products']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error creating product
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
 *               productName:
 *                 type: string
 *               productCategory:
 *                 type: string
 *               image:
 *                 type: string
 *               production:
 *                 type: string
 *               manufacturerCompany:
 *                 type: string  
 *               countryOfManufacture:
 *                 type: integer
 *               productModelTypeVolume:
 *                 type: string
 *               barcode:
 *                 type: string
 *               internalArticleCode:
 *                 type: string
 *               packingMaterials:
 *                 type: array
 *                 items:
 *                   type: string
 *                   properties:
 *                     material:
 *                       type: string
 *                     weight:
 *                       type: number
 *                     taeKg:
 *                       type: number   
 *                     taeTotal: 
 *                       type: number
 */
router.post('/add', authenticationMiddleware(), productController.add);

/**
 * @swagger
 * /product/getAllProducts:
 *   get:
 *     summary: Get all products
 *     description: Retrieve products with pagination
 *     tags: ['Products']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listed all the products
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error retrieving products
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
router.get('/getAllProducts', authenticationMiddleware(), productController.getAllProducts);

/**
 * @swagger
 * /product/getProduct:
 *   get:
 *     summary: Get product using id
 *     description: Retrieve a single product details
 *     tags: ['Products']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Selected product details retrieved successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error retrieving selected product
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
router.get('/getProduct/:id', authenticationMiddleware(), productController.getProductById);

/**
 * @swagger
 * /product/updateProduct:
 *   patch:
 *     summary: Edit product
 *     description: Edit selected product
 *     tags: ['Products']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updated selected product successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error updating selected product
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
 *               productName:
 *                 type: string
 *               productCategory:
 *                 type: string
 *               image:
 *                 type: string
 *               production:
 *                 type: string
 *               manufacturerCompany:
 *                 type: string  
 *               countryOfManufacture:
 *                 type: integer
 *               productModelTypeVolume:
 *                 type: string
 *               barcode:
 *                 type: string
 *               internalArticleCode:
 *                 type: string
 *               packingMaterials:
 *                 type: array
 *                 items:
 *                   type: string
 *                   properties:
 *                     material:
 *                       type: string
 *                     weight:
 *                       type: number
 *                     taeKg:
 *                       type: number   
 *                     taeTotal: 
 *                       type: number
 */
router.patch('/updateProduct', authenticationMiddleware(), productController.updateProduct);

/**
 * @swagger
 * /product/productName:
 *   get:
 *     summary: Get products by product name
 *     description: Retrieve product by product name for autosearch and complete
 *     tags: ['Products']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Result retrieved successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error retrieving product
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
router.get('/productName', authenticationMiddleware(), productController.getProductNames);

/**
 * @swagger
 * /product/:
 *   delete:
 *     summary: Delete product
 *     description: Delete product along with materials
 *     tags: ['Products']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product deleted successfully
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
router.delete('/:id', authenticationMiddleware(), productController.deleteProduct);

/**
 * @swagger
 * /product/getApprovedProducts:
 *   get:
 *     summary: Get approved products
 *     description: Retrieve products where status is approved
 *     tags: ['Products']
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved product retrieved successfully
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error retrieving product
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
router.get('/getApprovedProducts', authenticationMiddleware(), productController.getApprovedProducts);

module.exports = router;
