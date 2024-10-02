'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkUpdate('TaeFees', { taeFeeMtKg: 1.7 }, { material: 'Glass' });
        await queryInterface.bulkUpdate('TaeFees', { taeFeeMtKg: 3.11 }, { material: 'Paper/Cardboard' });
        await queryInterface.bulkUpdate('TaeFees', { taeFeeMtKg: 1.7 }, { material: 'Biodegradable' });
        await queryInterface.bulkUpdate('TaeFees', { taeFeeMtKg: 21.77 }, { material: 'Others' });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkUpdate('TaeFees', { taeFeeMtKg: 0.17 }, { material: 'Glass' });
        await queryInterface.bulkUpdate('TaeFees', { taeFeeMtKg: 0.31 }, { material: 'Paper/Cardboard' });
        await queryInterface.bulkUpdate('TaeFees', { taeFeeMtKg: 11.85 }, { material: 'Biodegradable' });
        await queryInterface.bulkUpdate('TaeFees', { taeFeeMtKg: 33.74 }, { material: 'Others' });
    },
};
