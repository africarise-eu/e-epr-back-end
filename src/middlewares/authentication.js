const { jwtAuth } = require('../utils');
const { UnauthorizedException } = require('../helpers/errorResponse');
const { MESSAGES } = require('../config');
const userRepository = require('../repository/user');

module.exports =
    (allowedRoles = []) =>
    async (req, res, next) => {
        try {
            const authenticationMechanism = process.env.AUTHENTICATION || 'jwt';
            switch (authenticationMechanism) {
                case 'jwt':
                    if (!req.headers.authorization) throw new UnauthorizedException(MESSAGES.AUTH.UNAUTHORIZED);
                    const token = req.headers.authorization.split(' ')[1];
                    const isTokenValid = await userRepository.checkAccessToken(token);
                    if (!isTokenValid) throw new UnauthorizedException(MESSAGES.AUTH.UNAUTHORIZED);
                    const data = await jwtAuth(token, allowedRoles);
                    if (isTokenValid.id !== data.id) throw new UnauthorizedException(MESSAGES.AUTH.UNAUTHORIZED);
                    req.user = data;
                    break;
                default:
                    throw new UnauthorizedException(MESSAGES.AUTH.TOKEN_HEADER_NOT_FOUND);
                    break;
            }
            next();
        } catch (error) {
            next(error);
        }
    };
