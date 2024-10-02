const Sequelize = require('sequelize');
const db = require('../database/models');
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const s3 = require('../utils/s3');

exports.getTAE_Fees = () => {
    return db.TaeFee.findAll({
        where: {
            material: { [Sequelize.Op.notIn]: ['Cardboard', 'Hazardous'] },
        },
        order: [['id', 'ASC']],
    });
};

exports.createProduct = (params) => {
    return db.Product.create(params);
};

exports.getProductById = (id) => {
    return db.Product.findOne({
        where: {
            id: id,
        },
        include: [
            {
                model: db.ProductMaterials,
                as: 'ProductMaterials',
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
                include: [
                    {
                        model: db.TaeFee,
                        as: 'TaeFee',
                        attributes: ['material'],
                    },
                ],
            },
            {
                model: db.Country,
                as: 'countries',
                attributes: ['id', 'name'],
            },
        ],
    });
};

exports.updateProduct = (updateQuery, whereQuery) => {
    return db.Product.update(updateQuery, {
        where: whereQuery,
    });
};

exports.deleteProducts = (whereQuery) => {
    return db.Product.destroy({
        where: whereQuery,
    });
};

exports.totalProductAmount = (productId) => {
    return db.ProductMaterials.findAll({
        attributes: ['productId', [sequelize.fn('sum', sequelize.col('taeTotal')), 'totalAmount']],
        where: {
            productId: productId,
        },
        group: ['productId'],
        raw: true,
    });
};

exports.getProductWithSignedUrl = async (product) => {
    if (product && product.image) {
        try {
            const signedUrl = await s3.signedUrl(product.image);
            product.dataValues.actualImageUrl = signedUrl;
        } catch (error) {
            console.error('Error fetching signed URL for image:', product.image, error);
            product.dataValues.actualImageUrl = null;
        }
    } else {
        product.dataValues.actualImageUrl = null;
    }
    return product;
};

exports.getApprovedProducts = (params, companyId, menuType, excludeIds) => {
    let whereClause = {
        companyId,
        status: 'approved',
    };

    if (menuType !== 'production') {
        whereClause.production = 'imported';
    } else {
        whereClause.production = 'domestic';
    }

    if (params.search) {
        whereClause = {
            ...whereClause,
            [Op.or]: [
                { productName: { [Op.iLike]: `%${params.search}%` } },
                { productCategory: { [Op.iLike]: `%${params.search}%` } },
                { internalArticleCode: { [Op.iLike]: `%${params.search}%` } },
            ],
        };
    }

    if (excludeIds && excludeIds.length > 0) {
        whereClause.id = { [Op.notIn]: excludeIds };
    }

    const limit = params.limit ? (parseInt(params.limit) === -1 ? null : parseInt(params.limit)) : 10;
    const page = params.page ? (params.page - 1) * limit : 0;

    return db.Product.findAndCountAll({
        attributes: [
            'id',
            'productName',
            'productCategory',
            'barcode',
            'manufacturerCompany',
            'brandName',
            'internalArticleCode',
            'image',
            'status',
            'userId',
            'createdAt',
        ],
        include: [
            {
                model: db.ProductMaterials,
                as: 'packingMaterials',
                attributes: ['materialId', 'taeTotal'],
            },
            {
                model: db.User,
                attributes: ['firstName'],
            },
        ],
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: limit,
        distinct: true,
        subQuery: false,
        offset: page,
    });
};

exports.getAllProducts = (params, companyId) => {
    let whereClause = { companyId };

    if (params.search) {
        whereClause = {
            ...whereClause,
            [Op.or]: [
                { productName: { [Op.iLike]: `%${params.search}%` } },
                { productCategory: { [Op.iLike]: `%${params.search}%` } },
                { barcode: { [Op.iLike]: `%${params.search}%` } },
                { brandName: { [Op.iLike]: `%${params.search}%` } },
                { internalArticleCode: { [Op.iLike]: `%${params.search}%` } },
                { status: { [Op.iLike]: `%${params.search}%` } },
                { manufacturerCompany: { [Op.iLike]: `%${params.search}%` } },
            ],
        };
    }

    if (params.status && Array.isArray(params.status)) {
        whereClause.status = { [Op.in]: params.status };
    }

    return db.Product.findAndCountAll({
        attributes: [
            'id',
            'productName',
            'productCategory',
            'barcode',
            'manufacturerCompany',
            'brandName',
            'internalArticleCode',
            'image',
            'status',
            'rejectedReason',
            'userId',
            'production',
            [
                sequelize.literal(`
                (SELECT COUNT(DISTINCT pm."materialId")
                 FROM public."ProductMaterials" pm
                 WHERE pm."productId" = "Product"."id") 
            `),
                'materialCount',
            ],
        ],
        include: [
            {
                model: db.User,
                attributes: ['firstName'],
            },
        ],
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: params.limit ? (parseInt(params.limit) === -1 ? null : parseInt(params.limit)) : 10,
        offset: params.page ? (params.page - 1) * (params.limit ? params.limit : CONSTANTS.DEFAULT.limit) : 0,
    });
};

exports.getProductDetails = (whereParams) => {
    return db.Product.findOne({
        where: whereParams,
    });
};
