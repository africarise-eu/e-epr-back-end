const Joi = require('joi');

const adminSchema = {
    inviteUser: {
        body: Joi.object().keys({
            email: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            roleId: Joi.number().integer().positive().valid(2, 3).required(),
        }),
    },
};

module.exports = { adminSchema };
