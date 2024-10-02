const Joi = require('joi');

const productionSchema = {
    createProduction: {
        body: Joi.object().keys({
            title: Joi.string().optional(),
            description: Joi.string(),
            isDraft: Joi.boolean().required(),
            product: Joi.array()
                .items(
                    Joi.object({
                        productId: Joi.number().integer().min(1).required(),
                        plan: Joi.number().required(),
                        actual: Joi.number().required(),
                    })
                )
                .when('isDraft', {
                    is: false,
                    then: Joi.required(),
                    otherwise: Joi.optional(),
                }),
        }),
    },
};

module.exports = { productionSchema };
