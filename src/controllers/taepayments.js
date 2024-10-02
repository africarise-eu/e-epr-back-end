const i18n = require('i18n');
const { responseHelper } = require('../helpers');
const verifierService = require('../services/verifier');

exports.listPaymentStatus = async (req, res, next) => {
    try {
        const response = await verifierService.listPaymentStatus(req.query);
        return responseHelper.success(res, response, i18n.__('VERIFIER.PAYMENT_DETAILS'));
    } catch (error) {
        next(error);
    }
};
