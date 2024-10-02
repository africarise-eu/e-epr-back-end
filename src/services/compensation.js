const i18n = require('i18n');
const db = require('../database/models');
const { BadRequestException } = require('../helpers/errorResponse');
const s3 = require('../utils/s3');
const compensationRepository = require('../repository/compensation');
const companyRepository = require('../repository/company');

exports.addCompensation = async (params, userId) => {
    const { deliveryToEdDate, materialId, deliveredKgs, edOrganisationId, documents } = params;

    const transaction = await db.sequelize.transaction();
    try {
        const companyDetails = await companyRepository.getCompanyId(userId);

        const compensationRequest = await compensationRepository.createCompensation(
            {
                deliveryToEdDate,
                materialId,
                deliveredKgs,
                edOrganisationId,
                userId,
                companyId: companyDetails.companyId,
                status: 'pending',
            },
            { transaction }
        );

        if (documents && documents.length > 0) {
            const documentPromises = documents.map((doc) =>
                compensationRepository.createCompensationDocument(
                    {
                        compensationRequestId: compensationRequest.id,
                        documentUrl: doc.documentUrl,
                        description: doc.description,
                    },
                    { transaction }
                )
            );

            await Promise.all(documentPromises);
        }

        await transaction.commit();
        return compensationRequest;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.addEndDestination = async (params, userId) => {
    const { companyId, orgType, orgName, companyRegNo, phone, email, contactPerson, address, city, country } = params;

    const transaction = await db.sequelize.transaction();
    try {
        const endDestination = await compensationRepository.createEndDestination(
            {
                companyId,
                userId,
                orgType,
                orgName,
                companyRegNo,
                phone,
                email,
                contactPerson,
                address,
                cityId: city,
                countryId: country,
                status: 'pending',
            },
            { transaction }
        );

        await transaction.commit();
        return endDestination;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.getCompensationById = async (id) => {
    try {
        const compensation = await compensationRepository.findCompensationById(id);
        if (!compensation) {
            throw new BadRequestException(i18n.__('COMPENSATION.COMPENSATION_NOT_EXIST'));
        }
        return compensation;
    } catch (error) {
        throw error;
    }
};

exports.getEndDestinationsByCompany = async (userId, { page, limit, search }) => {
    try {
        const response = await compensationRepository.findAllEndDestinationsByCompany(userId, {
            page,
            limit,
            search,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

exports.getEndDestinations = async () => {
    try {
        const response = await compensationRepository.findAllEndDestinations();
        return response;
    } catch (error) {
        throw error;
    }
};

exports.updateCompensation = async (id, params, userId) => {
    const transaction = await db.sequelize.transaction();

    try {
        const updatedCompensation = await compensationRepository.updateCompensation(id, params, userId, transaction);
        await transaction.commit();
        return updatedCompensation;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.deleteCompensation = async (id) => {
    const transaction = await db.sequelize.transaction();

    try {
        await compensationRepository.deleteCompensation(id, transaction);
        await transaction.commit();
        return { message: 'Compensation deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.getAllCompensations = async (params, userId, companyId) => {
    try {
        const { count, rows } = await compensationRepository.findAllCompensations(params, userId, companyId);

        if (!Array.isArray(rows)) {
            throw new BadRequestException(i18n.__('COMPENSATION.ERROR'));
        }

        const compensationsWithSignedUrls = await Promise.all(
            rows.map(async (compensation) => {
                let compensationData = { ...compensation.dataValues };

                if (compensation.TaeFee) {
                    compensationData.material = {
                        id: compensation.TaeFee.id,
                        materialName: compensation.TaeFee.material,
                    };
                }

                if (compensation.EndDestination) {
                    compensationData.edOrganisation = {
                        id: compensation.EndDestination.id,
                        orgName: compensation.EndDestination.orgName,
                        orgType: compensation.EndDestination.orgType,
                        status: compensation.EndDestination.status,
                    };
                }

                if (compensation.CompensationDocuments) {
                    compensationData.compensationDocuments = await Promise.all(
                        compensation.CompensationDocuments.map(async (doc) => {
                            let documentData = { ...doc.dataValues };
                            try {
                                const signedUrl = await s3.signedUrl(doc.documentUrl);
                                (documentData.documentName = doc.documentUrl), (documentData.documentUrl = signedUrl);
                            } catch (error) {
                                console.error('Error fetching signed URL for document:', doc.documentUrl, error);
                                documentData.documentUrl = doc.documentUrl;
                            }
                            return documentData;
                        })
                    );
                }

                delete compensationData.CompensationDocuments;
                delete compensationData.TaeFee;
                delete compensationData.EndDestination;
                delete compensationData.orgName;

                return compensationData;
            })
        );

        return {
            count,
            rows: compensationsWithSignedUrls,
        };
    } catch (error) {
        console.error('Error fetching compensations:', error);
        throw error;
    }
};

exports.getTotalWeight = async (params, userId) => {
    try {
        const response = await compensationRepository.getTotalWeightByMaterial(params, userId);
        return response;
    } catch (error) {
        throw error;
    }
};

exports.updateEndDestination = async (id, params) => {
    const { companyId, orgType, orgName, companyRegNo, phone, email, contactPerson, address, city, country, status } = params;

    const updatedStatus = status === 'rejected' ? 'improved' : 'pending';

    const transaction = await db.sequelize.transaction();
    try {
        const [updated] = await db.EndDestination.update(
            {
                companyId,
                orgType,
                orgName,
                companyRegNo,
                phone,
                email,
                contactPerson,
                address,
                cityId: city,
                countryId: country,
                status: updatedStatus,
            },
            {
                where: { id },
                returning: true,
                transaction,
            }
        );

        if (!updated) {
            throw new BadRequestException(i18n.__('ENDDESTINATION.UPDATE_FAILURE'));
        }

        await transaction.commit();
        return updated;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.deleteEndDestination = async (id) => {
    const transaction = await db.sequelize.transaction();
    try {
        const deleted = await db.EndDestination.destroy({
            where: { id },
            transaction,
        });

        if (!deleted) {
            throw new BadRequestException(i18n.__('ENDDESTINATION.NOT_FOUND'));
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.getEndDestinationById = async (id) => {
    try {
        const endDestination = await db.EndDestination.findByPk(id, {
            include: [
                {
                    model: db.Country,
                    attributes: ['id', 'name'],
                },
                {
                    model: db.City,
                    attributes: ['id', 'name'],
                },
            ],
            attributes: {
                include: [
                    [db.sequelize.col('Country.name'), 'countryName'],
                    [db.sequelize.col('City.name'), 'cityName'],
                ],
            },
        });

        if (!endDestination) {
            throw new BadRequestException(i18n.__('ENDDESTINATION.NOT_FOUND'));
        }

        return endDestination;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
