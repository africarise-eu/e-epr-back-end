const Sequelize = require('sequelize');

const verifierRepository = require('../repository/verifier');
const productRepository = require('../repository/product');
const companyRepository = require('../repository/company');
const productionRepository = require('../repository/production');
const compensationRepository = require('../repository/compensation');
const importRepository = require('../repository/importshipments');
const { ENUM } = require('../config');
const s3 = require('../utils/s3');

exports.getPendingCounts = async () => {
    const whereCondition = {
        status: {
            [Sequelize.Op.or]: ['pending', 'improved'],
        },
    };
    const companyCounts = verifierRepository.getPendingCompanyCount(whereCondition);
    const productCounts = verifierRepository.getProductCount(whereCondition);
    const productionPlanCounts = verifierRepository.getProductionPlanCount(whereCondition);
    const importsCounts = verifierRepository.getImportsCount(whereCondition);
    const compensationCounts = verifierRepository.getCompensationCount(whereCondition);
    const endDestinationCounts = verifierRepository.getEndDestinationCount(whereCondition);
    const [companyCount, productCount, productionPlanCount, importsCount, compensationCount, endDestinationCount] = await Promise.all([
        companyCounts,
        productCounts,
        productionPlanCounts,
        importsCounts,
        compensationCounts,
        endDestinationCounts,
    ]);
    return {
        companyCount,
        productCount,
        productionPlanCount,
        importsCount,
        compensationCount,
        endDestinationCount,
        lateTaePayment: 0,
    };
};

exports.listVerifier = async (params) => {
    const verifierData = await verifierRepository.listAllVerifier(params);
    return verifierData;
};

exports.changeCompanyStatus = async (params, verifierId) => {
    const companyData = await verifierRepository.getACompanyProfile({
        id: params.id,
    });
    const updateQuery = {
        status: params.status,
        rejectedReason: params && params.rejectedReason ? params.rejectedReason : null,
    };
    const whereQuery = {
        id: params.id,
    };
    const updateData = await verifierRepository.updateCompanyStatus(updateQuery, whereQuery);
    if (updateData[0] !== 0 && companyData.status !== params.status) {
        await verifierRepository.addLogs({
            companyId: params.id,
            userId: verifierId,
            objectType: ENUM.objectType.COMPANY,
            objectName: companyData.companyName,
            fromStatus: companyData.status,
            toStatus: params.status,
            comment: params && params.rejectedReason ? params.rejectedReason : null,
            objectNameId: params.id,
        });
        await verifierRepository.incrementVerifier(verifierId);
    }
    return;
};

exports.changeProductStatus = async (params, verifierId) => {
    const productData = await productRepository.getProductDetails({
        id: params.id,
    });
    const updateQuery = {
        status: params.status,
        rejectedReason: params && params.rejectedReason ? params.rejectedReason : null,
    };
    const whereQuery = {
        id: params.id,
    };
    const updateData = await productRepository.updateProduct(updateQuery, whereQuery);
    if (updateData[0] !== 0) {
        await verifierRepository.addLogs({
            companyId: productData.companyId,
            userId: verifierId,
            objectType: ENUM.objectType.PRODUCT,
            objectName: productData.productName,
            fromStatus: productData.status,
            toStatus: params.status,
            comment: params && params.rejectedReason ? params.rejectedReason : null,
            objectNameId: params.id,
        });
        await verifierRepository.incrementVerifier(verifierId);
    }
    return;
};

