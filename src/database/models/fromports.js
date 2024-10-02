'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FromPorts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            FromPorts.hasMany(models.ImportShipments, { as: 'arrivalPorts',foreignKey: 'arrivalPort' });
        }
    }
    FromPorts.init({
        portname: DataTypes.STRING,
        province: DataTypes.STRING,
        townname: DataTypes.STRING,
        lat: DataTypes.STRING,
        lng: DataTypes.STRING,
        code: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'FromPorts',
    });
    return FromPorts;
}