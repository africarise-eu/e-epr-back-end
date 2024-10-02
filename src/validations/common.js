const Joi = require('joi');

const commonSchema = {
    pagination: {
        query: Joi.object().keys({
            search: Joi.string().trim().min(1),
            limit: Joi.number().integer().positive(),
            page: Joi.number().integer().positive(),
        }),
    },
};

module.exports = { commonSchema };
