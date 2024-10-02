const db = require('../database/models');

exports.createBulkProductMaterial = (params, transaction) => {
    return db.ProductMaterials.bulkCreate(params, transaction);
};

exports.updateProductMaterial = (updateQuery,whereQuery, transaction) => {
    return db.ProductMaterials.update(updateQuery, {
        where: whereQuery,
        transaction,
    })
};

exports.getProductMaterialsByProductId = (productId) => {
    return db.ProductMaterials.findAll({
        where: { productId },
        attributes: ['id'],
    });
};

exports.deleteProductMaterials = (materialIds) => {
    return db.ProductMaterials.destroy({
        where: { id: materialIds },
    });
};