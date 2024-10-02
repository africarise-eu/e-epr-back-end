const { responseHelper } = require('../helpers');
const i18n = require('i18n');
const importShipmentService = require('../services/importshipments');


const handleRequest = async (serviceMethod, req, res, successMessage, next) => {
    try {
        const response = await serviceMethod(req);
        return responseHelper.success(res, response, i18n.__(successMessage));
    } catch (error) {
        next(error);
    }
};

exports.addImports = (req, res, next) => 
    handleRequest(() => importShipmentService.addImports(req.body, req.user.id), req, res, 'IMPORTSHIPMENTS.CREATE_SUCCESS', next);

exports.updateImports = (req, res, next) => 
    handleRequest(() => importShipmentService.updateImports(req.body, req.user.id), req, res, 'IMPORTSHIPMENTS.UPDATE_SUCCESS', next);

exports.getImports = (req, res, next) => 
    handleRequest(() => importShipmentService.getImports(req.query, req.user.id), req, res, 'IMPORTSHIPMENTS.FETCH_SUCCESS', next);

exports.getImportById = (req, res, next) => 
    handleRequest(() => importShipmentService.getImportById(req.params.id), req, res, 'IMPORTSHIPMENTS.FETCH_SUCCESS', next);

exports.getImportByYear = (req, res, next) => 
    handleRequest(() => importShipmentService.getImportByYear(req.query.year, req.user.id), req, res, 'IMPORTSHIPMENTS.FETCH_SUCCESS', next);

exports.deleteImports = (req, res, next) => 
    handleRequest(() => importShipmentService.deleteImports(req.params.id, req.user.id), req, res, 'IMPORTSHIPMENTS.DELETE_SUCCESS', next);


