const i18n = require('i18n');
const productRepository = require('../repository/product');
const productMaterialRepository = require('../repository/productMaterial');
const userRepository = require('../repository/user');
const companyRepository = require('../repository/company');
const verifierRepository = require('../repository/verifier');
const ENUM = require('../config/enum');
const db = require('../database/models');
const { Op } = require('sequelize');
const { BadRequestException } = require('../helpers/errorResponse');
const s3 = require('../utils/s3');

exports.getTAE_Fees = async (params) => {
    const taeFees = await productRepository.getTAE_Fees();
    return taeFees;
};

exports.addProduct = async (params, userId) => {
    const {
        productName,
        productCategory,
        production,
        image,
        manufacturerCompany,
        countryOfManufacture,
        brandName,
        productModelTypeVolume,
        barcode,
        internalArticleCode,
        packingMaterials,
    } = params;

    const companyDetails = await companyRepository.getCompanyId(userId);

    const companyId = companyDetails.companyId;

    const transaction = await db.sequelize.transaction();
    try {
        const product = await productRepository.createProduct(
            {
                companyId,
                productName,
                productCategory,
                production,
                manufacturerCompany,
                countryOfManufacture,
                brandName,
                productModelTypeVolume,
                barcode,
                internalArticleCode,
                image,
                userId,
                status: 'pending',
            },
            { transaction }
        );
        if (packingMaterials && packingMaterials.length > 0) {
            const productMaterialsData = packingMaterials.map((material) => ({
                productId: product.id,
                materialId: material.materialId,
                weight: material.weight,
                taeKg: material.TAE_KG,
                taeTotal: material.TAE_Total,
                verification: 'pending',
            }));
            await productMaterialRepository.createBulkProductMaterial(productMaterialsData, { transaction });
        }
        if (product) {
            await verifierRepository.addLogs({
                companyId: product.companyId,
                userId: userId,
                objectType: ENUM.objectType.PRODUCT,
                objectName: product.productName,
                fromStatus: null,
                toStatus: product.status,
                comment: product && product.rejectedReason ? product.rejectedReason : null,
                objectNameId: product.id,
            });
        }
        // Commit the transaction
        await transaction.commit();
        return product;
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        throw error;
    }
};

exports.getProductById = async (params) => {
    const product = await productRepository.getProductById(params);
    if (product.image) {
        try {
            const signedUrl = await s3.signedUrl(product.image);
            product.dataValues.actualImageUrl = signedUrl;
        } catch (error) {
            console.error('Error fetching signed URL for image:', product.image, error);
            product.dataValues.actualImageUrl = null;
        }
    }
    return product;
};

exports.getAllProducts = async (params, userId) => {
    let companyId;
    if (params.user.roleId === 4) {
        const companyData = await userRepository.userCompany({
            userId: userId,
        });
        if (!companyData) throw new BadRequestException(i18n.__('COMPANY.COMPANY_NOT_EXIST'));
        companyId = companyData.companyId;
    }
    if (params.user.roleId === 3) {
        const companyData = await companyRepository.getProfile({ userId: userId });
        if (!companyData) throw new BadRequestException(i18n.__('COMPANY.COMPANY_NOT_EXIST'));
        companyId = companyData.id;
    }
    const { count, rows } = await productRepository.getAllProducts(params, companyId);
    if (!Array.isArray(rows)) {
        throw new Error('Expected an array of products');
    }
    const productsWithSignedUrls = await Promise.all(
        rows.map(async (product) => {
            let productData = { ...product.dataValues };
            if (product.image) {
                try {
                    const signedUrl = await s3.signedUrl(product.image);
                    productData.actualImageUrl = signedUrl;
                } catch (error) {
                    console.error('Error fetching signed URL for image:', product.image, error);
                    productData.actualImageUrl = signedUrl;
                }
            }
            return productData;
        })
    );

    return { count, rows: productsWithSignedUrls };
};

