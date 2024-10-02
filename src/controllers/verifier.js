const i18n = require('i18n');
const { responseHelper } = require('../helpers');
const verifierService = require('../services/verifier');

exports.getCounts = async (req, res, next) => {
    try {
        const response = await verifierService.getPendingCounts();
        return responseHelper.success(res, response, i18n.__('VERIFIER.COUNT_FETCHED'));
    } catch (error) {
        next(error);
    }
};

exports.listAllVerifier = async (req, res, next) => {
    try {
        req.query.user = req.user;
        const response = await verifierService.listVerifier(req.query);
        return responseHelper.success(res, response, i18n.__('VERIFIER.COUNT_FETCHED'));
    } catch (error) {
        next(error);
    }
};

exports.changeCompanyStatus = async (req, res, next) => {
    try {
        const response = await verifierService.changeCompanyStatus(req.body, req.user.id);
        return responseHelper.success(res, response, i18n.__('VERIFIER.COMPANY_STATUS'));
    } catch (error) {
        next(error);
    }
};

exports.changeProductStatus = async (req, res, next) => {
    try {
        const response = await verifierService.changeProductStatus(req.body, req.user.id);
        return responseHelper.success(res, response, i18n.__('VERIFIER.PRODUCT_STATUS'));
    } catch (error) {
        next(error);
    }
};

exports.listCompany = async (req, res, next) => {
    try {
        const response = await verifierService.listAllCompany(req.query);
        return responseHelper.success(res, response, i18n.__('VERIFIER.COMPANY_FETCHED'));
    } catch (error) {
        next(error);
    }
};

exports.listProduct = async (req, res, next) => {
    try {
        const response = await verifierService.listAllProduct(req.query);
        return responseHelper.success(res, response, i18n.__('VERIFIER.COMPANY_FETCHED'));
    } catch (error) {
        next(error);
    }
};

exports.updateMaterial = async (req, res, next) => {
    try {
        const response = await verifierService.changeMaterialStatus(req.body);
        return responseHelper.success(res, response, i18n.__('VERIFIER.PRODUCT_STATUS'));
    } catch (error) {
        next(error);
    }
};

exports.getAllProduction = async (req, res, next) => {
    try {
        const response = await verifierService.getAllProduction(req.params.id, req.query);
        return responseHelper.success(res, response, i18n.__('VERIFIER.PRODUCTION_PLAN_FETCH'));
    } catch (error) {
        next(error);
    }
};

exports.updateProductionPlan = async (req, res, next) => {
    try {
        const response = await verifierService.updateProductionPlanStatus(req.body, req.user.id);
        return responseHelper.success(res, response, i18n.__('VERIFIER.PRODUCT_STATUS'));
    } catch (error) {
        next(error);
    }
};

exports.getCompanyProfile = async (req, res, next) => {
    try {
        const response = await verifierService.getCompanyProfile(req.params.id);
        return responseHelper.success(res, response, i18n.__('COMPANY.LIST_COMPANY_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.getAProductionPlan = async (req, res, next) => {
    try {
        const response = await verifierService.getProductionPlanById(req.params.id);
        return responseHelper.success(res, response, i18n.__('VERIFIER.PRODUCTION_PLAN_FETCH'));
    } catch (error) {
        next(error);
    }
};

exports.getEndDestination = async (req, res, next) => {
    try {
        const response = await verifierService.getEndDestination(req.query);
        return responseHelper.success(res, response, i18n.__('COMPANY.LIST_COMPANY_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.updateCompensation = async (req, res, next) => {
    try {
        const response = await verifierService.updateCompensation(req.body, req.user.id);
        return responseHelper.success(res, response, i18n.__('VERIFIER.COMPENSATION_STATUS'));
    } catch (error) {
        next(error);
    }
};

exports.updateEndDestination = async (req, res, next) => {
    try {
        const response = await verifierService.changeEndDestinationStatus(req.body, req.user.id);
        return responseHelper.success(res, response, i18n.__('VERIFIER.END_DESTINATION_STATUS'));
    } catch (error) {
        next(error);
    }
};

exports.listImportByCompany = async (req, res, next) => {
    try {
        const response = await verifierService.getAllImport(req.params.id, req.query);
        return responseHelper.success(res, response, i18n.__('VERIFIER.IMPORT_FETCH'));
    } catch (error) {
        next(error);
    }
};

exports.updateImport = async (req, res, next) => {
    try {
        const response = await verifierService.updateImport(req.body, req.user.id);
        return responseHelper.success(res, response, i18n.__('VERIFIER.IMPORT_UPDATE'));
    } catch (error) {
        next(error);
    }
};

exports.listLogs = async (req, res, next) => {
    try {
        const response = await verifierService.listLogs(req.query, req.params.userId);
        return responseHelper.success(res, response, i18n.__('VERIFIER.LOGS_FETCHED'));
    } catch (error) {
        next(error);
    }
};

exports.listPaymentStatus = async (req, res, next) => {
    try {
        const response = await verifierService.listPaymentStatus(req.query);
        return responseHelper.success(res, response, i18n.__('VERIFIER.PAYMENT_DETAILS'));
    } catch (error) {
        next(error);
    }
};

exports.getLogByObjectId = async (req, res, next) => {
    try {
        const response = await verifierService.listLogByObject(req.query);
        return responseHelper.success(res, response, i18n.__('VERIFIER.LOGS_FETCHED'));
    } catch (error) {
        next(error);
    }
};

exports.listAllProductionCompany = async (req, res, next) => {
    try {
        const response = await verifierService.listAllProductionCompany(req.query);
        return responseHelper.success(res, response, i18n.__('VERIFIER.LOGS_FETCHED'));
    } catch (error) {
        next(error);
    }
};
