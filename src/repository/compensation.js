const db = require('../database/models');
const s3 = require('../utils/s3');
const { BadRequestException } = require('../helpers/errorResponse');
const i18n = require('i18n');
const { Sequelize, Op } = require('sequelize');
const companyRepository = require('../repository/company');

exports.createCompensation = (params) => {
    return db.CompensationRequest.create(params);
};

exports.createCompensationDocument = (params) => {
    return db.CompensationDocument.create(params);
};

exports.createEndDestination = (params) => {
    return db.EndDestination.create(params);
};

exports.findCompensationById = async (id) => {
    try {
        const result = await db.CompensationRequest.findByPk(id, {
            include: [
                {
                    model: db.TaeFee,
                    attributes: ['id', 'material'],
                    as: 'TaeFee',
                },
                {
                    model: db.EndDestination,
                    attributes: ['id', 'orgName', 'orgType'],
                    as: 'EndDestination',
                },
                {
                    model: db.CompensationDocument,
                    attributes: ['id', 'documentUrl', 'description'],
                    as: 'CompensationDocuments',
                },
            ],
            attributes: ['id', 'deliveryToEdDate', 'deliveredKgs', 'status', 'userId', 'createdAt', 'rejectedReason'],
        });

        if (!result) {
            throw new BadRequestException(i18n.__('COMPENSATION.COMPENSATION_NOT_EXIST'))();
        }

        const compensationDocumentsWithSignedUrls = await Promise.all(
            result.CompensationDocuments.map(async (doc) => {
                try {
                    const signedUrl = await s3.signedUrl(doc.documentUrl);
                    return {
                        id: doc.id,
                        documentName: doc.documentUrl,
                        documentUrl: signedUrl,
                        description: doc.description,
                    };
                } catch (error) {
                    console.error('Error fetching signed URL for document:', doc.documentUrl, error);
                    return {
                        id: doc.id,
                        documentName: doc.documentUrl,
                        documentUrl: doc.documentUrl,
                        description: doc.description,
                    };
                }
            })
        );

        return {
            id: result.id,
            deliveryToEdDate: result.deliveryToEdDate,
            deliveredKgs: result.deliveredKgs,
            status: result.status,
            userId: result.userId,
            createdAt: result.createdAt,
            rejectedReason: result.rejectedReason,
            material: result.TaeFee
                ? {
                      id: result.TaeFee.id,
                      materialName: result.TaeFee.material,
                  }
                : null,
            edOrganisation: result.EndDestination
                ? {
                      id: result.EndDestination.id,
                      orgName: result.EndDestination.orgName,
                      orgType: result.EndDestination.orgType,
                  }
                : null,
            compensationDocuments: compensationDocumentsWithSignedUrls,
        };
    } catch (error) {
        console.error('Error fetching CompensationRequest by ID:', error);
        throw error;
    }
};

exports.findAllCompensations = async (params, userId, companyId) => {
    const { search, status, limit, page } = params;
    let whereClause = {};

    const order = Sequelize.literal(`CASE
        WHEN "CompensationRequest"."status" = 'pending' THEN 1
        WHEN "CompensationRequest"."status" = 'improved' THEN 2
        WHEN "CompensationRequest"."status" = 'rejected' THEN 3
        WHEN "CompensationRequest"."status" = 'approved' THEN 4
        ELSE 5
    END`);

    if (typeof companyId !== 'undefined' && parseInt(companyId) === 0) {
        whereClause = {};
    } else if (typeof companyId !== 'undefined' && !isNaN(parseInt(companyId))) {
        whereClause.companyId = companyId;
    } else {
        const companyDetails = await companyRepository.getCompanyId(userId);
        whereClause.companyId = companyDetails.companyId;
    }

    if (search) {
        whereClause = {
            ...whereClause,
            [Op.or]: [
                { status: { [Op.iLike]: `%${search}%` } },
                { '$TaeFee.material$': { [Op.iLike]: `%${search}%` } },
                { '$EndDestination.orgName$': { [Op.iLike]: `%${search}%` } },
            ],
        };
    }

    if (status && Array.isArray(status)) {
        whereClause.status = { [Op.in]: status };
    }

    const rows = await db.CompensationRequest.findAll({
        attributes: [
            'id',
            'deliveryToEdDate',
            'deliveredKgs',
            'status',
            'userId',
            'createdAt',
            'rejectedReason',
            [db.sequelize.col('TaeFee.material'), 'material'],
            [db.sequelize.col('EndDestination.orgName'), 'orgName'],
        ],
        include: [
            {
                model: db.TaeFee,
                attributes: ['id', 'material'],
                required: true,
            },
            {
                model: db.EndDestination,
                attributes: ['id', 'orgName', 'orgType', 'status'],
                required: true,
            },
            {
                model: db.CompensationDocument,
                attributes: ['id', 'documentUrl', 'description'],
                required: false,
            },
            {
                model: db.Company,
                attributes: ['companyName'],
                required: true,
            },
        ],
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: limit ? (parseInt(limit) === -1 ? null : parseInt(limit)) : 10,
        offset: page ? (page - 1) * (limit || 10) : 0,
        order: [[order]],
    });
    const count = await db.CompensationRequest.count({
        where: whereClause,
    });
    return {
        count,
        rows,
    };
};

