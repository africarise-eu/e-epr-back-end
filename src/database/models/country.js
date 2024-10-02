'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Country extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Country.hasMany(models.City, {
                foreignKey: 'countyId',
                // as: 'Company',
                // through: model.UserCompany,
            });
            Country.hasMany(models.ImportShipments, {
                foreignKey: 'countryId',
            });
            Country.hasMany(models.Product, {
                foreignKey: 'countryOfManufacture',
            });
            Country.hasMany(models.EndDestination, { foreignKey: 'countryId' });
        }
    }
    Country.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Country',
        }
    );
    return Country;
};
