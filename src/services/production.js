const i18n = require('i18n');

const companyRepository = require('../repository/company');
const { BadRequestException } = require('../helpers/errorResponse');
const { sequelize } = require('../database/models');
const productionRepository = require('../repository/production');
const productRepository = require('../repository/product');

exports.addProductionPlan = async (params) => {
    const isCompanyExist = await companyRepository.getCompanyId(params.userId);
    if (!isCompanyExist) throw new BadRequestException(i18n.__('COMPANY.PROFILE.PROFILE_NOT_EXIST'));
    params.planYear = new Date().getFullYear();
    const isProductionPlanExist = await productionRepository.getProductionCount(isCompanyExist.companyId, params.planYear);
    if (isProductionPlanExist) throw new BadRequestException(i18n.__('PRODUCTION.PRODUCTION_EXIST'));
    params.previousYear = params.planYear - 1;
    params.status = 'pending';
    params.companyId = isCompanyExist.companyId;
    let transaction;
    let materialArray = [];
    try {
        transaction = await sequelize.transaction();
        const productionData = await productionRepository.addProduction(params, transaction);
        if (params.product && params.product.length) {
            let productionProductArr = [];
            for (const product of params.product) {
                const totalProductAmount = await productRepository.totalProductAmount(product.productId);
                productionProductObj = {
                    productId: product.productId,
                    plan: product.plan,
                    planVerification: params.isDraft == true ? 'draft' : 'pending',
                    planRejectReason: null,
                    actual: product.actual,
                    actualStatus: params.isDraft == true ? 'draft' : 'pending',
                    productionId: productionData.id,
                    planAmount: parseInt(product.plan) * totalProductAmount[0].totalAmount,
                    actualAmount: parseInt(product.actual) * totalProductAmount[0].totalAmount,
                };
                productionProductArr.push(productionProductObj);
                const productMaterial = await productionRepository.productMaterial(product.productId);
                if (!materialArray.length) {
                    materialArray = productMaterial.map((item) => ({
                        materialId: item.materialId,
                        plan: product.plan * item.weight,
                        taeStatus: 'pending',
                        actual: product.actual * item.weight,
                        taePayStatus: 'paid',
                        productionId: productionData.id,
                    }));
                } else {
                    productMaterial.forEach((element) => {
                        const found = materialArray.find((elem) => elem.materialId === element.materialId);
                        if (found) {
                            found.plan += product.plan * element.weight;
                            found.actual += product.actual * element.weight;
                        } else {
                            materialArray.push({
                                materialId: element.materialId,
                                plan: product.plan * element.weight,
                                taeStatus: 'pending',
                                actual: product.actual * element.weight,
                                taePayStatus: 'paid',
                                productionId: productionData.id,
                            });
                        }
                    });
                }
            }
            await productionRepository.createProductionProduct(productionProductArr, transaction);
            await productionRepository.createProductionMaterial(materialArray, transaction);
        }
        await transaction.commit();
        return productionData;
    } catch (error) {
        await transaction.rollback();
        throw new BadRequestException(error.message);
    }
};

