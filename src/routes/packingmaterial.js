const express = require('express');
const packingmaterialController = require('../controllers/packingmaterial');
const { authenticationMiddleware } = require('../middlewares');
const router = express.Router();

router.get('/', authenticationMiddleware(), packingmaterialController.getMaterials);

module.exports = router;