exports.listAllCompany = async (params) => {
    let whereQuery = {};

    if (params.search) {
        whereQuery = {
            ...whereQuery,
            companyName: { [Sequelize.Op.iLike]: `%${params.search}%` },
        };
    }
    if (params.status) {
        whereQuery = {
            ...whereQuery,
            status: params.status,
        };
    } else {
        whereQuery = {
            ...whereQuery,
            status: { [Sequelize.Op.or]: ['pending', 'improved', 'rejected', 'approved'] },
        };
    }

    const order = Sequelize.literal(`CASE
        WHEN "Company"."status" = 'pending' THEN 1
        WHEN "Company"."status" = 'improved' THEN 2
        WHEN "Company"."status" = 'rejected' THEN 3
        WHEN "Company"."status" = 'approved' THEN 4
        ELSE 5
    END`);

    const limit = params.limit ? (parseInt(params.limit) === -1 ? null : parseInt(params.limit)) : 10;
    const offset = params.page ? (params.page - 1) * (params.limit ? params.limit : 10) : 0;
    const data = await companyRepository.fetchAllCompany(whereQuery, limit, offset, order);
    return data;
};

exports.listAllProduct = async (params) => {
    let whereQuery = {};

    if (params.companyId) {
        whereQuery = {
            ...whereQuery,
            companyId: params.companyId,
        };
    }

    if (params.search) {
        whereQuery = {
            ...whereQuery,
            productName: { [Sequelize.Op.iLike]: `%${params.search}%` },
        };
    }

    if (params.status) {
        whereQuery = {
            ...whereQuery,
            status: params.status,
        };
    } else {
        whereQuery = {
            ...whereQuery,
            status: { [Sequelize.Op.or]: ['pending', 'improved', 'rejected', 'approved'] },
        };
    }

    const limit = params.limit ? (parseInt(params.limit) === -1 ? null : parseInt(params.limit)) : 10;
    const offset = params.page ? (params.page - 1) * (params.limit ? params.limit : 10) : 0;

    const order = Sequelize.literal(`CASE
        WHEN "Product"."status" = 'pending' THEN 1
        WHEN "Product"."status" = 'improved' THEN 2
        WHEN "Product"."status" = 'rejected' THEN 3
        WHEN "Product"."status" = 'approved' THEN 4
        ELSE 5
    END`);

    const data = await verifierRepository.getAllProducts(whereQuery, limit, offset, order);

    return {
        ...data,
        rows: data.rows || [],
    };
};

exports.changeMaterialStatus = async (params) => {
    const updateQuery = {
        verification: params.status,
        rejectedReason: params && params.rejectedReason ? params.rejectedReason : null,
    };
    const whereQuery = {
        id: params.id,
    };
    await verifierRepository.updateMaterialStatus(updateQuery, whereQuery);
    return true;
};

exports.changeProductionPlanStatus = async (params) => {
    const updateQuery = {
        planVerification: params.status,
        rejectedReason: params && params.rejectedReason ? params.rejectedReason : null,
    };
    const whereQuery = {
        id: id,
    };
    await verifierRepository.changeProductionPlan(updateQuery, whereQuery);
};

exports.getAllProduction = async (id, params) => {
    const currentYear = new Date().getFullYear();
    const productionProduct = verifierRepository.getProductionPlan(
        {
            companyId: id,
            planYear: currentYear,
        },
        params
    );
    const productionProductPreviousYear = verifierRepository.getProductionPlan({
        companyId: id,
        planYear: currentYear - 1,
    });
    const [productionProducts, productionProductPreviousYears] = await Promise.all([productionProduct, productionProductPreviousYear]);

    const finalData = [];
    if (productionProducts) {
        for (const product of productionProducts.productionProduct) {
            let imageUrl;
            if (product.product && product.product.image) {
                imageUrl = await s3.signedUrl(product.product.image);
            }
            if (!productionProductPreviousYears) {
                finalData.push({
                    id: product.id,
                    productId: product.productId,
                    plan: product.plan,
                    planStatus: product.planVerification,
                    actual: product.actual,
                    actualStatus: product.actualStatus,
                    previousPlan: 0,
                    previousActual: 0,
                    productName: product.product ? product.product.productName : null,
                    productImage: product.product ? product.product.image : null,
                    internalArticleCode: product.product ? product.product.internalArticleCode : null,
                    productCategory: product.product ? product.product.productCategory : null,
                });
            }
            if (
                productionProductPreviousYears &&
                productionProductPreviousYears.productionProduct.some((obj) => obj.productId === product.productId)
            ) {
                const index = productionProductPreviousYears.productionProduct.findIndex((obj) => obj.productId === product.productId);
                finalData.push({
                    id: product.id,
                    productId: product.productId,
                    plan: product.plan,
                    planStatus: product.planVerification,
                    actual: product.actual,
                    actualStatus: product.actualStatus,
                    previousPlan: productionProductPreviousYears.productionProduct[index].plan,
                    previousActual: productionProductPreviousYears.productionProduct[index].actual,
                    productName: product.product ? product.product.productName : null,
                    productImage: product.product ? product.product.image : null,
                });
            }
        }
    }

    return finalData;
};