exports.updateProductionPlan = async (params, id) => {
    const isCompanyExist = await companyRepository.getCompanyId(params.user.id);
    if (!isCompanyExist) throw new BadRequestException(i18n.__('COMPANY.PROFILE.PROFILE_NOT_EXIST'));
    const planYear = new Date().getFullYear();
    const isStatusApproved = await productionRepository.getProductionStatus(isCompanyExist.companyId, 'approved', planYear);

    if (isStatusApproved) throw new BadRequestException(i18n.__('PRODUCTION.PRODUCTION_APPROVED'));
    const whereQuery = {
        id: id,
        companyId: isCompanyExist.companyId,
    };
    let materialArray = [];

    await productionRepository.updateProductionPlan(whereQuery, params);
    if (params.product && params.product.length) {
        let productionProductArr = [];
        for (const product of params.product) {
            const status = await productionRepository.getProductStatus(product.productId);

            const planVerification = status ? status.planVerification : null;
            const actualProductStatus = status ? status.actualStatus : null;

            const totalProductAmount = await productRepository.totalProductAmount(product.productId);
            const planVerificationStatus = params.isDraft
                ? 'draft'
                : planVerification === 'rejected'
                  ? 'improved'
                  : planVerification === 'approved'
                    ? 'approved'
                    : planVerification === 'improved'
                      ? 'improved'
                      : 'pending';
            const actualStatus = params.isDraft
                ? 'draft'
                : actualProductStatus === 'rejected'
                  ? 'improved'
                  : actualProductStatus === 'approved'
                    ? 'approved'
                    : actualProductStatus === 'improved'
                      ? 'improved'
                      : 'pending';

            productionProductObj = {
                productId: product.productId,
                plan: product.plan,
                planVerification: planVerificationStatus,
                planRejectReason: null,
                actual: product.actual,
                actualStatus: actualStatus,
                productionId: id,
                planAmount: parseInt(product.plan) * totalProductAmount[0].totalAmount,
                actualAmount: parseInt(product.actual) * totalProductAmount[0].totalAmount,
            };
            productionProductArr.push(productionProductObj);
            const productMaterial = await productionRepository.productMaterial(product.productId);
            if (!materialArray.length) {
                materialArray = productMaterial.map((item) => ({
                    materialId: item.materialId,
                    plan: product.plan * item.weight,
                    taeStatus: 'pending',
                    actual: product.actual * item.weight,
                    taePayStatus: 'paid',
                    productionId: id,
                }));
            } else {
                productMaterial.forEach((element) => {
                    const found = materialArray.find((elem) => elem.materialId === element.materialId);
                    if (found) {
                        found.plan += product.plan * element.weight;
                        found.actual += product.actual * element.weight;
                    } else {
                        materialArray.push({
                            materialId: element.materialId,
                            plan: product.plan * element.weight,
                            taeStatus: 'pending',
                            actual: product.actual * element.weight,
                            taePayStatus: 'paid',
                            productionId: id,
                        });
                    }
                });
            }
        }

        await productionRepository.removeProductionProduct(id);
        await productionRepository.removeProductionMaterial(id);

        await productionRepository.createProductionProduct(productionProductArr);
        await productionRepository.createProductionMaterial(materialArray);
    }
    return true;
};

exports.getAProductionPlan = async (productionId, userId) => {
    const companyData = await companyRepository.getCompanyId(userId);
    if (!companyData) throw new BadRequestException(i18n.__('COMPANY.PROFILE.PROFILE_NOT_EXIST'));
    const productionData = await productionRepository.viewProduction(productionId, companyData.companyId);
    if (!productionData) return null;
    const previousYearPlan = await productionRepository.viewPreviousYearPlan({
        planYear: productionData.planYear - 1,
        companyId: companyData.companyId,
    });
    productionData.productionProduct.forEach((elem) => {
        let found;
        if (previousYearPlan && previousYearPlan.productionProduct.length) {
            found = previousYearPlan.productionProduct.find((element) => element.productId === elem.productId);
        }
        elem.dataValues.previousYearPlan = found && found.plan ? found.plan : 0;
    });
    return productionData;
};

exports.getAllProductionPlan = async (params) => {
    const companyData = await companyRepository.getCompanyId(params.userId);
    if (!companyData) throw new BadRequestException(i18n.__('COMPANY.PROFILE.PROFILE_NOT_EXIST'));
    params.companyId = companyData.companyId;
    const listProduction = await productionRepository.listProduction(params);
    return listProduction;
};

exports.deleteProductionPlan = async (id, userId) => {
    const companyData = await companyRepository.getCompanyId(userId);
    if (!companyData) throw new BadRequestException(i18n.__('COMPANY.PROFILE.PROFILE_NOT_EXIST'));
    const deleteData = await productionRepository.deleteProduction(id, companyData.companyId);
    return deleteData;
};

exports.getProduction = async (year, id) => {
    const companyDetails = await companyRepository.getCompanyId(id);

    const productionData = await productionRepository.viewAProduction({ planYear: year, companyId: companyDetails.companyId });
    if (!productionData) return null;
    const previousYearPlan = await productionRepository.viewPreviousYearPlan({ planYear: year - 1, companyId: companyDetails.companyId });
    productionData.productionProduct.forEach((elem) => {
        let found;
        if (previousYearPlan && previousYearPlan.productionProduct.length) {
            found = previousYearPlan.productionProduct.find((element) => element.productId === elem.productId);
        }
        elem.dataValues.previousYearPlan = found && found.plan ? found.plan : 0;
    });
    return productionData;
};
