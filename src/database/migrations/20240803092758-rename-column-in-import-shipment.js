'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('ImportShipmentProducts', 'totalUnits', 'units');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('ImportShipmentProducts', 'units', 'totalUnits');
  }
};
