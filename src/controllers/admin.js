const i18n = require('i18n');
const adminService = require('../services/admin');
const { responseHelper } = require('../helpers');

exports.inviteUsers = async (req, res, next) => {
    try {
        const response = await adminService.inviteUsers(req.body);
        return responseHelper.success(res, response, i18n.__('COMMON.PORT_FETCH'));
    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const { search = '', status = '', limit = 10, page = 1 } = req.query;
        const response = await adminService.getAllUsers({ search, status, limit, page });
        return responseHelper.success(res, response, i18n.__('USER.ADMIN.USER_FETCH_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.toggleUserStatus = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        const response = await adminService.toggleUserStatus(userId, status);
        const message = status ? i18n.__('USER.ADMIN.USER_ACTIVATED') : i18n.__('USER.ADMIN.USER_BLOCKED');
        return responseHelper.success(res, response, message);
    } catch (error) {
        next(error);
    }
};

exports.getTaePayments = async (req, res, next) => {
    try {
        const { year, search = '', paymentType = '', limit = 10, page = 1 } = req.query;
        const response = await adminService.getTaePayments(year, search, paymentType, limit, page);
        return responseHelper.success(res, response, i18n.__('USER.ADMIN.TAEPAYMENT_FETCH_SUCCESS'));
    } catch (error) {
        next(error);
    }
};
