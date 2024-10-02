const i18n = require('i18n');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const userRepository = require('../repository/user');
const companyRepository = require('../repository/company');
const verifierRepository = require('../repository/verifier');
const { BadRequestException, NotFoundException } = require('../helpers/errorResponse');
const { bcrypt, jwt, otp, emailUtil } = require('../utils');

exports.login = async (params) => {
    const { email, password } = params;
    const user = await userRepository.getUserByEmail(email);
    if (!user) throw new BadRequestException(i18n.__('USER.LOGIN.INVALID_CREDS'));
    if (user.status !== 'enabled' || user.isActive === false) throw new BadRequestException(i18n.__('USER.INACTIVE_USER'));
    const passwordMatch = await bcrypt.verifyPassword(password, user.password);
    if (!passwordMatch) throw new BadRequestException(i18n.__('USER.LOGIN.INVALID_CREDS'));
    const accessToken = jwt.generateAccessToken({
        id: user.id,
        email: user.email,
        companyId: user.companyId,
        roleId: user.roleId,
    });
    const updateQuery = {
        accessToken: accessToken,
    };
    const whereQuery = {
        id: user.id,
    };
    await userRepository.updateUser(updateQuery, whereQuery);

    const companyDetails = await userRepository.getCompanyDetails(user.id, user.roleId);
    let isProfileExist = {};
    if (user.Role && user.Role.name === 'Company') {
        isProfileExist = await companyRepository.isCompanyExistUser(user.id);
    }
    if (user.Role && user.Role.name === 'User') {
        isProfileExist.status = 'approved';
    }
    if (user.Role && user.Role.name === 'Verifier') {
        const currentDate = new Date();
        const verifierData = await verifierRepository.getVerifier({ userId: user.id });
        const verifierUpdateData = {
            firstLogin: verifierData && !verifierData.firstLogin ? currentDate : undefined,
            lastLogin: verifierData ? currentDate : undefined,
        };
        if (verifierData) {
            await verifierRepository.updateVerifier(verifierUpdateData, { userId: user.id });
        } else {
            await verifierRepository.createVerifier({
                userId: user.id,
                firstLogin: currentDate,
                lastLogin: currentDate,
            });
        }
    }
    return {
        success: true,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
        accessToken,
        isVerified: user.isVerified,
        profileImage: user.profileImage,
        roleName: user && user.Role ? user.Role.name : null,
        companyId: companyDetails ? companyDetails.id : null,
        companyName: companyDetails ? companyDetails.companyName : null,
        companyStatus: companyDetails ? companyDetails.status : null,
        isProfileExist: isProfileExist ? true : undefined,
        isProfileVerified: isProfileExist && isProfileExist.status === 'approved' ? true : undefined,
    };
};

exports.addUser = async (params) => {
    const isUserExist = await userRepository.checkUserExist(params.email);
    if (isUserExist) throw new BadRequestException(i18n.__('USER.ADMIN.USER_EXIST'));
    //Role as Company
    params.roleId = 3;
    if (params.companyId) {
        const isCompanyExist = await companyRepository.checkCompanyExist(params.companyId);
        if (!isCompanyExist) throw new BadRequestException(i18n.__('COMPANY.COMPANY_NOT_EXIST'));
        //Role as Company User
        params.roleId = 4;
    }
    const password = await bcrypt.generatePassword(params.password);
    params.password = password;
    const data = await userRepository.createUser(params);
    const newData = data.get({
        plain: true,
        attributes: ['id'],
    });
    data.password = undefined;
    data.updatedAt = undefined;
    data.createdAt = undefined;
    data.otp = undefined;
    data.otpExpiration = undefined;
    data.otpToken = undefined;
    if (data && params.companyId) {
        await userRepository.addUserCompanyDetails({
            userId: data.id,
            companyId: params.companyId,
        });
    }
    const roleData = await userRepository.getRolesData(params.roleId);
    data.roleId = roleData.dataValues;
    return data;
};

exports.otpSend = async (email) => {
    const verifyUser = await userRepository.checkUserExist(email);
    const token = crypto.randomBytes(32).toString('hex');

    if (!verifyUser) throw new BadRequestException(i18n.__('USER.USER_NOT_EXIST'));
    const otpGenerator = await otp.generateOtp();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 2);
    await userRepository.addOtp(
        { otp: otpGenerator, otpExpiration: expiryTime, otpToken: token },
        {
            email,
        }
    );
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
            <p>Please find your otp for reset password below:</p>
            <b>${otpGenerator}</b>
            <p>This will be valid for only two minutes.</p>
        </div>

    </div>

