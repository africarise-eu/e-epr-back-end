'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('ImportShipments', 'countryId', {
     type: Sequelize.INTEGER,
     references: {
      model: 'Countries',
      key: 'id',
  },
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ImportShipments', 'countryId');
  }
};
