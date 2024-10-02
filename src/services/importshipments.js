const importShipmentRepository = require('../repository/importshipments');
const i18n = require('i18n');
const db = require('../database/models');
const { BadRequestException } = require('../helpers/errorResponse');
const importShipmentProductRepository = require('../repository/importshipmentproduct');
const productRepository = require('../repository/product');
const companyRepository = require('../repository/company');

exports.addImports = async (params, userId) => {
    const { cdNo, etaDate, productUnits, taeValue, payStatus, arrivalPort, fromPort, status, products, countryId } = params;

    const existingShipment = await db.ImportShipments.findOne({
        where: { cdNo: cdNo },
    });

    if (existingShipment) {
        throw new Error('This cdNo already exists');
    }

    const company = await companyRepository.getCompanyId(userId);

    const companyId = company ? company.companyId : null;
    const transaction = await db.sequelize.transaction();

    try {
        const importShipmentDetails = await importShipmentRepository.addImports(
            {
                userId,
                companyId,
                cdNo,
                etaDate,
                productUnits,
                taeValue,
                payStatus: 'paid',
                arrivalPort,
                fromPort,
                status: 'pending',
                countryId,
            },
            { transaction }
        );

        const shipmentId = importShipmentDetails.id;

        if (products && products.length > 0) {
            const shipmentDetailsData = products.map((shipment) => ({
                userId,
                companyId,
                shipmentId,
                productId: shipment.productId,
                units: shipment.units,
                taeTotalValue: shipment.taeTotalValue,
            }));

            for (const detail of shipmentDetailsData) {
                if (!detail.productId) {
                    throw new Error('Product ID is null or undefined');
                }
            }

            await importShipmentProductRepository.createBulkImportShipments(shipmentDetailsData, { transaction });

            const importMaterialsData = await Promise.all(
                products.map(async (product) => {
                    const productMaterials = await db.ProductMaterials.findAll({
                        where: { productId: product.productId },
                        attributes: ['materialId', 'weight'],
                    });

                    return productMaterials.map((material) => ({
                        materialId: material.materialId,
                        importShipmentId: shipmentId,
                        actual: material.weight * product.units,
                    }));
                })
            );

            const flattenedImportMaterialsData = importMaterialsData.flat();

            if (flattenedImportMaterialsData.length > 0) {
                await db.ImportShipmentMaterials.bulkCreate(flattenedImportMaterialsData, { transaction });
            }
        }

        await transaction.commit();
        return importShipmentDetails;
    } catch (error) {
        await transaction.rollback();
        throw new Error(error.message);
    }
};

