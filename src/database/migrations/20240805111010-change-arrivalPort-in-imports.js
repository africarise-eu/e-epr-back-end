'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ImportShipments', 'arrivalPort', {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn('ImportShipments', 'arrivalPort', {
      type: Sequelize.INTEGER
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('ImportShipments', 'arrivalPort', {
      type: Sequelize.STRING
    })
    await queryInterface.removeColumn('ImportShipments', 'arrivalPort', {
      type: Sequelize.INTEGER
    })
  }
};
