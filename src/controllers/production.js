const { responseHelper } = require('../helpers');
const i18n = require('i18n');
const productionService = require('../services/production');

exports.createProductionPlan = async (req, res, next) => {
    try {
        req.body.userId = req.user.id;
        const response = await productionService.addProductionPlan(req.body);
        return responseHelper.created(res, response, i18n.__('PRODUCTION.PRODUCTION_PLAN_CREATED'));
    } catch (error) {
        next(error);
    }
};

exports.updateProductionPlan = async (req, res, next) => {
    try {
        // req.body.productionId = req.params.id;
        req.body.user = req.user;
        const response = await productionService.updateProductionPlan(req.body, req.params.id);
        return responseHelper.success(res, response, i18n.__('PRODUCTION.UPDATED_SUCCESSFULLY'));
    } catch (error) {
        next(error);
    }
};

exports.getAProductionPlan = async (req, res, next) => {
    try {
        const response = await productionService.getAProductionPlan(req.params.id, req.user.id);
        return responseHelper.success(res, response, i18n.__('PRODUCTION.FETCH_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.listProductionPlan = async (req, res, next) => {
    try {
        req.query.userId = req.user.id;
        const response = await productionService.getAllProductionPlan(req.query);
        return responseHelper.success(res, response, i18n.__('PRODUCTION.FETCH_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.deleteProduction = async (req, res, next) => {
    try {
        const response = await productionService.deleteProductionPlan(req.params.id, req.user.id);
        return responseHelper.success(res, response, i18n.__('PRODUCTION.DELETE_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.getProductionProductByYear = async (req, res, next) => {
    try {
        const response = await productionService.getProduction(req.params.year, req.user.id);
        return responseHelper.success(res, response, i18n.__('PRODUCTION.FETCH_SUCCESS'));
    } catch (error) {
        next(error);
    }
};
