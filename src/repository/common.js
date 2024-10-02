const Sequelize = require('sequelize');
const db = require('../database/models');

exports.listAllCountry = (params) => {
    let whereQuery = {};
    if (params.search) {
        whereQuery = {
            ...whereQuery,
            name: {
                [Sequelize.Op.like]: `%${params.search}%`,
            },
        };
    }
    return db.Country.findAndCountAll({
        attributes: ['id', 'name'],
        where: whereQuery,
    });
};

exports.listAllCity = (params, id) => {
    let whereQuery = {};
    if (params.search) {
        whereQuery = {
            ...whereQuery,
            name: {
                [Sequelize.Op.like]: `%${params.search}%`,
            },
        };
    }
    whereQuery = {
        ...whereQuery,
        countyId: id,
    };
    return db.City.findAndCountAll({
        attributes: ['id', 'name'],
        where: whereQuery,
        order: [['id', 'ASC']],
    });
};

exports.isCountryExist = (id, cityId) => {
    return db.City.count({
        where: {
            id: cityId,
            countyId: id,
        },
    });
};

exports.listAllPorts = (params, id) => {
    let whereQuery = {};
    if (params.search) {
        whereQuery = {
            ...whereQuery,
            portname: {
                [Sequelize.Op.like]: `%${params.search}%`,
            },
        };
    }
    whereQuery = {
        ...whereQuery
    };
    return db.FromPorts.findAndCountAll({
        attributes: ['id', 'portname'],
        where: whereQuery,
        order: [['portname', 'ASC']],
    });
};
