'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductionMaterial extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ProductionMaterial.belongsTo(models.TaeFee, {
                foreignKey: 'materialId',
                as: 'materials',
            });
        }
    }
    ProductionMaterial.init(
        {
            materialId: DataTypes.INTEGER,
            productionId: DataTypes.INTEGER,
            plan: DataTypes.FLOAT,
            taeStatus: DataTypes.STRING,
            actual: DataTypes.FLOAT,
            taePayStatus: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'ProductionMaterial',
        }
    );
    return ProductionMaterial;
};
