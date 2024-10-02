const status = {
    PENDING: 0,
    APPROVED: 1,
    REJECTED: 2,
    DISABLED: 3,
    ENABLED: 4,
};

const payStatus = {
    UNPAID: 0,
    PAID: 1,
};

const objectType = {
    COMPANY: 0,
    PRODUCT: 1,
    COMPENSATION: 2,
    END_DESTINATION: 3,
    IMPORT: 4,
    PRODUCTION: 5,
};

const objectName = {
    COMPANY_PROFILE: 0,
    COMPENSATION_REQUEST: 1,
    END_DESTINATION: 2,
    IMPORT_SHIPMENT: 3,
};

module.exports = {
    status,
    payStatus,
    objectType,
    objectName,
};
