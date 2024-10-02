'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkUpdate('TaeFees', { material: 'Cardboard' }, { material: 'Card' });
    },
    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkUpdate('TaeFees', { material: 'Card' }, { material: 'Cardboard' });
    },
};
