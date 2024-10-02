const db = require('../database/models');
const { Op, QueryTypes, where } = require('sequelize');
const CONSTANTS = {
    DEFAULT: {
        limit: 10,
    },
};
const { BadRequestException } = require('../helpers/errorResponse');
const i18n = require('i18n');

exports.addImports = (params) => {
    return db.ImportShipments.create(params);
};

exports.updateImports = (updateQuery, whereQuery, transaction) => {
    return db.ImportShipments.update(updateQuery, {
        where: whereQuery,
        transaction,
    });
};

exports.getImports = async (params, userId) => {
    try {
        const companyRecord = await db.Company.findOne({
            where: { userId },
            attributes: ['id'],
        });

        if (companyRecord) {
            companyId = companyRecord.id;
        } else {
            const userCompanyRecord = await db.UserCompany.findOne({
                where: { userId },
                attributes: ['companyId'],
            });

            if (userCompanyRecord) {
                companyId = userCompanyRecord.companyId;
            } else {
                throw new BadRequestException(i18n.__('COMPANY.COMPANY_NOT_EXIST'));
            }
        }

        let whereClause = {
            companyId,
        };

        if (params.search) {
            whereClause = {
                ...whereClause,
                [Op.or]: [
                    { cdNo: { [Op.like]: `%${params.search}%` } },
                    { productUnits: { [Op.like]: `%${params.search}%` } },
                    { taeValue: { [Op.like]: `%${params.search}%` } },
                    { country: { [Op.like]: `%${params.search}%` } },
                    { fromPort: { [Op.like]: `%${params.search}%` } },
                    { status: { [Op.like]: `%${params.search}%` } },
                    { payStatus: { [Op.like]: `%${params.search}%` } },
                ],
            };
        }

        const limit = params.limit ? (parseInt(params.limit) === -1 ? null : parseInt(params.limit)) : CONSTANTS.DEFAULT.limit;
        const offset = params.page ? (parseInt(params.page) - 1) * limit : 0;

        if (params.status && Array.isArray(params.status)) {
            whereClause.status = { [Op.in]: params.status };
        }

        const result = await db.ImportShipments.findAndCountAll({
            attributes: [
                'id',
                'cdNo',
                'etaDate',
                'productUnits',
                'taeValue',
                'arrivalPort',
                'country',
                'fromPort',
                'status',
                'payStatus',
                'rejectedReason',
            ],
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: limit,
            offset: offset,
        });

        return result;
    } catch (error) {
        console.error('Error fetching imports:', error);
        throw error;
    }
};

exports.getImportById = async (id) => {
    return db.ImportShipments.findOne({
        where: { id },
        attributes: [
            'id',
            'cdNo',
            'etaDate',
            'productUnits',
            'taeValue',
            'fromPort',
            'status',
            'payStatus',
            'countryId',
            'arrivalPort',
            'rejectedReason',
        ],
        include: [
            {
                model: db.ImportShipmentProducts,
                as: 'products',
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
                include: [
                    {
                        model: db.Product,
                        as: 'product',
                        attributes: ['id', 'productName', 'internalArticleCode', 'image'],
                    },
                ],
            },
            {
                model: db.Country,
                as: 'countries',
                attributes: ['id', 'name'],
            },
            {
                model: db.FromPorts,
                as: 'arrivalPorts',
                attributes: ['id', 'portname'],
            },
        ],
    });
};

exports.getImportByYear = async (year, userId) => {
    const query = `
        SELECT 
    "ImportShipments"."payStatus" AS "payStatus",
    "ProductMaterials"."materialId" AS "materialId", 
    "TaeFees"."material" AS "materialName", 
    SUM(CAST("ImportShipmentProducts"."units" AS DOUBLE PRECISION) * CAST("ProductMaterials"."weight" AS DOUBLE PRECISION)) AS "totalWeightGrams"
FROM 
    "ImportShipments"
JOIN 
    "ImportShipmentProducts" ON "ImportShipments"."id" = "ImportShipmentProducts"."shipmentId"
JOIN 
    "ProductMaterials" ON "ImportShipmentProducts"."productId" = "ProductMaterials"."productId"
JOIN 
    "TaeFees" ON "ProductMaterials"."materialId" = "TaeFees"."id"
WHERE 
    EXTRACT(YEAR FROM "ImportShipments"."etaDate") = :year 
    AND "ImportShipments"."userId" = :userId
GROUP BY 
    "ImportShipments"."payStatus",
    "ProductMaterials"."materialId",
    "TaeFees"."material"
    `;

    const shipments = await db.sequelize.query(query, {
        replacements: { year, userId },
        type: QueryTypes.SELECT,
    });

    const response = {
        count: shipments.length,
        rows: shipments,
    };

    return response;
};

exports.deleteImports = (whereQuery) => {
    return db.ImportShipments.destroy({
        where: whereQuery,
    });
};

exports.getAImport = (whereQuery) => {
    return db.ImportShipments.findOne({
        where: whereQuery,
    });
};
