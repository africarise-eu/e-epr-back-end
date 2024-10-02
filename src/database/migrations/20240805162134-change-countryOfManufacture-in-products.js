'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'countryOfManufacture', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Products', 'countryOfManufacture', {
      type: Sequelize.INTEGER
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'countryOfManufacture', {
      type: Sequelize.STRING
    })
   await queryInterface.removeColumn('Products', 'countryOfManufacture', {
     type: Sequelize.INTEGER
   })
  }
};
