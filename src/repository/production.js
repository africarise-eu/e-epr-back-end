const db = require('../database/models');

exports.addProduction = (params, transaction) => {
    return db.Production.create(params, { transaction });
};

exports.createProductionProduct = (paramArr, transaction) => {
    return db.ProductionProduct.bulkCreate(paramArr, { transaction });
};

exports.getProductionCount = (id, year) => {
    return db.Production.count({
        where: {
            companyId: id,
            planYear: year,
        },
    });
};

exports.updateProductionPlan = (whereQuery, updateQuery) => {
    return db.Production.update(updateQuery, {
        where: whereQuery,
    });
};

exports.removeProductionProduct = (id) => {
    return db.ProductionProduct.destroy({
        where: {
            productionId: id,
        },
    });
};

exports.getProductionStatus = (id, status, planYear) => {
    return db.Production.findOne({
        where: {
            companyId: id,
            status: status,
            planYear: planYear,
        },
    });
};

exports.viewProduction = (id, companyId) => {
    return db.Production.findOne({
        where: {
            id: id,
            companyId: companyId,
        },
        include: [
            {
                model: db.ProductionProduct,
                as: 'productionProduct',
                include: [
                    {
                        model: db.Product,
                        as: 'product',
                    },
                ],
            },
        ],
    });
};

exports.listProduction = (params) => {
    return db.Production.findAndCountAll({
        where: {
            companyId: params.companyId,
        },
        limit: params.limit ? (parseInt(params.limit) === -1 ? null : parseInt(params.limit)) : 10,
        offset: params.page ? (params.page - 1) * (params.limit ? params.limit : CONSTANTS.DEFAULT.limit) : 0,
    });
};

exports.deleteProduction = (id, companyId) => {
    return db.Production.destroy({
        where: {
            id: id,
            companyId: companyId,
        },
    });
};

exports.productMaterial = (id) => {
    return db.ProductMaterials.findAll({
        attributes: ['id', 'materialId', 'weight', 'taeKg', 'taeTotal', 'productId'],
        where: {
            productId: id,
        },
    });
};

exports.createProductionMaterial = (arr, transaction) => {
    return db.ProductionMaterial.bulkCreate(arr, { transaction });
};

exports.removeProductionMaterial = (id) => {
    return db.ProductionMaterial.destroy({
        where: {
            productionId: id,
        },
    });
};

exports.viewAProduction = (params) => {
    return db.Production.findOne({
        where: params,
        include: [
            {
                model: db.ProductionProduct,
                as: 'productionProduct',
                include: [
                    {
                        model: db.Product,
                        as: 'product',
                    },
                ],
            },
            {
                model: db.ProductionMaterial,
                as: 'productionMaterial',
                include: [
                    {
                        model: db.TaeFee,
                        as: 'materials',
                    },
                ],
            },
        ],
    });
};

exports.viewPreviousYearPlan = (params) => {
    return db.Production.findOne({
        where: params,
        include: [
            {
                model: db.ProductionProduct,
                as: 'productionProduct',
                attributes: ['id', 'productId', 'plan'],
            },
        ],
    });
};

exports.getProductionProduct = (whereParams) => {
    return db.ProductionProduct.findOne({
        where: whereParams,
        include: [
            {
                attributes: ['id', 'productName', 'productCategory', 'image', 'internalArticleCode'],
                model: db.Product,
                as: 'product',
            },
        ],
    });
};

exports.getProductStatus = async (productId) => {
    const productionProduct = await db.ProductionProduct.findOne({
        where: { productId },
        attributes: ['planVerification', 'actualStatus'],
    });
    if (productionProduct) {
        return productionProduct;
    } else {
        return null; 
    }
};

