const Sequelize = require('sequelize');
const crypto = require('crypto');
const db = require('../database/models');
const { CONSTANTS } = require('../config');
const { Op, literal, col, fn } = require('sequelize');
const { BadRequestException } = require('../helpers/errorResponse');
const i18n = require('i18n');

exports.getUserByEmail = (email) => {
    return db.User.findOne({
        where: {
            [Sequelize.Op.or]: [{ email: email }],
        },
        include: [
            {
                model: db.Role,
                as: 'Role',
                attributes: ['id', 'name'],
            },
        ],
    });
};

exports.getUserById = (id, params) => {
    return db.User.findOne({
        where: {
            id: id,
        },
    });
};

exports.getRolesData = (id) => {
    return db.Role.findOne({
        attributes: ['id', 'name'],
        where: {
            id: id,
        },
    });
};

exports.verifyUser = (params) => {
    return db.users.findOne({
        where: {
            id: params.userId,
            // companyId: params.companyId,
        },
    });
};

exports.createUser = (params) => {
    return db.User.create(params);
};

exports.checkUserExist = (email) => {
    return db.User.count({
        where: {
            email: email,
        },
    });
};

exports.checkUserExistById = (whereQuery) => {
    return db.users.findOne({
        where: whereQuery,
    });
};

exports.addOtp = (updateQuery, whereQuery) => {
    return db.User.update(updateQuery, {
        where: whereQuery,
    });
};

exports.verifyOtp = (params) => {
    return db.User.findOne({
        attributes: ['id', 'otp'],
        where: params,
    });
};

exports.updatePassword = (password, id) => {
    return db.User.update(
        {
            password: password,
            otp: null,
            otpExpiration: null,
        },
        {
            where: {
                id: id,
            },
        }
    );
};

exports.passwordVerification = (params) => {
    return db.User.findOne({
        attributes: ['id'],
        where: {
            otp: params.otp,
        },
    });
};

exports.changePassword = (password, id) => {
    return db.User.update(
        {
            password: password,
        },
        {
            where: {
                id: id,
            },
        }
    );
};

exports.updateUser = (updateQuery, whereQuery) => {
    return db.User.update(updateQuery, {
        where: whereQuery,
    });
};

exports.checkAccessToken = (token) => {
    return db.User.findOne({
        attributes: ['id'],
        where: {
            accessToken: token,
        },
        // include: [
        //     {
        //         model: db.Role,
        //         as: 'Role',
        //         attributes: ['id', 'name'],
        //     },
        // ],
    });
};

exports.inviteUser = (params) => {
    return db.User.create(params);
};

exports.addUserCompanyDetails = (params) => {
    return db.UserCompany.create(params);
};

exports.userUrl = (url) => {
    const currentDate = new Date();
    return db.User.findOne({
        attributes: ['id'],
        where: {
            inviteLink: url,
            inviteLinkExpiration: {
                [Op.gt]: currentDate,
            },
        },
    });
};

exports.getRole = (params) => {
    return db.Role.findOne({
        attributes: ['id'],
        where: params,
    });
};

exports.isEmailExist = (email, id) => {
    return db.User.count({
        where: {
            email: email,
            id: { [Op.ne]: id },
        },
    });
};

exports.findUser = (params) => {
    return db.User.findOne({
        where: params,
    });
};

exports.userCompany = (params) => {
    return db.UserCompany.findOne({
        where: params,
    });
};

exports.createVerifier = (id) => {
    const generateInviteToken = crypto.randomBytes(32).toString('hex').slice(0, 8).toUpperCase();
    const data = {
        userId: id,
        verifierId: generateInviteToken,
    };
    return db.Verifier.create(data);
};

exports.getCompanyDetails = async (userId, roleId) => {
    if (roleId === 3) {
        return db.Company.findOne({
            where: { userId: userId },
            attributes: ['id', 'companyName', 'status'],
        });
    } else {
        const userCompany = await db.UserCompany.findOne({
            where: { userId: userId },
            attributes: ['companyId'],
            include: [
                {
                    model: db.Company,
                    as: 'Company',
                    attributes: ['id', 'companyName', 'status'],
                },
            ],
        });
        return userCompany ? userCompany.Company : null;
    }
};

