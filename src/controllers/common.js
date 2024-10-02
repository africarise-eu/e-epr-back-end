const { responseHelper } = require('../helpers');
const i18n = require('i18n');
const commonService = require('../services/common');

exports.listAllCountry = async (req, res, next) => {
    try {
        const response = await commonService.listCountries(req.query);
        return responseHelper.success(res, response, i18n.__('COMMON.COUNTRY_FETCH'));
    } catch (error) {
        next(error);
    }
};

exports.listAllCities = async (req, res, next) => {
    try {
        const response = await commonService.listCities(req.query, req.params.id);
        return responseHelper.success(res, response, i18n.__('COMMON.CITY_FETCH'));
    } catch (error) {
        next(error);
    }
};

exports.listAllPorts = async (req, res, next) => {
    try {
        const response = await commonService.listPorts(req.query, req.params.id);
        return responseHelper.success(res, response, i18n.__('COMMON.PORT_FETCH'));
    } catch (error) {
        next(error);
    }
};
