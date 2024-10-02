const Joi = require('joi');
const i18n = require('i18n');

const userSchema = {
    login: {
        body: Joi.object().keys({
            email: Joi.string().trim().email().required(),
            password: Joi.string().trim().min(8).max(32).trim().required(),
        }),
    },
    pagination: {
        query: Joi.object().keys({
            search: Joi.string().trim().min(1),
            status: Joi.string().trim().min(1).max(30).valid('active', 'inactive'),
            limit: Joi.number().integer().positive(),
            page: Joi.number().integer().positive(),
            role: Joi.alternatives().try(Joi.string().guid(), Joi.array().items(Joi.string().guid())),
        }),
    },
    addUser: {
        body: Joi.object().keys({
            name: Joi.string().trim().min(1).max(30).required(),
            email: Joi.string().min(1).max(100).required(),
            roles: Joi.array().items(Joi.string().guid()),
        }),
    },
    updateUser: {
        body: Joi.object().keys({
            name: Joi.string().trim().min(1).max(30),
            email: Joi.string().min(1).max(100),
            roles: Joi.array().items(Joi.string().guid()),
        }),
    },
    email: {
        body: Joi.object().keys({
            email: Joi.string().trim().email().required().label('Email'),
        }),
    },
    resetPassword: {
        body: Joi.object().keys({
            otp: Joi.number().integer().positive().min(100000).max(999999).required(),
            newPassword: Joi.string().trim().min(8).max(32).required(),
            token: Joi.string().required(),
        }),
    },
    changePassword: {
        body: Joi.object().keys({
            currentPassword: Joi.string().trim().min(8).max(32).required(),
            newPassword: Joi.string().trim().min(8).max(32).required(),
            otp: Joi.number().integer().positive().min(100000).max(999999).required(),
            token: Joi.string().required(),
        }),
    },
    otp: {
        body: Joi.object().keys({
            token: Joi.string().required(),
            otp: Joi.number().integer().positive().min(100000).max(999999).required(),
        }),
    },
    setPassword: {
        body: Joi.object().keys({
            url: Joi.string().required(),
            password: Joi.string().required(),
        }),
    },
    userUpdate: {
        body: Joi.object().keys({
            email: Joi.string().trim().email(),
            firstName: Joi.string().trim(),
            lastName: Joi.string().trim(),
            profileImage: Joi.string().trim().allow(''),
        }),
    },
    verifyEmail: {
        body: Joi.object().keys({
            otp: Joi.number().integer().positive().min(100000).max(999999).required(),
        }),
    },
};

module.exports = { userSchema };