exports.getAllUsersWithCompanyName = async ({ search, status, limit, page }) => {
    try {
        const whereQuery = {
            roleId: {
                [Op.ne]: 1,
            },
            [Op.or]: [
                { firstName: { [Op.iLike]: `%${search}%` } },
                { lastName: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { '$Role.name$': { [Op.iLike]: `%${search}%` } },
                { '$Companies.companyName$': { [Op.iLike]: `%${search}%` } },
                {
                    [Op.and]: Sequelize.literal(`concat("User"."firstName", ' ', "User"."lastName") ILIKE '%${search}%'`),
                },
            ],
        };

        if (status === 'true') {
            whereQuery.isActive = true;
        } else if (status === 'false') {
            whereQuery.isActive = false;
        }

        const { count, rows } = await db.User.findAndCountAll({
            attributes: ['id', 'firstName', 'lastName', 'email', 'roleId', 'isActive'],
            include: [
                {
                    model: db.Role,
                    as: 'Role',
                    attributes: ['name'],
                },
                {
                    model: db.Company,
                    as: 'Companies',
                    attributes: ['companyName'],
                },
            ],
            where: whereQuery,
            limit: limit ? (parseInt(limit) === -1 ? null : parseInt(limit)) : 10,
            offset: page ? (page - 1) * (limit ? limit : CONSTANTS.DEFAULT.limit) : 0,
            order: [['createdAt', 'DESC']],
        });

        const usersWithCompanyId = await Promise.all(
            rows.map(async (user) => {
                let companyName = null;

                const company = await db.Company.findOne({
                    where: { userId: user.id },
                    attributes: ['companyName'],
                });

                if (company) {
                    companyName = company.companyName;
                } else {
                    const userCompany = await db.UserCompany.findOne({
                        where: { userId: user.id },
                        attributes: ['companyId'],
                    });

                    if (userCompany) {
                        const companyFromUserCompany = await db.Company.findOne({
                            where: { id: userCompany.companyId },
                            attributes: ['companyName'],
                        });

                        if (companyFromUserCompany) {
                            companyName = companyFromUserCompany.companyName;
                        }
                    }
                }

                return {
                    userId: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    roleName: user.Role ? user.Role.name : 'Unknown',
                    isActive: user.isActive,
                    companyName: companyName || 'No Company',
                };
            })
        );

        return {
            count: count,
            rows: usersWithCompanyId,
        };
    } catch (error) {
        console.error('Error fetching all users with company names:', error);
        throw error;
    }
};

exports.toggleUserStatus = async (userId, status) => {
    try {
        const user = await db.User.findByPk(userId);

        if (!user) {
            throw new BadRequestException(i18n.__('USER.USER_NOT_EXIST'));
        }

        user.isActive = status;

        if (status === false) {
            user.accessToken = null;
        }
        const data = await user.save();

        if (data && status == false) {
            const companyId = await db.Company.findOne({
                attributes: ['id'],
                where: {
                    userId: userId,
                },
            });
            if (companyId) {
                const usersData = await db.UserCompany.findAll({
                    attributes: ['id', 'userId'],
                    where: {
                        companyId: companyId.id,
                    },
                });
                const userIds = usersData.map((elem) => elem.userId);
                await db.User.update(
                    {
                        isActive: status,
                    },
                    {
                        where: {
                            id: {
                                [Sequelize.Op.in]: userIds,
                            },
                        },
                    }
                );
            }
        }
        return user;
    } catch (error) {
        throw error;
    }
};

exports.getTaePayments = async (year, search, paymentType, limit, page) => {
    try {
        if (!year) throw new BadRequestException(i18n.__('USER.YEAR_NOT_FOUND'));
        const offset = (page - 1) * limit;

        const limitInt = parseInt(limit, 10) || 10;
        const pageInt = parseInt(page, 10) || 1;
        const searchTerm = `%${search.toLowerCase()}%`;
        const paymentTypeFilter = paymentType ? `%${paymentType.toLowerCase()}%` : '%';

        const queryProd = `
            SELECT
                'production' as paymentType,
                c."companyName",
                p."createdAt",
                SUM((pm."actual") / 1000 * tf."taeFeeMtKg") AS total_value
            FROM
                public."Productions" p
            JOIN
                public."ProductionMaterials" pm ON p."id" = pm."productionId"
            JOIN
                public."TaeFees" tf ON pm."materialId" = tf."id"
            JOIN 
                public."Companies" c ON p."companyId" = c."id"
            WHERE
                p."status" = 'approved'  
                AND EXTRACT(YEAR FROM p."createdAt") = :year
                AND LOWER(c."companyName") LIKE :searchTerm
                AND LOWER('production') LIKE :paymentTypeFilter
            GROUP BY
                c."companyName",
                p."createdAt"
            LIMIT :limit
            OFFSET :offset;`;

        const queryImport = `
            SELECT
                'import' as paymentType,
                c."companyName",
                iss."createdAt",
                SUM((ism."actual") / 1000 * tf."taeFeeMtKg") AS total_value
            FROM
                public."ImportShipments" iss
            JOIN
                public."ImportShipmentMaterials" ism ON iss."id" = ism."importShipmentId"
            JOIN
                public."TaeFees" tf ON ism."materialId" = tf."id"
            JOIN 
                public."Companies" c ON iss."companyId" = c."id"
            WHERE
                iss."status" = 'approved'
                AND EXTRACT(YEAR FROM iss."createdAt") = :year
                AND LOWER(c."companyName") LIKE :searchTerm
                AND LOWER('import') LIKE :paymentTypeFilter
            GROUP BY
                c."companyName",
                iss."createdAt"
            LIMIT :limit
            OFFSET :offset;`;

        const queryCompensation = `
            SELECT
                'compensation' as paymentType,
                c."companyName",
                iss."createdAt",
                SUM((iss."deliveredKgs") * tf."taeFeeMtKg" ) AS total_value
            FROM
                public."CompensationRequests" iss
            JOIN
                public."TaeFees" tf ON iss."materialId" = tf."id"
            JOIN 
                public."Companies" c ON iss."companyId" = c."id"
            WHERE
                iss."status" = 'approved'
                AND EXTRACT(YEAR FROM iss."createdAt") = :year
                AND LOWER(c."companyName") LIKE :searchTerm
                AND LOWER('compensation') LIKE :paymentTypeFilter
            GROUP BY
                c."companyName",
                iss."createdAt"
            LIMIT :limit
            OFFSET :offset;`;

        const [prodResults, importResults, compensationResults] = await Promise.all([
            db.sequelize.query(queryProd, {
                replacements: { year, searchTerm, paymentTypeFilter, limit: limitInt, offset },
                type: Sequelize.QueryTypes.SELECT,
            }),
            db.sequelize.query(queryImport, {
                replacements: { year, searchTerm, paymentTypeFilter, limit: limitInt, offset },
                type: Sequelize.QueryTypes.SELECT,
            }),
            db.sequelize.query(queryCompensation, {
                replacements: { year, searchTerm, paymentTypeFilter, limit: limitInt, offset },
                type: Sequelize.QueryTypes.SELECT,
            }),
        ]);

        const formattedResults = [
            ...prodResults.map((result) => ({
                companyName: result.companyName,
                total_value: result.total_value,
                paymentType: result.paymenttype,
                createdAt: result.createdAt,
            })),
            ...importResults.map((result) => ({
                companyName: result.companyName,
                total_value: result.total_value,
                paymentType: result.paymenttype,
                createdAt: result.createdAt,
            })),
            ...compensationResults.map((result) => ({
                companyName: result.companyName,
                total_value: result.total_value,
                paymentType: result.paymenttype,
                createdAt: result.createdAt,
            })),
        ];

        const totalCount = formattedResults.length;

        const results = {
            count: totalCount,
            rows: formattedResults,
            pagination: {
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / limitInt),
                currentPage: pageInt,
                pageSize: limitInt,
            },
        };

        return {
            ...results,
        };
    } catch (error) {
        console.error('Error fetching TAE payments:', error);
        throw error;
    }
};
