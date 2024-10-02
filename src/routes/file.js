const express = require('express');
const fileController = require('../controllers/fileController');
const router = express.Router();

/**
 * @swagger
 *  /file/upload:
 *  post:
 *      summary: Upload file
 *      description: Invite user to company
 *      tags: ['File']
 *      responses:
 *       201:
 *         description: File uploaded
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: File upload failed
 *         content:
 *          multipart/form-data::
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *      parameters:
 *          - in: header
 *            name: path
 *            required: true
 *            schema:
 *              type: string
 *              description: Custom header for the request
 *      requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *              type: object
 *              properties:
          # 'file' will be the field name in this multipart request
 *                  file:
 *                      type: string
 *                      format: binary
 */
router.post('/upload', fileController.uploadFile);

/**
 * @swagger
 *  /file/singed-url:
 *  get:
 *      summary: List users
 *      description: Invite user to company
 *      tags: ['File']
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
 *            name: path
 *            required: true
 *            schema:
 *              type: string
 */
router.get('/signed-url', fileController.getSignedUrl);

/**
 * @swagger
 *  /file/upload-multiple:
 *  post:
 *      summary: Upload multiple files
 *      description: Upload multiple files to S3 and return the URLs
 *      tags: ['File']
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          files:
 *                              type: array
 *                              items:
 *                                  type: string
 *                                  format: binary
 *      responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          url:
 *                              type: string
 *                              description: URL of the uploaded file
 *       400:
 *         description: Bad Request
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BadRequest'
 *       500:
 *         description: Internal Server Error
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/InternalServerError'
 */
router.post('/upload-multiple', fileController.uploadMultipleFiles);



module.exports = router;
