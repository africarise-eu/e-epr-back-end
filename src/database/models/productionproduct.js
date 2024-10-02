'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductionProduct extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ProductionProduct.belongsTo(models.Product, {
                foreignKey: 'productId',
                as: 'product',
            });
            ProductionProduct.belongsTo(models.Production, {
                foreignKey: 'productionId',
                as: 'production',
            });
        }
    }
    ProductionProduct.init(
        {
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            productionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            plan: {
                type: DataTypes.FLOAT,
            },
            planVerification: {
                type: DataTypes.STRING,
            },
            planAmount: {
                type: DataTypes.FLOAT,
            },
            planRejectReason: {
                type: DataTypes.TEXT,
            },
            actual: {
                type: DataTypes.FLOAT,
            },
            actualStatus: {
                type: DataTypes.STRING,
            },
            actualAmount: {
                type: DataTypes.FLOAT,
            },
            actualRejectedReason: {
                type: DataTypes.TEXT,
            },
        },
        {
            sequelize,
            modelName: 'ProductionProduct',
        }
    );
    return ProductionProduct;
};
