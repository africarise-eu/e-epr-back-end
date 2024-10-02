'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Product.hasMany(models.ProductMaterials, { foreignKey: 'productId' });
            Product.belongsTo(models.Company, {
                foreignKey: 'companyId',
                as: 'Company',
            });
            Product.belongsTo(models.User, { foreignKey: 'userId' });
            Product.hasMany(models.ProductMaterials, { as: 'packingMaterials', foreignKey: 'productId' });
            Product.hasMany(models.ImportShipmentProducts, { foreignKey: 'productId' });
            Product.belongsTo(models.Country, { as: 'countries', foreignKey: 'countryOfManufacture' });
        }
    }
    Product.init(
        {
            companyId: DataTypes.INTEGER,
            productName: DataTypes.STRING,
            productCategory: DataTypes.STRING,
            production: DataTypes.STRING,
            image: DataTypes.STRING,
            manufacturerCompany: DataTypes.STRING,
            countryOfManufacture: DataTypes.INTEGER,
            brandName: DataTypes.STRING,
            productModelTypeVolume: DataTypes.STRING,
            barcode: DataTypes.STRING,
            internalArticleCode: DataTypes.STRING,
            status: DataTypes.STRING,
            userId: DataTypes.INTEGER,
            rejectedReason: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'Product',
        }
    );
    return Product;
};