exports.updateProductionPlanStatus = async (params, verifierId) => {
    const productionProductData = await verifierRepository.getProductionProduct({
        id: params.id,
    });
    const updateQuery = {
        planVerification: params.planVerification,
        planRejectReason: params && params.planRejectReason ? params.planRejectReason : undefined,
        actualStatus: params.actualStatus,
        actualRejectedReason: params && params.actualRejectedReason ? params.actualRejectedReason : undefined,
    };
    const whereQuery = {
        id: params.id,
    };
    console.log(productionProductData);

    const updateData = await verifierRepository.productionPlanUpdate(updateQuery, whereQuery);
    if (updateData[0] !== 0 && productionProductData.planVerification !== params.planVerification) {
        await verifierRepository.addLogs({
            companyId: productionProductData.production.companyId,
            userId: verifierId,
            objectType: ENUM.objectType.PRODUCTION,
            objectName: productionProductData.production.planYear,
            fromStatus: productionProductData.planVerification,
            toStatus: params.planVerification,
            comment: params && params.planRejectReason ? params.planRejectReason : null,
            objectNameId: params.id,
        });
        await verifierRepository.incrementVerifier(verifierId);
    }
    if (updateData[0] !== 0 && params.actualStatus && productionProductData.actualStatus !== params.actualStatus) {
        await verifierRepository.addLogs({
            companyId: productionProductData.production.companyId,
            userId: verifierId,
            objectType: ENUM.objectType.PRODUCTION,
            objectName: productionProductData.production.planYear,
            fromStatus: productionProductData.planVerification,
            toStatus: params.planVerification,
            comment: params && params.planRejectReason ? params.planRejectReason : null,
            objectNameId: params.id,
        });
        await verifierRepository.incrementVerifier(verifierId);
    }
    return;
};

exports.getCompanyProfile = async (id) => {
    const data = await verifierRepository.getACompanyProfile({
        id: id,
    });
    return data;
};

exports.getProductionPlanById = async (id) => {
    const data = await productionRepository.getProductionProduct({ id: id });
    if (data && data.product) {
        data.product.image = await s3.signedUrl(data.product.image);
    }
    return data;
};

exports.getEndDestination = async (params) => {
    const { search, status, limit = 10, page = 1 } = params;
    let statusFilter;

    if (status) {
        statusFilter = { status: status };
    } else {
        statusFilter = { status: { [Sequelize.Op.or]: ['pending', 'improved', 'rejected', 'approved'] } };
    }

    const order = Sequelize.literal(`CASE
        WHEN "EndDestination"."status" = 'pending' THEN 1
        WHEN "EndDestination"."status" = 'improved' THEN 2
        WHEN "EndDestination"."status" = 'rejected' THEN 3
        WHEN "EndDestination"."status" = 'approved' THEN 4
        ELSE 5
    END`);

    const data = await verifierRepository.listEndDestination(statusFilter, search, limit, page, order);
    return data;
};

