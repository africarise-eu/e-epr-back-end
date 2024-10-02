const { HTTP_CODES } = require('../config');
const { logger } = require('../utils');

const formatResponse = (res, statusCode, message = 'Success', data, error = false) => {
    logger.info(message);
    res.status(statusCode).json({
        status: 'success',
        code: statusCode,
        message,
        data,
        error,
    });
};

exports.success = (res, data, message, error) => formatResponse(res, HTTP_CODES.OK, message, data, error);
exports.created = (res, data, message) => formatResponse(res, HTTP_CODES.CREATED, message, data);
exports.notFound = (res, data, message) => formatResponse(res, HTTP_CODES.NOT_FOUND, message, data);
exports.noContent = (res) => res.status(HTTP_CODES.NO_CONTENT).send();
exports.badRequest = (res, data, message) => formatResponse(res, HTTP_CODES.BAD_REQUEST, message, data);
