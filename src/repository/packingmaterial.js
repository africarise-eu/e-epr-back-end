const Sequelize = require('sequelize');
const db = require('../database/models');

exports.getMaterials = () => {
    const materials = db.TaeFee.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        where: {
            material: { [Sequelize.Op.notIn]: ['Cardboard', 'Hazardous'] },
        },
        order: [['id', 'ASC']],
    });
    return materials;
};