exports.updateProduct = async (params, userId) => {
    const transaction = await db.sequelize.transaction();
    try {
        const product = await productRepository.getProductById(params.id);
        if (!product) throw new BadRequestException(i18n.__('PRODUCT.PRODUCT_NOT_EXIST'));
        if (product.status === 'approved') throw new BadRequestException(i18n.__('PRODUCT.CANNOT_EDIT'));
        const company = await companyRepository.getCompanyId(userId);
        // Update product details
        params.status = product.status === 'pending' ? 'pending' : 'improved';
        const whereQuery = { id: params.id, userId: userId };
        const updateQuery = { ...params };

        const [updatedProductCount, updatedProduct] = await productRepository.updateProduct(updateQuery, whereQuery, transaction);
        if (updatedProductCount === 0) throw new Error('Product update failed');

        // Update product materials
        const existingMaterials = await productMaterialRepository.getProductMaterialsByProductId(params.id, transaction);
        const materialIdsToUpdate = params.packingMaterials.map((material) => material.id);
        const materialIdsToDelete = existingMaterials
            .filter((material) => !materialIdsToUpdate.includes(material.id))
            .map((material) => material.id);

        // Delete removed materials
        if (materialIdsToDelete.length) {
            await productMaterialRepository.deleteProductMaterials(materialIdsToDelete, transaction);
        }

        // Update existing or add new materials
        for (const material of params.packingMaterials) {
            const materialWhereQuery = { id: material.id };
            const materialUpdateQuery = {
                taeKg: material.TAE_KG,
                taeTotal: material.TAE_Total,
                weight: material.weight,
                verification: 'pending',
                materialId: material.materialId,
            };

            const existingMaterial = existingMaterials.find((m) => m.id === material.id);
            if (existingMaterial) {
                await productMaterialRepository.updateProductMaterial(materialUpdateQuery, materialWhereQuery, transaction);
            } else {
                materialUpdateQuery.productId = params.id; // Add productId for new materials
                await productMaterialRepository.createBulkProductMaterial([materialUpdateQuery], transaction);
            }
        }

        if (updatedProductCount !== 0) {
            await verifierRepository.addLogs({
                companyId: company.companyId,
                userId: userId,
                objectType: ENUM.objectType.PRODUCT,
                objectName: product.productName,
                fromStatus: product.status,
                toStatus: params.status,
                comment: params && params.rejectedReason ? params.rejectedReason : null,
                objectNameId: product.id,
            });
        }
        await transaction.commit();
        return updatedProduct;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.getProductNames = async (query) => {
    try {
        const sanitizedQuery = query.trim();
        const products = await db.Product.findAll({
            where: {
                productName: {
                    [Op.iLike]: `${sanitizedQuery}%`,
                },
            },
            attributes: ['id', 'productName', 'brandName'],
        });
        return products;
    } catch (error) {
        throw error;
    }
};

exports.deleteProducts = async (params, userId) => {
    if (!userId) throw new BadRequestException(i18n.__('PRODUCT.CANNOT_DELETE'));

    const product = await productRepository.getProductById(params);
    if (!product) throw new BadRequestException(i18n.__('PRODUCT.PRODUCT_NOT_EXIST'));
    if (product.userId !== userId) throw new BadRequestException(i18n.__('PRODUCT.CANNOT_DELETE'));
    const whereQuery = {
        id: params,
        userId: userId,
    };
    const products = await productRepository.deleteProducts(whereQuery);
    return products;
};

exports.getApprovedProducts = async (params, userId, menuType, excludeIds) => {
    if (excludeIds && typeof excludeIds === 'string') {
        try {
            excludeIds = JSON.parse(excludeIds);
        } catch (e) {
            console.error('Failed to parse excludeIds:', e);
            excludeIds = [];
        }
    }
    if (!Array.isArray(excludeIds)) {
        excludeIds = [];
    }

    const companyDetails = await companyRepository.getCompanyId(userId);
    const { count, rows } = await productRepository.getApprovedProducts(params, companyDetails.companyId, menuType, excludeIds);
    if (!Array.isArray(rows)) {
        throw new Error('Expected an array of products');
    }
    const productsWithSignedUrls = await Promise.all(
        rows.map(async (product) => {
            let productData = { ...product.dataValues };
            if (product.image) {
                try {
                    const signedUrl = await s3.signedUrl(product.image);
                    productData.actualImageUrl = signedUrl;
                } catch (error) {
                    console.error('Error fetching signed URL for image:', product.image, error);
                    productData.actualImageUrl = signedUrl;
                }
            }
            return productData;
        })
    );

    return { count, rows: productsWithSignedUrls };
};
