const i18n = require('i18n');
const crypto = require('crypto');
const userRepository = require('../repository/user');
const { BadRequestException } = require('../helpers/errorResponse');
const companyRepository = require('../repository/company');
const commonRepository = require('../repository/common');
const { bcrypt, emailUtil } = require('../utils');

exports.addUser = async (params) => {
    const isUserExist = await userRepository.checkUserExist(params.email);
    if (isUserExist) throw new BadRequestException(i18n.__('USER.ADMIN.USER_EXIST'));
    const defaultPassword = params.password;
    const password = await bcrypt.generatePassword(defaultPassword);
    params.password = password;
    const data = await userRepository.createUser(params);
    data.password = undefined;
    return data;
};

exports.addCompanyProfile = async (params) => {
    const isCompanyExist = await companyRepository.isCompanyExist(params.companyName, params.registrationNumber);
    if (isCompanyExist) throw new BadRequestException(i18n.__('COMPANY.COMPANY_NAME_EXIST'));
    const isCompanyExistUser = await companyRepository.isCompanyExistUser(params.userId);
    if (isCompanyExistUser) throw new BadRequestException(i18n.__('COMPANY.COMPANY_EXIST_USER'));
    params.status = 'pending';
    const isCountryExist = await commonRepository.isCountryExist(params.country, params.city);
    if (!isCountryExist) throw new BadRequestException(i18n.__('COMMON.COUNTRY_NOT_EXIST'));
    const companyProfileData = await companyRepository.createCompanyProfile(params);
    return companyProfileData;
};

exports.getProfile = async (id, roleId) => {
    const companyId = await companyRepository.getCompanyId(id);
    const data = await companyRepository.getProfile({ id: companyId.companyId });
    return data;
};

exports.updateProfile = async (params, id) => {
    const isStatusApproved = await companyRepository.getProfile({ userId: id });
    if (!isStatusApproved) throw new BadRequestException(i18n.__('COMPANY.PROFILE.PROFILE_NOT_EXIST'));
    if (isStatusApproved.status === 'approved') throw new BadRequestException(i18n.__('COMPANY.PROFILE.CANNOT_EDIT'));
    const isCountryExist = await commonRepository.isCountryExist(params.country, params.city);
    if (!isCountryExist) throw new BadRequestException(i18n.__('COMMON.COUNTRY_NOT_EXIST'));
    params.status = isStatusApproved.status === 'pending' ? 'pending' : 'improved';
    const whereQuery = {
        userId: id,
    };
    const updateQuery = {
        ...params,
    };
    const updateData = await companyRepository.updateProfile(updateQuery, whereQuery);
    return updateData;
};

exports.inviteUser = async (params, id) => {
    params.email = params.email.toLowerCase();
    const isCompanyProfileApproved = await companyRepository.getProfile({ userId: id });
    if (!isCompanyProfileApproved) throw new BadRequestException(i18n.__('COMPANY.PROFILE.PROFILE_NOT_EXIST'));
    if (isCompanyProfileApproved.status !== 'approved') throw new BadRequestException(i18n.__('COMPANY.PROFILE.PROFILE_NOT_EXIST'));
    const isEmailExist = await userRepository.checkUserExist(params.email);
    if (isEmailExist) throw new BadRequestException(i18n.__('USER.ADMIN.USER_EXIST'));
    const generateInviteToken = crypto.randomBytes(32).toString('hex');
    const inviteLink = `${process.env.FE_URL}/verify/user/${generateInviteToken}`;
    params.inviteLink = inviteLink;
    const currentDate = new Date();
    params.inviteLinkExpiration = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const roleData = await userRepository.getRole({ name: 'User' });
    params.roleId = roleData.id;
    params.status = 'disabled';
    const data = await userRepository.inviteUser(params);
    if (data) {
        await userRepository.addUserCompanyDetails({
            userId: data.id,
            companyId: isCompanyProfileApproved.id,
        });
    }
    emailUtil.sendEmail({
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">

    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
        
        <!-- Email Content -->
        <div style="color: #333333; font-size: 16px; line-height: 1.5;">
            <p>Hello,</p>
            <p>Please find your invite link below:</p>
            <p><a href="${inviteLink}" style="color: #1a73e8; text-decoration: none; font-weight: bold;">Click here</a></p>
            <p>This will be valid for only one day.</p>
        </div>

    </div>

</body>
</html>`,
        to: params.email,
        subject: 'Taxa Ambiental sobre e Embalagens - Welcome on board',
    });
    return data;
};

exports.listUsers = async (params, id) => {
    const companyData = await companyRepository.getProfile({ userId: id });
    if (!companyData) throw new BadRequestException(i18n.__('COMPANY.PROFILE.PROFILE_NOT_EXIST'));
    const data = await companyRepository.listUsers(companyData.id, params);
    return data;
};

exports.userStatusChange = async (params, id) => {
    const companyData = await companyRepository.getProfile({ userId: id });
    if (!companyData || companyData.status !== 'approved') throw new BadRequestException(i18n.__('COMPANY.PROFILE.PROFILE_NOT_EXIST'));
    const isUserCompanyExist = await companyRepository.checkUserCompany(companyData.id, params.userId);
    if (!isUserCompanyExist) throw new BadRequestException(i18n.__('COMPANY.USERS.USER_NOT_EXIST'));
    const updateQuery = {
        status: params.status,
        accessToken: null,
    };
    const whereQuery = {
        id: params.userId,
    };
    await userRepository.addOtp(updateQuery, whereQuery);
    return;
};

exports.listCompany = async (params) => {
    const data = await companyRepository.listAllCompany(params);
    return data;
};
