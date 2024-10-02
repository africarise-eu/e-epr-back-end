const Joi = require('joi');
const country = require('../database/models/country');

const companySchema = {
    addUser: {
        body: Joi.object().keys({
            firstName: Joi.string().trim().min(1).max(30).required(),
            lastName: Joi.string().trim().min(1).max(30).required(),
            email: Joi.string().min(1).max(100).email().required(),
            password: Joi.string().trim().min(8).max(32).trim().required(),
            companyId: Joi.number().optional(),
        }),
    },
    createCompanyProfile: {
        body: Joi.object().keys({
            companyName: Joi.string().required(),
            isProducer: Joi.boolean().required(),
            isImporter: Joi.boolean().required(),
            registrationNumber: Joi.string().required(),
            activityCode: Joi.string().required(),
            address: Joi.string().required(),
            city: Joi.number().integer().positive().required(),
            country: Joi.number().integer().positive().required(),
            phoneNumber: Joi.string().required(),
            bankAccount: Joi.string().allow('', null),
            // person: Joi.string().required(),
            website: Joi.string().required(),
            logo: Joi.string().allow('', null),
        }),
    },
    inviteUser: {
        body: Joi.object().keys({
            email: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
        }),
    },
    pagination: {
        query: Joi.object().keys({
            search: Joi.string(),
            page: Joi.number(),
            limit: Joi.number(),
            status: Joi.string(),
        }),
    },
    status: {
        body: Joi.object().keys({
            userId: Joi.number().integer().min(1).required(),
            status: Joi.string().required().valid('enabled', 'disabled'),
        }),
    },
};

module.exports = { companySchema };
