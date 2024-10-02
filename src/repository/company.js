const Sequelize = require('sequelize');
const db = require('../database/models');
const i18n = require('i18n');
const { BadRequestException } = require('../helpers/errorResponse');

exports.checkCompanyExist = (companyId) => {
    return db.Company.count({
        where: {
            id: companyId,
        },
    });
};

exports.isCompanyExist = (companyName, registrationNumber) => {
    return db.Company.count({
        where: {
            [Sequelize.Op.or]: [
                {
                    companyName: { [Sequelize.Op.iLike]: companyName },
                },
                {
                    registrationNumber: { [Sequelize.Op.iLike]: registrationNumber },
                },
            ],
        },
    });
};

exports.isCompanyExistUser = (id) => {
    return db.Company.findOne({
        where: {
            userId: id,
        },
    });
};

exports.createCompanyProfile = (params) => {
    return db.Company.create(params);
};

exports.getProfile = (whereQuery) => {
    return db.Company.findOne({
        where: whereQuery,
        include: [
            {
                model: db.City,
                as: 'cities',
                attributes: ['id', 'name'],
            },
            {
                model: db.Country,
                as: 'countries',
                attributes: ['id', 'name'],
            },
        ],
    });
};

exports.isProfileApproved = (id) => {
    return db.Company.count({
        where: {
            status: 'Pending',
        },
    });
};

exports.updateProfile = (updateQuery, whereQuery) => {
    return db.Company.update(updateQuery, {
        where: whereQuery,
    });
};

exports.listUsers = (id, params) => {
    let whereQuery = {};
    if (params.search) {
        params.search = params.search.toLowerCase();
        whereQuery = {
            [Sequelize.Op.or]: [
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('firstName')), {
                    [Sequelize.Op.like]: `%${params.search}%`,
                }),
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), {
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
        password: { [Sequelize.Op.ne]: null },
    };
    if (params.status) {
        whereQuery = {
            ...whereQuery,
            status: params.status,
        };
    }
    return db.User.findAndCountAll({
        include: [
            {
                model: db.UserCompany,
                as: 'Company',
                where: {
                    companyId: id,
                },
                required: true,
            },
        ],
        limit: params.limit ? (parseInt(params.limit) === -1 ? null : parseInt(params.limit)) : 10,
        offset: params.page ? (params.page - 1) * (params.limit ? params.limit : CONSTANTS.DEFAULT.limit) : 0,
        where: whereQuery,
    });
};

exports.checkUserCompany = (companyId, userId) => {
    return db.UserCompany.count({
        where: {
            companyId: companyId,
            userId: userId,
        },
    });
};

exports.listAllCompany = (params) => {
    let whereQuery = {};
    if (params.status) {
        whereQuery = {
            ...whereQuery,
            status: params.status,
        };
    } else {
        whereQuery = {
            ...whereQuery,
            status: {
                [Sequelize.Op.ne]: 'rejected',
            },
        };
    }
    return db.Company.findAndCountAll({
        attributes: ['id', 'companyName'],
        where: whereQuery,
    });
};

exports.fetchAllCompany = (params, limit, offset, order) => {
    return db.Company.findAndCountAll({
        attributes: ['id', 'companyName', 'status', 'userId', 'logo', 'createdAt', 'updatedAt'],
        where: params,
        limit: limit,
        offset: offset,
        order: [[order]],
    });
};

exports.getCompanyId = async (userId) => {
    const transaction = await db.sequelize.transaction();

    try {
        let companyRecord = await db.UserCompany.findOne({
            where: { userId },
            attributes: ['companyId'],
            transaction,
        });

        if (!companyRecord) {
            companyRecord = await db.Company.findOne({
                where: { userId },
                attributes: ['id'],
                transaction,
            });

            if (!companyRecord) {
                throw new BadRequestException(i18n.__('COMPANY.COMPANY_NOT_EXIST'));
            }

            companyRecord = { companyId: companyRecord.id };
        }
        await transaction.commit();
        return companyRecord;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
