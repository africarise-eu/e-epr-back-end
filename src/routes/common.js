const express = require('express');
const commonController = require('../controllers/common');
const { validationMiddleware } = require('../middlewares');
const router = express.Router();
const { commonSchema } = require('../validations/common');

/**
 * @swagger
 *  /country:
 *  get:
 *      summary: List country
 *      description: List all country
 *      tags: ['Common']
 *      responses:
 *       200:
 *         description: List all company
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 */
router.get('/country', validationMiddleware(commonSchema.pagination), commonController.listAllCountry);

/**
 * @swagger
 *  /city/{id}:
 *  get:
 *      summary: List City
 *      description: List all city
 *      tags: ['Common']
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
 *            name: search
 *            schema:
 *              type: string
 */
router.get('/city/:id', validationMiddleware(commonSchema.pagination), commonController.listAllCities);

/**
 * @swagger
 *  /ports:
 *  get:
 *      summary: List Ports
 *      description: List all ports
 *      tags: ['Common']
 *      responses:
 *       200:
 *         description: List all ports
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *      parameters:
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 */
router.get('/ports',validationMiddleware(commonSchema.pagination), commonController.listAllPorts);

module.exports = router;
