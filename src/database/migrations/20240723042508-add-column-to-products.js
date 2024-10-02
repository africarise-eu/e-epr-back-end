'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'image', {
      type: Sequelize.STRING,
      allowNull: true, // or false if the column should not allow null values
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'image');
  }
};
