const Sequelize = require('sequelize');
const crypto = require('crypto');

const db = require('../database/models');

exports.getPendingCompanyCount = (whereQuery) => {
    return db.Company.count({
        where: whereQuery,
    });
};

exports.getProductCount = (whereQuery) => {
    return db.Product.count({
        where: whereQuery,
    });
};

exports.getProductionPlanCount = (whereQuery) => {
    return db.Production.count({
        where: whereQuery,
    });
};

exports.getImportsCount = (whereQuery) => {
    return db.ImportShipments.count({
        where: whereQuery,
    });
};

exports.getCompensationCount = (whereQuery) => {
    return db.CompensationRequest.count({
        where: whereQuery,
    });
};

exports.getEndDestinationCount = (whereQuery) => {
    return db.EndDestination.count({
        where: whereQuery,
    });
};
exports.listAllVerifier = (params) => {
    let whereQuery = {};
    if (params.search) {
        whereQuery = {
            [Sequelize.Op.or]: [
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('firstName')), {
                    [Sequelize.Op.like]: `%${params.search}%`,
                }),
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('lastName')), {
                    [Sequelize.Op.like]: `%${params.search}%`,
                }),
            ],
        };
    }
    whereQuery = {
        ...whereQuery,
        roleId: params.user.roleId,
    };
    return db.User.findAndCountAll({
        attributes: ['id', 'firstName', 'lastName'],
        where: whereQuery,
        include: [
            {
                attributes: [
                    'id',
                    'userId',
                    'verifierId',
                    'firstLogin',
                    'lastLogin',
                    'totalTask',
                    [
                        Sequelize.fn(
                            'ROUND',
                            Sequelize.literal(
                                `"verifier"."totalTask" / (EXTRACT(YEAR FROM AGE(NOW(), "verifier"."firstLogin")) * 12 + EXTRACT(MONTH FROM AGE(NOW(), "verifier"."firstLogin")) + 1)`
                            ),
                            2
                        ),
                        'taskAvg',
                    ],
                ],
                model: db.Verifier,
                as: 'verifier',
            },
        ],
    });
};

exports.getVerifier = (whereQuery) => {
    return db.Verifier.findOne({
        where: whereQuery,
    });
};

exports.updateVerifier = (updateQuery, whereQuery) => {
    return db.Verifier.update(updateQuery, {
        where: whereQuery,
    });
};

exports.createVerifier = (params) => {
    const generateInviteToken = crypto.randomBytes(32).toString('hex').slice(0, 8).toUpperCase();
    params.verifierId = generateInviteToken;
    return db.Verifier.create(params);
};

exports.updateCompanyStatus = (updateQuery, whereQuery) => {
    return db.Company.update(updateQuery, {
        where: whereQuery,
    });
};

exports.getAllProducts = (params, limit, offset, order) => {
    return db.Product.findAndCountAll({
        where: params,
        limit: limit,
        offset: offset,
        include: [
            {
                model: db.Company,
                as: 'Company',
                attributes: ['companyName'],
            },
        ],
        order: [[order]],
    });
};

exports.updateMaterialStatus = (updateQuery, whereQuery) => {
    return db.ProductMaterials.update(updateQuery, {
        where: whereQuery,
    });
};

exports.getProductionPlan = (params, queries = null) => {
    let internalWhere = {};
    if (queries && queries.search) {
        internalWhere = {
            ...internalWhere,
            productName: { [Sequelize.Op.iLike]: `%${queries.search}%` },
        };
    }
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
                        where: internalWhere,
                        // separate: true,
                        // required: true,
                        // limit: queries && queries.limit ? (parseInt(queries.limit) === -1 ? null : parseInt(queries.limit)) : 10,
                        // offset:
                        //     queries && queries.page ? (queries.page - 1) * (queries.limit ? queries.limit : CONSTANTS.DEFAULT.limit) : 0,
                    },
                ],
            },
        ],
    });
};

exports.productionPlanUpdate = (updateQuery, whereQuery) => {
    return db.ProductionProduct.update(updateQuery, {
        where: whereQuery,
    });
};

exports.getACompanyProfile = (params) => {
    return db.Company.findOne({
        where: params,
        attributes: {
            exclude: ['city'],
        },
        include: [
            {
                model: db.City,
                as: 'cities',
                attributes: ['name'],
            },
        ],
    });
};

