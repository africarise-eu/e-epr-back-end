'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('TaeFees', 'subMaterial', {
      type: Sequelize.STRING,
      allowNull: true,
      onUpdate: 'CASCADE',
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('TaeFees', 'subMaterial');
  }
};
