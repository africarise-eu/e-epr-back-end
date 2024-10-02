const db = require('../database/models');

exports.createBulkImportShipments = (params) => {
    return db.ImportShipmentProducts.bulkCreate(params);
};

exports.getImportShipmentProductsByImportShipmentId = (shipmentId) => {
    return db.ImportShipmentProducts.findAll({
        where: { shipmentId },
        attributes: ['id', 'productId'],
    });
};

exports.deleteImportShipmentProducts = (shipmentIds, productIdToDelete) => {
    return db.ImportShipmentProducts.destroy({
        where: { shipmentId: shipmentIds, productId: productIdToDelete },
    });
};

exports.updateImportShipmentProducts = (updateQuery, whereQuery) => {
    return db.ImportShipmentProducts.update(updateQuery, {
        where: whereQuery,
    });
};

exports.createNewImportShipments = (params) => {
    return db.ImportShipmentProducts.create(params);
};