exports.findAllEndDestinationsByCompany = async (userId, { page, limit, search }) => {
    try {
        const companyData = await companyRepository.getCompanyId(userId);
        const companyId = companyData.companyId;

        const searchCriteria = search
            ? {
                  [Op.or]: [
                      { orgType: { [Op.iLike]: `%${search}%` } },
                      { orgName: { [Op.iLike]: `%${search}%` } },
                      { status: { [Op.iLike]: `%${search}%` } },
                      { contactPerson: { [Op.iLike]: `%${search}%` } },
                  ],
              }
            : {};

        const { count, rows } = await db.EndDestination.findAndCountAll({
            where: { companyId, ...searchCriteria },
            limit: parseInt(limit, 10),
            offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        });

        return {
            totalCount: count,
            totalPages: Math.ceil(count / parseInt(limit, 10)),
            currentPage: parseInt(page, 10),
            rows: rows,
        };
    } catch (error) {
        console.error('Error fetching end destinations:', error);
        throw error;
    }
};

exports.findAllEndDestinations = async () => {
    try {
        return await db.EndDestination.findAll({
            attributes: ['id', 'orgName', 'orgType', 'status'],
        });
    } catch (error) {
        console.error('Error fetching end destinations:', error);
        throw error;
    }
};

exports.deleteCompensation = async (id, transaction) => {
    const affectedRows = await db.CompensationRequest.destroy({
        where: { id },
        transaction,
    });

    if (affectedRows === 0) {
        throw new BadRequestException(i18n.__('COMPENSATION.COMPENSATION_NOT_EXIST'));
    }

    await db.CompensationDocument.destroy({
        where: { compensationRequestId: id },
        transaction,
    });
};

