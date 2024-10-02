const request = require('supertest');
const app = require('../../app');
const db = require('../database/models');

describe('login', () => {
    beforeEach(async () => {
        const url = '/api/v1/company/register';
        await request(app).post(url).send({
            firstName: 'Ansal',
            lastName: 'S',
            email: 'wolverine@marvel.com',
            password: 'Test@321@',
        });
    });
    const url = '/api/v1/user/login';

    it('Should succeed password login for correct credentials', async () => {
        const response = await request(app).post(url).send({
            email: 'wolverine@marvel.com',
            password: 'Test@321@',
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data.accessToken');
    });

    it('Should fail password login for incorrect password', async () => {
        const response = await request(app).post(url).send({
            email: 'wolverine@marvel.com',
            password: 'Test@321',
        });
        expect(response.status).toBe(400);
    });

    it('Should fail password login for email that does not exist in the database', async () => {
        const response = await request(app).post(url).send({
            email: 'inactive_user@example.com',
            password: 'Test@321*',
        });
        expect(response.status).toBe(400);
    });

    it('Should fail login for a password longer than 32 characters', async () => {
        const response = await request(app).post(url).send({
            email: 'wolverine@marvel.com',
            password: 'this_is_a_very_long_password_that_exceeds_32_characters',
        });
        expect(response.status).toBe(412);
    });

    it('Should fail login for a password shorter than 8 characters', async () => {
        const response = await request(app).post(url).send({
            email: 'wolverine@marvel.com',
            password: 'short',
        });
        expect(response.status).toBe(412);
    });

    it('Should fail password login for invalid email and long password', async () => {
        const response = await request(app).post(url).send({
            email: 'invalid_email',
            password: 'this_is_a_very_long_password_that_exceeds_32_characters',
        });
        expect(response.status).toBe(412);
    });

    it('Should fail password login for request without payload', async () => {
        const response = await request(app).post(url).send();
        expect(response.status).toBe(412);
    });
});

describe('registration', () => {
    const url = '/api/v1/company/register';

    it('User submits registration without selecting a company from the drop-down', async () => {
        const response = await request(app).post(url).send({
            firstName: 'peter',
            lastName: 'parker',
            email: 'peter@marvel.com',
            password: 'Test@321*',
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('data.id');
    });

    // it('User selects a company from the drop-down and submits registration', async () => {
    //     const response = await request(app).post(url).send({
    //         firstName: 'peter',
    //         lastName: 'parker',
    //         email: 'peter.c@bridge-global.com',
    //         password: 'Test@321*',
    //         companyId: 840,
    //     });
    //     expect(response.status).toBe(201);
    //     expect(response.body).toHaveProperty('data.id');
    // });

    it('Should fail user registration without payload', async () => {
        const response = await request(app).post(url).send();
        expect(response.status).toBe(412);
    });

    it('Should fail user registration with an email that already exists in the database', async () => {
        const response = await request(app).post(url).send({
            firstName: 'peter',
            lastName: 'parker',
            email: 'wolverine@marvel.com',
            password: 'Test@321*',
        });
        expect(response.status).toBe(400);
    });

    it('User adds an invalid company in the payload', async () => {
        const response = await request(app).post(url).send({
            firstName: 'peter',
            lastName: 'parker',
            email: 'wolverine@marvel.com',
            password: 'Test@321*',
            companyId: 1,
        });
        expect(response.status).toBe(400);
    });

    //Validations
    it('Should fail user registration with invalid email format', async () => {
        const response = await request(app).post(url).send({
            firstName: 'peter',
            lastName: 'parker',
            email: 'invalid_email',
            password: 'Test@321*',
        });
        expect(response.status).toBe(412);
    });

    it('Should fail user registration with a password shorter than 8 characters', async () => {
        const response = await request(app).post(url).send({
            firstName: 'peter',
            lastName: 'parker',
            email: 'wolverine@marvel.com',
            password: 'short',
        });
        expect(response.status).toBe(412);
    });

    it('Should fail user registration with a password longer than 32 characters', async () => {
        const response = await request(app).post(url).send({
            firstName: 'peter',
            lastName: 'parker',
            email: 'wolverine@marvel.com',
            password: 'this_is_a_very_long_password_that_exceeds_32_characters',
        });
        expect(response.status).toBe(412);
    });

    it('Should fail registration without providing the firstname field in the payload', async () => {
        const response = await request(app).post(url).send({
            lastName: 'parker',
            email: 'wolverine@marvel.com',
            password: 'Test@321*',
        });
        expect(response.status).toBe(412);
    });

    it('Should fail registration without providing the lastname field in the payload', async () => {
        const response = await request(app).post(url).send({
            firstName: 'peter',
            email: 'wolverine@marvel.com',
            password: 'Test@321*',
        });
        expect(response.status).toBe(412);
    });
    it('Should fail registration without providing the email field in the payload', async () => {
        const response = await request(app).post(url).send({
            firstName: 'peter',
            lastName: 'parker',
            password: 'Test@321*',
        });
        expect(response.status).toBe(412);
    });
    it('Should fail registration without providing the password field in the payload', async () => {
        const response = await request(app).post(url).send({
            firstName: 'peter',
            lastName: 'parker',
            email: 'wolverine@marvel.com',
        });
        expect(response.status).toBe(412);
    });
    it('Should fail the registration when an invalid schema is provided in the payload', async () => {
        const response = await request(app).post(url).send({
            invalid_field: 'value',
        });
        expect(response.status).toBe(412);
    });
});

describe('Send otp for forgot password', () => {
    beforeAll(async () => {
        const url = '/api/v1/company/register';
        await request(app).post(url).send({
            firstName: 'Ansal',
            lastName: 'S',
            email: 'wolverine@marvel.com',
            password: 'Test@321@',
        });
    });
    const url = '/api/v1/user/send-otp';
    it('should return 200 for valid user', async () => {
        const response = await request(app).post(url).send({
            email: 'wolverine@marvel.com',
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
    it('should return 400 for invalid user', async () => {
        const response = await request(app).post(url).send({
            email: 'wolveri@marvel.com',
        });
        expect(response.status).toBe(400);
    });
    it('should return 412 for validation error', async () => {
        const response = await request(app).post(url).send({
            email: '',
        });
        expect(response.status).toBe(412);
    });
});

describe('Reset password for forgot password', () => {
    let token;
    let otp;
    const url = '/api/v1/user/reset-password';
    beforeAll(async () => {
        const url = '/api/v1/company/register';
        await request(app).post(url).send({
            firstName: 'Ansal',
            lastName: 'S',
            email: 'wolverine+2@marvel.com',
            password: 'Test@321@',
        });
        let sendOtp = await request(app).post('/api/v1/user/send-otp').send({
            email: 'wolverine+2@marvel.com',
        });
        sendOtp = JSON.parse(sendOtp.text);
        token = sendOtp.data;
        otp = await db.User.findOne({
            attribute: ['otp'],
            where: {
                email: 'wolverine+2@marvel.com',
            },
        });
    });
    it('should return 200 for correct user with correct token and otp', async () => {
        const response = await request(app).post(url).send({
            otp: otp.otp,
            token: token,
            newPassword: 'Test@123@',
        });
        expect(response.status).toBe(200);
    });
    it('should return 400 for incorrect token', async () => {
        const response = await request(app).post(url).send({
            otp: otp.otp,
            token: '5071e293b14c71e8fdad992b89178a2edc724c9fbc68187daef79cd1aadd',
            newPassword: 'Test@123@',
        });
        expect(response.status).toBe(400);
    });
    it('should return 400 for incorrect otp', async () => {
        const response = await request(app).post(url).send({
            otp: '100000',
            token: token,
            newPassword: 'Test@123@',
        });
        expect(response.status).toBe(400);
    });
    it('should return 412 for invalid otp', async () => {
        const response = await request(app).post(url).send({
            otp: 'ewq34',
            token: token,
            newPassword: 'Test@123@',
        });
        expect(response.status).toBe(412);
    });
    it('should return 412 for invalid empty otp', async () => {
        const response = await request(app).post(url).send({
            otp: '',
            token: token,
            newPassword: 'Test@123@',
        });
        expect(response.status).toBe(412);
    });
    it('should return 412 for invalid password', async () => {
        const response = await request(app).post(url).send({
            otp: '',
            token: token,
            newPassword: 'Test',
        });
        expect(response.status).toBe(412);
    });
});

describe('Otp send for change password', () => {
    let token;
    const url = '/api/v1/user/change-password-otp';
    beforeEach(async () => {
        const url = '/api/v1/company/register';
        await request(app).post(url).send({
            firstName: 'Ansal',
            lastName: 'S',
            email: 'wolverine+3@marvel.com',
            password: 'Test@321@',
        });
        let tokenData = await request(app).post('/api/v1/user/login').send({
            email: 'wolverine+3@marvel.com',
            password: 'Test@321@',
        });
        tokenData = JSON.parse(tokenData.text);
        token = tokenData.data.accessToken;
    });
    it('should return 200 with token for correct auth token', async () => {
        const response = await request(app).post(url).send().set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
    it('should return 401 for invalid jwt token', async () => {
        const response = await request(app).post(url).send().set('Authorization', 'Bearer adacdsfadfadfADSFADFASE3');
        expect(response.status).toBe(401);
    });
    it('should return 401 if jwt token is not exist', async () => {
        const response = await request(app).post(url).send();
        expect(response.status).toBe(401);
    });
});

describe('Change password using otp', () => {
    let token;
    let otpToken;
    let otp;
    const url = '/api/v1/user/change-password';
    beforeAll(async () => {
        const url = '/api/v1/company/register';
        await request(app).post(url).send({
            firstName: 'Ansal',
            lastName: 'S',
            email: 'wolverine+4@marvel.com',
            password: 'Test@321@',
        });
        let tokenData = await request(app).post('/api/v1/user/login').send({
            email: 'wolverine+4@marvel.com',
            password: 'Test@321@',
        });
        tokenData = JSON.parse(tokenData.text);
        token = tokenData.data.accessToken;
        let sendOtp = await request(app).post('/api/v1/user/change-password-otp').send().set('Authorization', `Bearer ${token}`);
        sendOtp = JSON.parse(sendOtp.text);
        otpToken = sendOtp.data;
        otp = await db.User.findOne({
            attribute: ['otp'],
            where: {
                email: 'wolverine+4@marvel.com',
            },
        });
    });
    it('should return 200 for successfully changing password', async () => {
        const response = await request(app)
            .post(url)
            .send({
                currentPassword: 'Test@321@',
                newPassword: 'test@321@',
                otp: otp.otp,
                token: otpToken,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it('should return 400 for invalid otp', async () => {
        const response = await request(app)
            .post(url)
            .send({
                currentPassword: 'Test@321@',
                newPassword: 'test@321@',
                otp: 123456,
                token: otpToken,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
    });
    it('should return 400 for invalid token', async () => {
        const response = await request(app)
            .post(url)
            .send({
                currentPassword: 'Test@321@',
                newPassword: 'test@321@',
                otp: 111111,
                token: 'ae434efasdf8xaca',
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
    });
    it('should return 400 for invalid old password', async () => {
        const response = await request(app)
            .post(url)
            .send({
                currentPassword: 'adfasest@321@',
                newPassword: 'test@321@',
                otp: 111111,
                token: otpToken,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
    });
    it('should return 401 for invalid jwt token', async () => {
        const response = await request(app)
            .post(url)
            .send({
                currentPassword: 'adfasest@321@',
                newPassword: 'test@321@',
                otp: 111111,
                token: otpToken,
            })
            .set('Authorization', `Bearer asdfatr4rwfsandvadncv`);
        expect(response.status).toBe(401);
    });
});