exports.listEndDestination = (whereParams, search, limit, page, order) => {
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);

    const validatedLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit;
    const validatedPage = isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage;

    const offset = (validatedPage - 1) * validatedLimit;

    const searchCriteria = search
        ? {
              [Sequelize.Op.or]: [
                  { orgType: { [Sequelize.Op.iLike]: `%${search}%` } },
                  { orgName: { [Sequelize.Op.iLike]: `%${search}%` } },
                  { status: { [Sequelize.Op.iLike]: `%${search}%` } },
                  { contactPerson: { [Sequelize.Op.iLike]: `%${search}%` } },
              ],
          }
        : {};

    return db.EndDestination.findAndCountAll({
        where: { ...whereParams, ...searchCriteria },
        limit: validatedLimit,
        offset: offset,
        order: [[order]],
    });
};

exports.updateCompensationStatus = (updateQuery, whereQuery) => {
    return db.CompensationRequest.update(updateQuery, {
        where: whereQuery,
    });
};

exports.changeEndDestinationStatus = (updateQuery, whereQuery) => {
    return db.EndDestination.update(updateQuery, {
        where: whereQuery,
    });
};

exports.addLogs = (params) => {
    return db.Log.create(params);
};

exports.getAllImport = (params, limit, offset, order) => {
    return db.ImportShipments.findAndCountAll({
        where: params,
        limit: limit,
        offset: offset,
        order: [[order]],
        include: [
            {
                model: db.Company,
                as: 'Company',
                attributes: ['companyName'],
            },
        ],
    });
};

exports.changeImportStatus = (updateQuery, whereQuery) => {
    return db.ImportShipments.update(updateQuery, {
        where: whereQuery,
    });
};

exports.listAllLogs = (params, limit, offset) => {
    return db.Log.findAndCountAll({
        attributes: [
            'id',
            'companyId',
            'userId',
            'objectType',
            'objectName',
            'fromStatus',
            'toStatus',
            'comment',
            'objectNameId',
            'createdAt',
        ],
        where: params,
        limit: limit,
        offset: offset,
        include: [
            {
                model: db.Company,
                as: 'company',
                attributes: ['companyName'],
            },
            {
                model: db.User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName'],
            },
        ],
    });
};

exports.productionPayment = (whereQuery) => {
    if (!whereQuery.companyId) {
        whereQuery.companyId = null;
    }
    return db.sequelize.query(`SELECT
    c."companyName", p."createdAt",
    SUM((pm."actual")/1000 * tf."taeFeeMtKg") AS total_value,
    'paid' AS "payStatus"
FROM
    public."Productions" p
JOIN
    public."ProductionProducts" pp ON p."id" = pp."productionId"
JOIN
    public."ProductionMaterials" pm ON p."id" = pm."productionId"
JOIN
    public."TaeFees" tf ON pm."materialId" = tf."id"
JOIN 
    public."Companies" c ON p."companyId" = c."id"
where
    p."status" = 'pending' 
    AND
    pp."actualStatus" = 'approved'
    AND
    p."companyId" = ${whereQuery.companyId} 
    AND EXTRACT(YEAR FROM p."createdAt") = ${whereQuery.planYear}
GROUP BY
    c."companyName", p."createdAt";`);
    // return db.Production.findAll({
    //     where: whereQuery,
    //     attributes: [
    //         // [Sequelize.fn('SUM', Sequelize.literal('"productionMaterial"."actual"')), 'total'],
    //         'createdAt',
    //     ],
    //     include: [
    //         {
    //             model: db.ProductionMaterial,
    //             as: 'productionMaterial',
    //             attributes: [
    //                 [
    //                     Sequelize.fn(
    //                         'SUM',
    //                         Sequelize.literal(
    //                             'CAST("productionMaterial"."actual" AS DOUBLE PRECISION) * CAST("productionMaterial->materials"."taeFeeMtKg" AS DOUBLE PRECISION) / 100'
    //                         )
    //                     ),
    //                     'totalTaeFee',
    //                 ],
    //                 'actual',
    //             ],
    //             include: [
    //                 {
    //                     model: db.TaeFee,
    //                     as: 'materials',
    //                     attributes: [],
    //                 },
    //             ],
    //         },
    //     ],
    //     logging: console.log,
    //     // raw: true,
    //     group: ['Production.id', 'productionMaterial.id', '"productionMaterial->materials"."id"'],
    // });
};

