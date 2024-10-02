const express = require('express');
const companyRoutes = require('./company');
const userRoutes = require('./user');
const productRoutes = require('./product');
const taepaymentsRoutes = require('./taepayments');
const packingmaterialRoutes = require('./packingmaterial');
const file = require('./file');
const productionRoutes = require('./production');
const commonRoutes = require('./common');
const importRoutes = require('./importshipments');
const compensation = require('./compensation');
const adminRoutes = require('./admin');
const verifierRoutes = require('./verifier');

const router = express.Router();

router.use('/company', companyRoutes);
router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/material', packingmaterialRoutes);
router.use('/file', file);
router.use('/production', productionRoutes);
router.use('/', commonRoutes);
router.use('/imports', importRoutes);
router.use('/admin', adminRoutes);
router.use('/verifier', verifierRoutes);
router.use('/compensation',compensation);
router.use('/taepayments',taepaymentsRoutes);

module.exports = router;
