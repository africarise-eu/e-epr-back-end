'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ImportShipmentProducts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ImportShipmentProducts.belongsTo(models.Product, { as: 'product',foreignKey: 'productId' });
            ImportShipmentProducts.belongsTo(models.User, { foreignKey: 'userId' });
            ImportShipmentProducts.belongsTo(models.Company, { foreignKey: 'companyId' });
            ImportShipmentProducts.belongsTo(models.ImportShipments, { foreignKey: 'shipmentId' });
        }
    }
    ImportShipmentProducts.init(
        {
            productId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            companyId: DataTypes.INTEGER,
            taeTotalValue: DataTypes.STRING,
            units: DataTypes.STRING,
            shipmentId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'ImportShipmentProducts',
        }
    );
    return ImportShipmentProducts;
};
