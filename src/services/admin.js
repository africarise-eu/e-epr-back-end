const i18n = require('i18n');
const crypto = require('crypto');
const userRepository = require('../repository/user');
const { BadRequestException } = require('../helpers/errorResponse');
const { emailUtil } = require('../utils');

exports.inviteUsers = async (params) => {
    params.email = params.email.toLowerCase();
    const isEmailExist = await userRepository.checkUserExist(params.email);
    if (isEmailExist) throw new BadRequestException(i18n.__('USER.ADMIN.USER_EXIST'));
    const generateInviteToken = crypto.randomBytes(32).toString('hex');
    const inviteLink = `${process.env.FE_URL}/verify/user/${generateInviteToken}`;
    params.inviteLink = inviteLink;
    const currentDate = new Date();
    params.inviteLinkExpiration = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const roleData = await userRepository.getRolesData(params.roleId);
    emailUtil.sendEmail({
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invitation to Join eEPR Demo System</title>
</head>
<body>
    <p>Dear ${params.firstName}</p>
    <p>Admin eEPR of the new <strong>Extended Producer Responsibility </strong> demo system has invited you to join as a <strong>${roleData.name}</strong> of the system.</p>
    <p>Click this link to Register:</p>
    <p><a href="${inviteLink}">Register Here</a></p>
    <p>You can then set your password.</p>
    <p>Please join and try it out, we would like to hear your feedback.</p>
    <p>Yours Sincerely</p>
    <p>eEPR Demo System Administrator</p>
</body>
</html>
`,
        to: params.email,
        subject: 'Taxa Ambiental sobre e Embalagens - Welcome on board',
    });
    const data = await userRepository.inviteUser(params);
    if (params.roleId == 2 && data) {
        await userRepository.createVerifier(data.id);
    }
    return data;
};

exports.getAllUsers = async ({ search, status, limit, page }) => {
    try {
        const response = await userRepository.getAllUsersWithCompanyName({ search, status, limit, page });
        return response;
    } catch (error) {
        throw error;
    }
};

exports.toggleUserStatus = async (userId, status) => {
    try {
        const response = await userRepository.toggleUserStatus(userId, status);
        return response;
    } catch (error) {
        throw error;
    }
};

exports.getTaePayments = async (year, search, paymentType, limit, page) => {
    try {
        const response = await userRepository.getTaePayments(year, search, paymentType, limit, page);
        return response;
    } catch (error) {
        throw error;
    }
};
