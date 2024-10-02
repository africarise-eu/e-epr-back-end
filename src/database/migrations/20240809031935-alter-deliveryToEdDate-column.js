'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the old column
    await queryInterface.removeColumn('CompensationRequests', 'deliveryToEdDate');
    
    // Add the new column with the correct type
    await queryInterface.addColumn('CompensationRequests', 'deliveryToEdDate', {
      type: Sequelize.DATE,
      allowNull: true, // or false, depending on your requirements
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverse the operations done in `up` method
    await queryInterface.removeColumn('CompensationRequests', 'deliveryToEdDate');
    
    // Re-add the old column with STRING type
    await queryInterface.addColumn('CompensationRequests', 'deliveryToEdDate', {
      type: Sequelize.STRING,
      allowNull: true, // or false, depending on your requirements
    });
  },
};