exports.updateCompensation = async (params, verifierId) => {
    const compensationData = await compensationRepository.getACompensation({
        id: params.id,
    });
    const updateQuery = {
        status: params.status,
        rejectedReason: params && params.rejectedReason ? params.rejectedReason : null,
    };
    const whereQuery = {
        id: params.id,
    };
    const updateData = await verifierRepository.updateCompensationStatus(updateQuery, whereQuery);
    if (updateData[0] !== 0 && compensationData.status !== params.status) {
        await verifierRepository.addLogs({
            companyId: compensationData.companyId,
            userId: verifierId,
            objectType: ENUM.objectType.COMPENSATION,
            objectName: compensationData.createdAt.toISOString().split(' ')[0].split('-')[0],
            fromStatus: compensationData.status,
            toStatus: params.status,
            comment: params && params.rejectedReason ? params.rejectedReason : null,
            objectNameId: params.id,
        });
        await verifierRepository.incrementVerifier(verifierId);
    }
    return;
};

exports.changeEndDestinationStatus = async (params, verifierId) => {
    const endDestinationData = await compensationRepository.getAEndDestination({
        id: params.id,
    });
    const updateQuery = {
        status: params.status,
        rejectedReason: params && params.rejectedReason ? params.rejectedReason : null,
    };
    const whereQuery = {
        id: params.id,
    };
    const updateData = await verifierRepository.changeEndDestinationStatus(updateQuery, whereQuery);
    if (updateData[0] !== 0 && endDestinationData.status !== params.status) {
        await verifierRepository.addLogs({
            companyId: endDestinationData.companyId,
            userId: verifierId,
            objectType: ENUM.objectType.END_DESTINATION,
            objectName: endDestinationData.createdAt.toISOString().split(' ')[0].split('-')[0],
            fromStatus: endDestinationData.status,
            toStatus: params.status,
            comment: params && params.rejectedReason ? params.rejectedReason : null,
            objectNameId: params.id,
        });
        await verifierRepository.incrementVerifier(verifierId);
    }
    return;
};

exports.getAllImport = async (id, params) => {
    let whereQuery = {};

    if (id != 0) {
        whereQuery = {
            ...whereQuery,
            companyId: id,
        };
    }

    if (params.status) {
        whereQuery = {
            ...whereQuery,
            status: params.status,
        };
    }
    if (params.search) {
        whereQuery = {
            ...whereQuery,
            [Sequelize.Op.or]: [
                {
                    '$Company.companyName$': { [Sequelize.Op.iLike]: `%${params.search}%` },
                },
                {
                    cdNo: { [Sequelize.Op.iLike]: `%${params.search}%` },
                },
                {
                    productUnits: { [Sequelize.Op.iLike]: params.search },
                },
            ],
        };
    }
    // else {
    //     whereQuery = {
    //         ...whereQuery,
    //         status: { [Sequelize.Op.or]: ['pending', 'delayed', 'cleared', 'notyetcleared'] },
    //     };
    // }

    const order = Sequelize.literal(`CASE
        WHEN "ImportShipments"."status" = 'pending' THEN 1
        WHEN "ImportShipments"."status" = 'improved' THEN 2
        WHEN "ImportShipments"."status" = 'rejected' THEN 3
        WHEN "ImportShipments"."status" = 'approved' THEN 4
        ELSE 5
    END`);

    const limit = params.limit ? (parseInt(params.limit) === -1 ? null : parseInt(params.limit)) : 10;
    const offset = params.page ? (params.page - 1) * (params.limit ? params.limit : 10) : 0;
    const data = await verifierRepository.getAllImport(whereQuery, limit, offset, order);

    return {
        ...data,
        rows: data.rows || [],
    };
};

exports.updateImport = async (params, verifierId) => {
    const importData = await importRepository.getAImport({
        id: params.id,
    });
    const updateQuery = {
        status: params.status,
        rejectedReason: params && params.rejectedReason ? params.rejectedReason : null,
    };
    const whereQuery = {
        id: params.id,
    };
    const updateData = await verifierRepository.changeImportStatus(updateQuery, whereQuery);
    if (updateData[0] !== 0 && importData.status !== params.status) {
        await verifierRepository.addLogs({
            companyId: importData.companyId,
            userId: verifierId,
            objectType: ENUM.objectType.IMPORT,
            objectName: importData.createdAt.toISOString().split(' ')[0].split('-')[0],
            fromStatus: importData.status,
            toStatus: params.status,
            comment: params && params.rejectedReason ? params.rejectedReason : null,
            objectNameId: params.id,
        });
        await verifierRepository.incrementVerifier(verifierId);
    }
    return;
};

