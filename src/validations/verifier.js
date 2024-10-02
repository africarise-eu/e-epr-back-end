const Joi = require('joi');

const verifierSchema = {
    changeStatus: {
        body: Joi.object().keys({
            status: Joi.string().valid('approved', 'rejected', 'delayed', 'cleared', 'notyetcleared').required(),
            id: Joi.number().integer().positive().required(),
            rejectedReason: Joi.string().when('status', {
                is: Joi.string().valid('rejected', 'notyetcleared'),
                then: Joi.required(),
                otherwise: Joi.forbidden(),
            }),
        }),
    },
    detailedLog: {
        query: Joi.object().keys({
            objectType: Joi.number().min(0).required(),
            id: Joi.number().integer().positive().required(),
            page: Joi.number().integer().positive(),
            limit: Joi.number().integer().positive(),
        }),
    },
};

module.exports = { verifierSchema };
