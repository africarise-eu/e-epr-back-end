'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TaeFee extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            TaeFee.hasMany(models.CompensationRequest, { foreignKey: 'materialId' });
            TaeFee.hasMany(models.ImportShipmentMaterials, { foreignKey: 'materialId', as: 'shipmentMaterials' });
        }
    }
    TaeFee.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            material: DataTypes.STRING,
            taeFeeMtTon: DataTypes.FLOAT,
            impactFactor: DataTypes.FLOAT,
            taeFeeMtKg: DataTypes.FLOAT,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'TaeFee',
        }
    );
    return TaeFee;
};
