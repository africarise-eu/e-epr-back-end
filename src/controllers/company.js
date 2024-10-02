const { responseHelper } = require('../helpers');
const userService = require('../services/user');
const companyService = require('../services/company');

const i18n = require('i18n');

exports.register = async (req, res, next) => {
    try {
        const response = await userService.addUser(req.body);
        return responseHelper.created(res, response, i18n.__('USER.ADMIN.USER_ADDED'));
    } catch (error) {
        next(error);
    }
};

exports.companyProfile = async (req, res, next) => {
    try {
        req.body.userId = req.user.id;
        const response = await companyService.addCompanyProfile(req.body);
        return responseHelper.created(res, response, i18n.__('COMPANY.COMPANY_PROFILE_ADDED'));
    } catch (error) {
        next(error);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const response = await companyService.getProfile(req.user.id, req.user.roleId);
        return responseHelper.success(res, response, i18n.__('USER.LOGIN.LOGIN_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const data = req.body;
        const response = await companyService.updateProfile(data, req.user.id);
        return responseHelper.success(res, response, i18n.__('COMPANY.PROFILE.UPDATE_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.inviteUser = async (req, res, next) => {
    try {
        const response = await companyService.inviteUser(req.body, req.user.id);
        return responseHelper.success(res, response, i18n.__('COMPANY.USERS.INVITE_USER'));
    } catch (error) {
        next(error);
    }
};

exports.listUsers = async (req, res, next) => {
    try {
        const response = await companyService.listUsers(req.query, req.user.id);
        return responseHelper.success(res, response, i18n.__('COMPANY.USERS.USERS_FETCH'));
    } catch (error) {
        next(error);
    }
};

exports.enableDisableUser = async (req, res, next) => {
    try {
        const response = await companyService.userStatusChange(req.body, req.user.id);
        return responseHelper.success(res, response, i18n.__('COMPANY.USERS.STATUS_CHANGE'));
    } catch (error) {
        next(error);
    }
};

exports.listCompany = async (req, res, next) => {
    try {
        const response = await companyService.listCompany(req.query);
        return responseHelper.success(res, response, i18n.__('COMPANY.LIST_COMPANY_SUCCESS'));
    } catch (error) {
        next(error);
    }
};
