'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('FromPorts', 'createdAt', {
    allowNull: false,
    type: Sequelize.DATE,
  });

  await queryInterface.addColumn('FromPorts', 'updatedAt', {
    allowNull: false,
    type: Sequelize.DATE,
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('FromPorts', 'createdAt');
    await queryInterface.removeColumn('FromPorts', 'updatedAt');
  }
};
