const { responseHelper } = require('../helpers');
const i18n = require('i18n');
const compensationService = require('../services/compensation');

exports.addCompensation = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await compensationService.addCompensation(body, req.user.id);
        return responseHelper.success(res, response, i18n.__('COMPENSATION.CREATE_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.addEndDestination = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await compensationService.addEndDestination(body, req.user.id);
        return responseHelper.success(res, response, i18n.__('ENDDESTINATION.CREATE_CUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.getCompensationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const compensation = await compensationService.getCompensationById(id);
        return responseHelper.success(res, compensation, i18n.__('COMPENSATION.FETCH_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.getAllCompensations = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const companyId = req.query.companyId;
        const compensations = await compensationService.getAllCompensations(req.query, userId, companyId);
        return responseHelper.success(res, compensations, i18n.__('COMPENSATION.FETCH_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.getEndDestinationsByCompany = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, search = '' } = req.query;

        const response = await compensationService.getEndDestinationsByCompany(userId, {
            page,
            limit,
            search
        });

        return responseHelper.success(res, response, i18n.__('ENDDESTINATION.FETCH_SUCCESS'));
    } catch (error) {
        next(error);
    }
};


exports.getEndDestinations = async (req, res, next) => {
    try {
        const response = await compensationService.getEndDestinations();
        return responseHelper.success(res, response, i18n.__('ENDDESTINATION.FETCH_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.updateCompensation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const params = req.body;
        const userId = req.user.id;
        const response = await compensationService.updateCompensation(id, params, userId);
        return responseHelper.success(res, response, i18n.__('COMPENSATION.UPDATE_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.deleteCompensation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await compensationService.deleteCompensation(id);
        return responseHelper.success(res, response, i18n.__('COMPENSATION.DELETE_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.getTotalWeight = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const response = await compensationService.getTotalWeight(req.query, userId);
        return responseHelper.success(res, response, i18n.__('COMPENSATION.TOTAL_WEIGHT_FETCH_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.updateEndDestination = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const response = await compensationService.updateEndDestination(id, body);
        return responseHelper.success(res, response, i18n.__('ENDDESTINATION.UPDATE_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.deleteEndDestination = async (req, res, next) => {
    try {
        const { id } = req.params;
        await compensationService.deleteEndDestination(id);
        return responseHelper.success(res, null, i18n.__('ENDDESTINATION.DELETE_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.getEndDestinationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await compensationService.getEndDestinationById(id);
        if (!response) {
            return responseHelper.error(res, i18n.__('ENDDESTINATION.NOT_FOUND'), 404);
        }
        return responseHelper.success(res, response, i18n.__('ENDDESTINATION.FETCH_SUCCESS'));
    } catch (error) {
        next(error);
    }
};
