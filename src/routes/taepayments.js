const express = require('express');
const {  authenticationMiddleware } = require('../middlewares');
const controller = require('../controllers/taepayments');
const router = express.Router();

/**
 * @swagger
 *  /taepayments/payment:
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
router.get('/payment', authenticationMiddleware(), controller.listPaymentStatus);

module.exports = router;