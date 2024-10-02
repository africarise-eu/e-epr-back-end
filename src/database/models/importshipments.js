'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ImportShipments extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ImportShipments.belongsTo(models.User, { foreignKey: 'userId' });
            ImportShipments.belongsTo(models.Company, { foreignKey: 'companyId' });
            ImportShipments.hasMany(models.ImportShipmentProducts, { as: 'products', foreignKey: 'shipmentId' });
            ImportShipments.hasMany(models.ProductMaterials, { foreignKey: 'productId' });
            ImportShipments.belongsTo(models.Country, { as: 'countries', foreignKey: 'countryId' });
            ImportShipments.belongsTo(models.FromPorts, { as: 'arrivalPorts', foreignKey: 'arrivalPort' });
            ImportShipments.hasMany(models.ImportShipmentMaterials, { foreignKey: 'importShipmentId', as: 'materials' });
        }
    }
    ImportShipments.init(
        {
            companyId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            cdNo: DataTypes.STRING,
            etaDate: DataTypes.DATE,
            productUnits: DataTypes.STRING,
            taeValue: DataTypes.STRING,
            payStatus: DataTypes.STRING,
            arrivalPort: DataTypes.INTEGER,
            country: DataTypes.STRING,
            fromPort: DataTypes.STRING,
            status: DataTypes.STRING,
            countryId: DataTypes.INTEGER,
            rejectedReason: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'ImportShipments',
        }
    );
    return ImportShipments;
};
