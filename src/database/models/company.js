'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Company extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Company.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'User',
            });
            Company.hasMany(models.Product, {
                foreignKey: 'companyId',
                as: 'Products',
            });
            Company.belongsTo(models.Country, {
                foreignKey: 'country',
                as: 'countries',
            });
            Company.belongsTo(models.City, {
                foreignKey: 'city',
                as: 'cities',
            });
            Company.hasMany(models.ImportShipments, {
                foreignKey: 'companyId',
            });
            Company.hasMany(models.ImportShipmentProducts, {
                foreignKey: 'companyId',
            });
            Company.hasMany(models.CompensationRequest, {
                foreignKey: 'companyId',
                as: 'CompensationRequests',
            });
            Company.hasMany(models.Production, {
                foreignKey: 'companyId',
                as: 'Productions',
            });
        }
    }
    Company.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            companyName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            person: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            imagePath: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            isProducer: {
                type: DataTypes.BOOLEAN,
            },
            isImporter: {
                type: DataTypes.BOOLEAN,
            },
            registrationNumber: {
                type: DataTypes.STRING,
            },
            activityCode: {
                type: DataTypes.STRING,
            },
            address: {
                type: DataTypes.STRING,
            },
            city: {
                type: DataTypes.INTEGER,
            },
            phoneNumber: {
                type: DataTypes.STRING,
            },
            website: {
                type: DataTypes.STRING,
            },
            bankAccount: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.STRING,
            },
            country: {
                type: DataTypes.INTEGER,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            logo: {
                type: DataTypes.STRING,
            },
            rejectedReason: {
                type: DataTypes.TEXT,
            },
        },
        {
            sequelize,
            modelName: 'Company',
            paranoid: true,
        }
    );
    return Company;
};