exports.importPayment = (params) => {
    let whereQuery = {};
    whereQuery = {
        ...whereQuery,
    };
    if (!params.companyId) {
        params.companyId = null;
    }
    return db.sequelize.query(`SELECT
    c."companyName", iss."createdAt",
    SUM((ism."actual") /1000 * tf."taeFeeMtKg") AS total_value,
    'paid' AS "payStatus"
FROM
    public."ImportShipments" iss
JOIN
    public."ImportShipmentMaterials" ism ON iss."id" = ism."importShipmentId"
JOIN
    public."TaeFees" tf ON ism."materialId" = tf."id"
JOIN 
    public."Companies" c ON iss."companyId" = c."id"
where
    iss."status" = 'approved'
    AND
    iss."companyId" = ${params.companyId}
    AND EXTRACT(YEAR FROM iss."createdAt") = ${params.year}
GROUP BY
    iss.id, c."companyName", iss."createdAt";`);
    // return db.ImportShipments.findAll({
    //     where: whereQuery,
    //     attributes: [
    //         [
    //             Sequelize.fn(
    //                 'SUM',
    //                 Sequelize.literal(
    //                     'CAST("materials"."actual" AS DOUBLE PRECISION) * CAST("materials->material"."taeFeeMtKg" AS DOUBLE PRECISION) / 100'
    //                 )
    //             ),
    //             'importFee',
    //         ],
    //         'createdAt',
    //     ],
    //     include: [
    //         {
    //             model: db.ImportShipmentMaterials,
    //             as: 'materials',
    //             attributes: [],
    //             include: [
    //                 {
    //                     model: db.TaeFee,
    //                     as: 'material',
    //                     attributes: [],
    //                 },
    //             ],
    //         },
    //     ],
    //     group: ['ImportShipments.id', 'materials.id'],
    // });
};

exports.compensationAmount = (params) => {
    if (!params.companyId) {
        params.companyId = null;
    }
    return db.sequelize.query(`SELECT
        c."companyName", iss."createdAt",
        SUM((iss."deliveredKgs") * tf."taeFeeMtKg") AS total_value,
    'paid' AS "payStatus"

    FROM
        public."CompensationRequests" iss
    JOIN
        public."TaeFees" tf ON iss."materialId" = tf."id"
    JOIN 
        public."Companies" c ON iss."companyId" = c."id"
    where
        iss."status" = 'approved'
        AND iss."companyId" = ${params.companyId}
        AND EXTRACT(YEAR FROM iss."createdAt") = ${params.year}
    GROUP BY
        iss.id, c."companyName", iss."createdAt";`);
};

exports.getProductionProduct = (whereQuery) => {
    return db.ProductionProduct.findOne({
        where: whereQuery,
        include: [
            {
                model: db.Production,
                as: 'production',
            },
        ],
    });
};

exports.listLogsByObject = (whereQuery, limit, offset) => {
    return db.Log.findAndCountAll({
        where: whereQuery,
        include: [
            {
                model: db.User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'roleId'],
            },
            {
                model: db.Company,
                as: 'company',
                attributes: ['id', 'companyName'],
            },
        ],
        limit: limit.limit,
        offset: offset.offset,
        order: [['createdAt', 'ASC']],
    });
};

exports.listCompanyWithProduction = (params) => {
    let whereQuery = {};
    if (params.companyId && params.companyId != 0) {
        whereQuery = {
            ...whereQuery,
            id: params.companyId,
        };
    }
    if (params.search) {
        whereQuery = {
            ...whereQuery,
            companyName: {
                [Sequelize.Op.like]: `%${params.search}%`,
            },
        };
    }
    return db.Company.findAll({
        attributes: ['companyName', 'id'],
        where: whereQuery,
        include: [
            {
                model: db.Production,
                as: 'Productions',
                where: {
                    planYear: new Date().getFullYear(),
                },
                required: true,
                attributes: [
                    'id',
                    'planYear',
                    'createdAt',
                    'updatedAt',
                    [
                        Sequelize.literal(
                            '(SELECT COUNT(*) FROM "ProductionProducts" WHERE "ProductionProducts"."productionId" = "Productions"."id")'
                        ),
                        'productCount',
                    ],
                ],
                include: [
                    {
                        model: db.ProductionProduct,
                        as: 'productionProduct',
                        attributes: [],
                    },
                ],
            },
        ],
        limit: params.limit ? (parseInt(params.limit) === -1 ? null : parseInt(params.limit)) : 10,
        offset: params.page ? (params.page - 1) * (params.limit ? params.limit : 10) : 0,
    });
};

exports.countCompanyWithProduction = (params) => {
    let whereQuery = {};
    if (params.companyId && params.companyId != 0) {
        whereQuery = {
            ...whereQuery,
            id: params.companyId,
        };
    }
    if (params.search) {
        whereQuery = {
            ...whereQuery,
            companyName: {
                [Sequelize.Op.like]: `%${params.search}%`,
            },
        };
    }
    return db.Company.count({
        where: whereQuery,
        include: [
            {
                model: db.Production,
                as: 'Productions',
                where: {
                    planYear: new Date().getFullYear(),
                },
                required: true,
            },
        ],
    });
};

exports.incrementVerifier = (id) => {
    return db.Verifier.update(
        {
            totalTask: Sequelize.literal(`COALESCE("totalTask", 0) + 1`),
        },
        {
            where: {
                userId: id,
            },
        }
    );
};
