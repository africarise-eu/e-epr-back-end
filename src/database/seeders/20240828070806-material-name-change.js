'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkUpdate('TaeFees', { material: 'Paper/Cardboard' }, { material: 'Paper' });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkUpdate('TaeFees', { material: 'Paper' }, { material: 'Paper/Cardboard' });
    },
};