</body>
</html>`,
        to: email,
        subject: 'Taxa Ambiental sobre e Embalagens - Reset Password',
    });
    return token;
};

exports.resetPassword = async (params) => {
    params.otpExpiration = new Date();
    const verifyOtp = await userRepository.verifyOtp({
        otpToken: params.token,
        otpExpiration: {
            [Op.gte]: params.otpExpiration,
        },
    });
    if (!verifyOtp) throw new BadRequestException(i18n.__('USER.OTP_EXPIRED'));
    if (verifyOtp.otp != params.otp) throw new BadRequestException(i18n.__('USER.OTP_INVALID'));
    const password = await bcrypt.generatePassword(params.newPassword);
    await userRepository.updatePassword(password, verifyOtp.id);
    return true;
};

exports.changePassword = async (params) => {
    params.otpExpiration = new Date();
    const checkUserExist = await userRepository.getUserById(params.userId);
    if (!checkUserExist) throw new BadRequestException(i18n.__('USER.USER_NOT_EXIST'));
    const verifyCurrentPassword = await bcrypt.verifyPassword(params.currentPassword, checkUserExist.password);
    if (!verifyCurrentPassword) throw new BadRequestException(i18n.__('USER.INVALID_CURRENT_PASSWORD'));
    if (params.otp) {
        const verifyOtp = await userRepository.verifyOtp({
            otp: params.otp,
            otpToken: params.token,
            otpExpiration: {
                [Op.gte]: params.otpExpiration,
            },
        });
        if (!verifyOtp) throw new BadRequestException(i18n.__('USER.INVALID_OTP'));
    }
    const password = await bcrypt.generatePassword(params.newPassword);
    await userRepository.changePassword(password, params.userId);
    return true;
};

exports.otpVerify = async (params) => {
    params.otpExpiration = new Date();
    const isOtpValid = await userRepository.verifyOtp({
        otpToken: params.token,
        otpExpiration: {
            [Op.gte]: params.otpExpiration,
        },
    });
    if (!isOtpValid) throw new BadRequestException(i18n.__('USER.OTP_EXPIRED'));
    if (isOtpValid.otp != params.otp) throw new BadRequestException(i18n.__('USER.OTP_INVALID'));
    return true;
};

exports.logout = async (id) => {
    const updateQuery = {
        accessToken: null,
    };
    const whereQuery = {
        id: id,
    };
    await userRepository.updateUser(updateQuery, whereQuery);
    return true;
};

exports.setPasswordInviteUser = async (params) => {
    const verifyUrl = await userRepository.userUrl(params.url);
    if (!verifyUrl) throw new BadRequestException(i18n.__('USER.INVALID_INVITE_LINK'));
    const password = await bcrypt.generatePassword(params.password);
    const updateQuery = {
        password: password,
        inviteLink: null,
        status: 'enabled',
    };
    await userRepository.addOtp(updateQuery, { id: verifyUrl.id });
    return true;
};

exports.updateProfile = async (params, id) => {
    if (params.email) {
        const isEmailExist = await userRepository.isEmailExist(params.email, id);
        if (isEmailExist) throw new BadRequestException(i18n.__('USER.EMAIL_EXIST'));
    }
    await userRepository.addOtp(params, { id: id });
    return true;
};

exports.verifyEmailOtp = async (email) => {
    const isEmailVerified = await userRepository.findUser({
        email: email,
        isVerified: true,
    });

    if (isEmailVerified) throw new BadRequestException(i18n.__('USER.EMAIL_ALREADY_VERIFIED'));
    const token = crypto.randomBytes(32).toString('hex');

    const otpGenerator = await otp.generateOtp();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 2);
    await userRepository.addOtp(
        { otp: otpGenerator, otpExpiration: expiryTime },
        {
            email,
        }
    );
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
            <p>Please find your otp for verify your email account below:</p>
            <b>${otpGenerator}</b>
            <p>This will be valid for only two minutes.</p>
        </div>

    </div>

</body>
</html>`,
        to: email,
        subject: 'Taxa Ambiental sobre e Embalagens - Verify Email',
    });
    return true;
};

exports.emailVerificationOtp = async (id, otp) => {
    const otpExpiration = new Date();
    const isOtpExpired = await userRepository.findUser({
        id: id,
        otp: otp,
    });
    if (!isOtpExpired) throw new BadRequestException(i18n.__('USER.OTP_INVALID'));
    if (isOtpExpired.otpExpiration <= otpExpiration) throw new BadRequestException(i18n.__('USER.INVALID_OTP'));
    await userRepository.addOtp(
        {
            isVerified: true,
            otp: null,
        },
        {
            id: id,
        }
    );
    return true;
};