exports.updateImports = async (params, userId) => {
    const transaction = await db.sequelize.transaction();
    const company = companyRepository.getCompanyId(userId);

    const companyId = company ? company.companyId : null;

    try {
        const shipmentDetails = Array.isArray(params.products) ? params.products : [];
        const shipmentId = params.id;

        const importshipment = await importShipmentRepository.getImportById(params.id);
        if (!importshipment) throw new BadRequestException(i18n.__('IMPORTSHIPMENTS.IMPORT_SHIPMENT_NOT_EXIST'));
        if (importshipment.status === 'approved') throw new BadRequestException(i18n.__('IMPORTSHIPMENTS.CANNOT_EDIT'));

        params.status = importshipment.status === 'pending' ? 'pending' : 'improved';

        const whereQuery = {
            userId: userId,
            id: shipmentId,
        };

        const updateQuery = {
            ...params,
        };

        const [updatedImportShipmentCount, updatedImportShipment] = await importShipmentRepository.updateImports(
            updateQuery,
            whereQuery,
            transaction
        );
        if (updatedImportShipmentCount === 0) throw new Error('Import shipment update failed');
        const existingImportShipmentProducts = await importShipmentProductRepository.getImportShipmentProductsByImportShipmentId(params.id);

        const shipmentIdsToUpdate = shipmentDetails.map((shipment) => shipment.productId);

        const productIdToDelete = existingImportShipmentProducts
            .filter((shipment) => !shipmentIdsToUpdate.includes(shipment.productId))
            .map((shipment) => shipment.productId);

        if (productIdToDelete.length) {
            await importShipmentProductRepository.deleteImportShipmentProducts(shipmentId, productIdToDelete, transaction);
        }

        for (const products of shipmentDetails) {
            const shipmentWhereQuery = { productId: products.productId, shipmentId: shipmentId };
            const shipmentUpdateQuery = {
                userId,
                companyId,
                shipmentId,
                ...products,
            };
            const existingImportShipmentProduct = existingImportShipmentProducts.find((s) => {
                return s.productId === products.productId;
            });

            if (existingImportShipmentProduct) {
                await importShipmentProductRepository.updateImportShipmentProducts(shipmentUpdateQuery, shipmentWhereQuery, transaction);
            } else {
                shipmentUpdateQuery.productId = products.productId;
                shipmentUpdateQuery.shipmentId = shipmentId;
                await importShipmentProductRepository.createNewImportShipments(shipmentUpdateQuery, transaction);
            }
        }

        const importMaterialsData = await Promise.all(
            shipmentDetails.map(async (product) => {
                const productMaterials = await db.ProductMaterials.findAll({
                    where: { productId: product.productId },
                    attributes: ['materialId', 'weight'],
                });

                return productMaterials.map((material) => ({
                    materialId: material.materialId,
                    importShipmentId: shipmentId,
                    actual: material.weight * product.units,
                }));
            })
        );

        const flattenedImportMaterialsData = importMaterialsData.flat();

        const flattenedImportMaterialsDataMap = flattenedImportMaterialsData.reduce((acc, { materialId, importShipmentId, actual }) => {
            if (!acc[materialId]) {
                acc[materialId] = { importShipmentId, totalActual: 0 };
            }
            acc[materialId].totalActual += actual;
            return acc;
        }, {});

        const materialsToUpdate = Object.entries(flattenedImportMaterialsDataMap).map(
            ([materialId, { importShipmentId, totalActual }]) => ({
                materialId: Number(materialId),
                importShipmentId,
                actual: totalActual,
            })
        );

        await db.ImportShipmentMaterials.destroy({
            where: { importShipmentId: shipmentId },
            transaction,
        });

        await db.ImportShipmentMaterials.bulkCreate(materialsToUpdate, { transaction });

        await transaction.commit();
        return updatedImportShipment;
    } catch (error) {
        await transaction.rollback();
        console.error('Detailed Error:', error);
        throw new Error(error);
    }
};

exports.getImports = async (params, userId) => {
    const importShipmentDetails = await importShipmentRepository.getImports(params, userId);
    return importShipmentDetails;
};

exports.getImportById = async (id) => {
    const shipment = await importShipmentRepository.getImportById(id);

    if (shipment && shipment.products) {
        for (const importShipmentProduct of shipment.products) {
            const product = importShipmentProduct.product;
            if (product) {
                const productId = product.dataValues?.id || product.id;

                if (productId) {
                    await productRepository.getProductWithSignedUrl(product);
                    const totalAmount = await productRepository.totalProductAmount(productId);
                    product.dataValues.totalAmount = totalAmount;
                } else {
                    console.warn('Product ID is undefined for product:', product);
                    product.dataValues.totalAmount = null;
                }
            }
        }
    }

    return shipment;
};

exports.getImportByYear = async (params, userId) => {
    const shipment = await importShipmentRepository.getImportByYear(params, userId);
    return shipment;
};

exports.deleteImports = async (params, userId) => {
    if (!userId) throw new BadRequestException(i18n.__('IMPORTSHIPMENTS.CANNOT_DELETE'));

    const shipmentId = params;

    const shipment = await importShipmentRepository.getImportById(shipmentId);
    if (!shipment) throw new BadRequestException(i18n.__('IMPORTSHIPMENTS.IMPORT_SHIPMENT_NOT_EXIST'));

    const transaction = await db.sequelize.transaction();

    try {
        await db.ImportShipmentMaterials.destroy({
            where: { importShipmentId: shipmentId },
            transaction,
        });

        const whereQuery = {
            id: shipmentId,
            userId: userId,
        };
        const shipmentDetails = await importShipmentRepository.deleteImports(whereQuery, { transaction });

        await transaction.commit();
        return shipmentDetails;
    } catch (error) {
        await transaction.rollback();
        console.error('Detailed Error:', error);
        throw new Error(error.message);
    }
};
