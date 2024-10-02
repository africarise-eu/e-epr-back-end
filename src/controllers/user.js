const { responseHelper } = require('../helpers');
const userService = require('../services/user');
const i18n = require('i18n');

exports.login = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await userService.login(body);
        return responseHelper.success(res, response, i18n.__('USER.LOGIN.LOGIN_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.sendOtp = async (req, res, next) => {
    try {
        const email = req.body.email;
        const response = await userService.otpSend(email);
        return responseHelper.success(res, response, i18n.__('USER.OTP_SEND'));
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const body = req.body;
        const response = await userService.resetPassword(body);
        return responseHelper.success(res, response, i18n.__('USER.PASSWORD_CHANGE'));
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const body = req.body;
        body.userId = req.user.id;
        const response = await userService.changePassword(body);
        return responseHelper.success(res, response, i18n.__('USER.PASSWORD_CHANGE'));
    } catch (error) {
        next(error);
    }
};

exports.changePasswordOtp = async (req, res, next) => {
    try {
        const email = req.user.email;
        const response = await userService.otpSend(email);
        return responseHelper.success(res, response, i18n.__('USER.OTP_SEND'));
    } catch (error) {
        next(error);
    }
};

exports.verifyOtp = async (req, res, next) => {
    try {
        const otp = req.body.otp;
        const token = req.body.token;
        const response = await userService.otpVerify({ otp, token });
        return responseHelper.success(res, response, i18n.__('USER.OTP_VERIFIED'));
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const id = req.user.id;
        const response = await userService.logout(id);
        return responseHelper.success(res, response, i18n.__('USER.LOGOUT_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.setPassword = async (req, res, next) => {
    try {
        const response = await userService.setPasswordInviteUser(req.body);
        return responseHelper.success(res, response, i18n.__('USER.PASSWORD_SET'));
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const response = await userService.updateProfile(req.body, req.user.id);
        return responseHelper.success(res, response, i18n.__('USER.USER_UPDATE'));
    } catch (error) {
        next(error);
    }
};

exports.verifyEmailOtp = async (req, res, next) => {
    try {
        const response = await userService.verifyEmailOtp(req.user.email);
        return responseHelper.success(res, response, i18n.__('USER.EMAIL_SENT_VERIFICATION'));
    } catch (error) {
        next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const response = await userService.emailVerificationOtp(req.user.id, req.body.otp);
        return responseHelper.success(res, response, i18n.__('USER.EMAIL_VERIFIED'));
    } catch (error) {
        next(error);
    }
};
