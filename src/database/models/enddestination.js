'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class EndDestination extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            EndDestination.belongsTo(models.Company, { foreignKey: 'companyId' });
            EndDestination.belongsTo(models.User, { foreignKey: 'userId' });
            EndDestination.belongsTo(models.Country, { foreignKey: 'countryId' });
            EndDestination.belongsTo(models.City, { foreignKey: 'cityId' });
            EndDestination.hasMany(models.CompensationRequest, { foreignKey: 'edOrganisationId' });
        }
    }
    EndDestination.init(
        {
            companyId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Companies',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            countryId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Country',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            cityId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'City',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            orgType: DataTypes.STRING,
            orgName: DataTypes.STRING,
            companyRegNo: DataTypes.STRING,
            phone: DataTypes.STRING,
            email: DataTypes.STRING,
            contactPerson: DataTypes.STRING,
            address: DataTypes.STRING,
            status: DataTypes.STRING,
            rejectedReason: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'EndDestination',
        }
    );
    return EndDestination;
};
