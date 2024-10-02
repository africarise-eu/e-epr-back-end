const { HTTP_CODES } = require('../config');
const { ErrorResponse } = require('./errorResponse');
const { logger } = require('../utils');
const i18n = require('i18n');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;

    logger.error(err);
    if (err.type === 'TypeError') {
        const message = `TypeError ${err.value}`;
        error = new ErrorResponse(message, HTTP_CODES.BAD_REQUEST);
    }

    if (err.name === 'CastError') {
        const message = `Resource not found with ID of ${err.value}`;
        error = new ErrorResponse(message, HTTP_CODES.NOT_FOUND);
    }

    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, HTTP_CODES.BAD_REQUEST);
    }

    if (error.name === 'MulterError') {
        if (error.code === 'LIMIT_FILE_SIZE') {
            error = new ErrorResponse(error.message, HTTP_CODES.TOO_LARGE);
        }
        if (error.code === 'INVALID_FILE_TYPE') {
            error = new ErrorResponse(error.message, HTTP_CODES.BAD_REQUEST);
        }
    }
    const response = {
        status: false,
        code: error.statusCode || 500,
        type: error.type || 'Internal Server Error',
        error: true,
        data: {}, // Include the data field in the initial declaration
    };

    // Set message based on error type and environment
    if (response.code >= 500 && process.env.NODE_ENV === 'production') {
        response.message = i18n.__('USER.ERROR');
    } else {
        response.message = error.message;
        response.data = error.err;
    }

    // Include detailed error data in development
    if (process.env.NODE_ENV === 'development') {
        response.data = {
            stack: error.stack,
            details: error.err || {},
        };
    }
    res.status(response.code).json(response);
};

module.exports = errorHandler;
