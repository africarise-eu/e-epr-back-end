'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const roles = [
            {
                name: 'Admin',
            },
            {
                name: 'Verifier',
            },
            {
                name: 'Company',
            },
            {
                name: 'User',
            },
        ];
        await queryInterface.bulkInsert('Roles', roles, {});
    },

    async down(queryInterface) {
        return queryInterface.bulkDelete('Roles', {}, {});
    },
};
