const { UnauthorizedException } = require('../helpers/errorResponse');

const jwt = require('jsonwebtoken');

exports.verifyToken = (token) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'SECRET_STRING', (err, decoded) => {
            if (err) throw new UnauthorizedException('Invalid Token');
            resolve(decoded);
        });
    });
};

exports.generateAccessToken = (payload) => {
    return jwt.sign({ ...payload }, 'SECRET_STRING');
};
