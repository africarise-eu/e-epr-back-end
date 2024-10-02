const { MESSAGES } = require('../config');
const { UnauthorizedException } = require('../helpers/errorResponse');
const jwt = require('./jwt');

module.exports = async (token, allowedRoles = []) => {
    if (!token) throw new UnauthorizedException(MESSAGES.AUTH.TOKEN_NOT_FOUND);

    const decoded = await jwt.verifyToken(token);
    if (allowedRoles.length === 0 || allowedRoles.includes(decoded.roleId)) {
        return decoded;
    } else {
        throw new UnauthorizedException(MESSAGES.AUTH.UNAUTHORIZED);
    }
};