exports.getTotalWeightByMaterial = async (params, userId) => {
    const { year } = params;

    if (!year) {
        throw new BadRequestException(i18n.__('COMPENSATION.YEAR_NOT_FOUND'));
    }

    try {
        let companyId;

        let userCompany = await db.UserCompany.findOne({
            where: { userId },
            attributes: ['companyId'],
        });

        if (!userCompany) {
            const companyRecord = await db.Company.findOne({
                where: { userId },
                attributes: ['id'],
            });

            if (!companyRecord) {
                throw new Error('Company not found for the given user');
            }

            companyId = companyRecord.id;
        } else {
            companyId = userCompany.companyId;
        }

        const query = `
        WITH CombinedActuals AS (
            -- ImportShipments actuals
            SELECT 
                ism."materialId",
                SUM(ism."actual") AS total_actuals
            FROM 
                public."ImportShipments" iss
            JOIN 
                public."ImportShipmentMaterials" ism
            ON 
                iss.id = ism."importShipmentId"
            WHERE 
                iss."companyId" = ${companyId}
                AND EXTRACT(YEAR FROM iss."createdAt") = ${year}
            GROUP BY 
                ism."materialId"
            
            UNION ALL
            
            -- Productions actuals
            SELECT 
                pm."materialId",
                SUM(pm."actual") AS total_actuals
            FROM 
                public."Productions" p
            JOIN 
                public."ProductionMaterials" pm
            ON 
                p.id = pm."productionId"
            WHERE 
                p."companyId" = ${companyId}
                AND EXTRACT(YEAR FROM p."createdAt") = ${year}
            GROUP BY 
                pm."materialId"
        ),
        
        TotalActuals AS (
            SELECT 
                "materialId",
                SUM(total_actuals) AS total_actuals
            FROM 
                CombinedActuals
            GROUP BY 
                "materialId"
        ),
        
        TotalDeliveredKgs AS (
            SELECT 
                "materialId",
                "status",
                SUM("deliveredKgs") AS total_delivered_kgs
            FROM 
                public."CompensationRequests"
            WHERE
                "companyId" = ${companyId}
                AND EXTRACT(YEAR FROM "createdAt") = ${year}
            GROUP BY 
                "materialId", "status"
        )
        
        -- Main query
        SELECT 
            tf.id AS "materialId",
            tf.material AS "materialName",
            COALESCE(SUM(ta.total_actuals), 0) / 1000 AS "totalCombined",
            COALESCE(SUM(cr.total_delivered_kgs), 0) AS "deliveredKgs",
            COALESCE(cr."status", 'Nil') AS "status"
        FROM 
            public."TaeFees" tf
        LEFT JOIN 
            TotalActuals ta
        ON 
            tf.id = ta."materialId"
        LEFT JOIN 
            TotalDeliveredKgs cr
        ON 
            tf.id = cr."materialId"
        GROUP BY 
            tf.id, tf.material, cr."status"
        ORDER BY 
            tf.id,
            tf.material,
            cr."status";
        `;

        const results = await db.sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });

        const response = {
            count: results.length,
            rows: results,
        };
        return response;
    } catch (error) {
        console.error('Error fetching total weights by material:', error);
        throw error;
    }
};

exports.updateCompensation = async (id, params, userId, transaction) => {
    const { deliveryToEdDate, materialId, deliveredKgs, edOrganisationId, status, date, documents } = params;

    const setStatus = status === 'rejected' ? 'improved' : status;

    const [affectedRows] = await db.CompensationRequest.update(
        {
            deliveryToEdDate,
            materialId,
            deliveredKgs,
            edOrganisationId,
            userId,
            status: setStatus,
            date,
        },
        {
            where: { id },
            transaction,
        }
    );

    if (affectedRows === 0) {
        throw new BadRequestException(i18n.__('COMPENSATION.COMPENSATION_NOT_EXIST'));
    }

    const existingDocuments = await db.CompensationDocument.findAll({
        where: { compensationRequestId: id },
        transaction,
    });

    const existingDocsMap = existingDocuments.reduce((acc, doc) => {
        acc[doc.id] = doc;
        return acc;
    }, {});

    const newDocumentIds = new Set();
    const docPromises = documents.map(async (doc) => {
        if (doc.id == 0) {
            await db.CompensationDocument.create(
                {
                    compensationRequestId: id,
                    documentUrl: doc.documentUrl,
                    description: doc.description,
                },
                { transaction }
            );
        } else {
            if (existingDocsMap[doc.id]) {
                await db.CompensationDocument.update(
                    {
                        description: doc.description,
                    },
                    {
                        where: { id: doc.id },
                        transaction,
                    }
                );
                newDocumentIds.add(doc.id);
            }
        }
    });

    await Promise.all(docPromises);

    const idsToDelete = Object.keys(existingDocsMap).filter((id) => !newDocumentIds.has(parseInt(id, 10)));

    if (idsToDelete.length > 0) {
        await db.CompensationDocument.destroy({
            where: {
                id: idsToDelete,
                compensationRequestId: id,
            },
            transaction,
        });
    }

    return db.CompensationRequest.findByPk(id, { include: [db.CompensationDocument], transaction });
};

exports.getACompensation = (whereParams) => {
    return db.CompensationRequest.findOne({
        where: whereParams,
    });
};

exports.getAEndDestination = (whereParams) => {
    return db.EndDestination.findOne({
        where: whereParams,
    });
};
