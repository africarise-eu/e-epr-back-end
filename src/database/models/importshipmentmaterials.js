'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ImportShipmentMaterials extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ImportShipmentMaterials.belongsTo(models.ImportShipments, {
        foreignKey: 'importShipmentId',
        as: 'importShipment',
      });
      ImportShipmentMaterials.belongsTo(models.TaeFee, {
        foreignKey: 'materialId',
        as: 'material',
      });
    }
  }

  ImportShipmentMaterials.init(
    {
      materialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'TaeFees',
          key: 'id',
        },
      },
      importShipmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ImportShipments',
          key: 'id',
        },
      },
      actual: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      }
    },
    {
      sequelize,
      modelName: 'ImportShipmentMaterials',
    }
  );

  return ImportShipmentMaterials;
};
