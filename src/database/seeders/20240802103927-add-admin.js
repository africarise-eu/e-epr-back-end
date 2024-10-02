'use strict';

/** @type {import('sequelize-cli').Migration} */
const { bcrypt } = require('../../utils');
const db = require('../models');

module.exports = {
    async up(queryInterface, Sequelize) {
        const password = await bcrypt.generatePassword('Test@321@');
        const role = await db.Role.findOne({
            attributes: ['id'],
            where: {
                name: 'Admin',
            },
        });
        await queryInterface.bulkInsert('Users', [
            {
                firstName: 'Admin',
                lastName: 'TAE',
                email: 'admin@tae.com',
                password: password,
                roleId: role.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(
            'Users',
            {
                email: 'admin@tae.com',
            },
            {}
        );
    },
};
