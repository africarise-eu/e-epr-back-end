'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Production extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Production.hasMany(models.ProductionProduct, {
                foreignKey: 'productionId',
                as: 'productionProduct',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
            Production.hasMany(models.ProductionMaterial, {
                foreignKey: 'productionId',
                as: 'productionMaterial',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
            Production.belongsTo(models.Company, {
                foreignKey: 'companyId',
                as: 'Company',
            });
        }
    }
    Production.init(
        {
            title: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.TEXT,
            },
            companyId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            planYear: {
                type: DataTypes.INTEGER,
            },
            previousYear: {
                type: DataTypes.INTEGER,
            },
            isDraft: {
                type: DataTypes.BOOLEAN,
            },
            status: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: 'Production',
        }
    );
    return Production;
};
