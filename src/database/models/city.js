'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class City extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            City.hasMany(models.EndDestination, { foreignKey: 'cityId' });
            City.hasMany(models.Company, { foreignKey: 'city'})
        }
    }
    City.init(
        {
            name: DataTypes.STRING,
            lat: DataTypes.STRING,
            lng: DataTypes.STRING,
            countyId: DataTypes.INTEGER,
            adminName: DataTypes.STRING,
            capital: DataTypes.STRING,
            population: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'City',
        }
    );
    return City;
};