exports.listLogs = async (params, id) => {
    let whereQuery = {
        userId: id,
    };
    const limit = params.limit ? (parseInt(params.limit) === -1 ? null : parseInt(params.limit)) : 10;
    const offset = params.page ? (params.page - 1) * (params.limit ? params.limit : 10) : 0;
    const data = await verifierRepository.listAllLogs(whereQuery, limit, offset);
    // const objectTypes = ENUM.objectType;
    // // console.log(data.rows);

    // const dataArr = data.rows.map((obj) => {
    //     // console.log(388, obj.objectType);
    //     let objectType;
    //     if (obj.objectType === '0') {
    //         obj.objectType = 'COMPANY';
    //     }
    //     if (obj.objectType === '1') {
    //         obj.objectType = 'PRODUCT';
    //     }
    //     if (obj.objectType === '2') {
    //         obj.objectType = 'COMPENSATION';
    //     }
    //     if (obj.objectType === '3') {
    //         obj.objectType = 'END_DESTINATION';
    //     }
    //     if (obj.objectType === '4') {
    //         obj.objectType = 'IMPORT';
    //     }
    //     console.log(obj);
    //     if (obj.parent) {
    //         delete obj.parent;
    //     }
    //     if (obj.include) {
    //         delete obj.include;
    //     }

    //     return { ...obj };
    // });

    // const response = {
    //     count: data.count,
    //     rows: dataArr,
    // };
    // console.log(39111111111111111, response);

    return data;
};

exports.listPaymentStatus = async (params) => {
    let whereQuery = {
        planYear: new Date().getFullYear(),
    };

    if (params.companyId) {
        whereQuery = {
            ...whereQuery,
            companyId: params.companyId,
        };
    }
    params.year = whereQuery.planYear;
    const limit = params.limit ? (parseInt(params.limit) === -1 ? null : parseInt(params.limit)) : 10;
    const offset = params.page ? (params.page - 1) * (params.limit ? params.limit : 10) : 0;
    const productionPlanAmount = await verifierRepository.productionPayment(whereQuery, limit, offset);
    const importShipments = await verifierRepository.importPayment(params);
    const compensationAmount = await verifierRepository.compensationAmount(params);
    let data = [];
    if (productionPlanAmount.length && productionPlanAmount[0].length) {
        productionPlanAmount[0].forEach((element) => {
            data.push({
                ...element,
                paymentType: 'production',
                pendingTAE: 0,
                deadline: null,
            });
        });
    }
    if (importShipments.length && importShipments[0].length) {
        importShipments[0].forEach((elem) => {
            data.push({
                ...elem,
                paymentType: 'import',
                pendingTAE: 0,
                deadline: null,
            });
        });
    }
    if (compensationAmount.length && compensationAmount[0].length) {
        compensationAmount[0].forEach((elem) => {
            data.push({
                ...elem,
                paymentType: 'compensation',
                pendingTAE: 0,
                deadline: null,
            });
        });
    }
    return data;
};

exports.listLogByObject = async (params) => {
    const listLogs = await verifierRepository.listLogsByObject(
        {
            objectType: params.objectType,
            objectNameId: params.id,
        },
        {
            limit: params.limit ? (parseInt(params.limit) === -1 ? null : parseInt(params.limit)) : 10,
        },
        {
            offset: params.page ? (params.page - 1) * (params.limit ? params.limit : 10) : 0,
        }
    );
    return listLogs;
};

exports.listAllProductionCompany = async (params) => {
    const listProduction = verifierRepository.listCompanyWithProduction(params);
    const countProduction = verifierRepository.countCompanyWithProduction(params);
    const [listProductions, countProductions] = await Promise.all([listProduction, countProduction]);
    const data = {
        count: countProductions,
        rows: listProductions,
    };
    return data;
};
