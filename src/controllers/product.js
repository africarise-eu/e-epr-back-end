const { responseHelper } = require('../helpers');
const i18n = require('i18n');
const productService = require('../services/product');

exports.getTAE_Fees = async (req, res, next) => {
    try {
        const response = await productService.getTAE_Fees();
        return responseHelper.success(res, response, i18n.__('PRODUCT.TAE_FEES'));
    } catch (error) {
        next(error);
    }
};

exports.add = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await productService.addProduct(body, req.user.id);
        return responseHelper.success(res, response, i18n.__('PRODUCT.CREATE_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.getAllProducts = async (req, res, next) => {
    try {
        req.query.user = req.user;
        const response = await productService.getAllProducts(req.query, req.user.id);
        return responseHelper.success(res, response, i18n.__('PRODUCT.GET_SUCCESS'));
    } catch (error) {
        next(error);
    }
};
exports.getProductById = async (req, res, next) => {
    try {
        const response = await productService.getProductById(req.params.id);
        return responseHelper.success(res, response, i18n.__('PRODUCT.GET_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await productService.updateProduct(body, req.user.id);
        return responseHelper.success(res, response, i18n.__('PRODUCT.UPDATE_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.getProductNames = async (req, res, next) => {
    try {
        const query = req.query.query || '';
        const products = await productService.getProductNames(query);
        return responseHelper.success(res, products);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const response = await productService.deleteProducts(id, userId);
        return responseHelper.success(res, response, i18n.__('PRODUCT.DELETE_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.getApprovedProducts = async (req, res, next) => {
    try {
        const menuType = req.query.menu_type;
        const excludeIds = req.query.excludeIds;
        const response = await productService.getApprovedProducts(req.query, req.user.id, menuType, excludeIds);
        return responseHelper.success(res, response, i18n.__('PRODUCT.GET_SUCCESS'));
    } catch (error) {
        next(error);
    }
};
