'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('Countries', 'code', {
     allowNull: true,
     type: Sequelize.STRING
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Countries', 'code');
  }
};
