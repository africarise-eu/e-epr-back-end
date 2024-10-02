'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductMaterials extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ProductMaterials.belongsTo(models.Product, { foreignKey: 'productId' });
            ProductMaterials.belongsTo(models.TaeFee, { foreignKey: 'materialId' });
            ProductMaterials.belongsTo(models.ImportShipments, { foreignKey: 'productId' });
        }
    }
    ProductMaterials.init(
        {
            productId: DataTypes.INTEGER,
            materialId: DataTypes.INTEGER,
            weight: DataTypes.FLOAT,
            taeKg: DataTypes.FLOAT,
            taeTotal: DataTypes.FLOAT,
            verification: DataTypes.STRING,
            rejectedReason: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'ProductMaterials',
        }
    );
    return ProductMaterials;
};
