'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ImportShipmentProducts', {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
      },
      companyId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
              model: 'Companies',
              key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
      },
      userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
              model: 'Users',
              key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      cdNo: {
          type: Sequelize.INTEGER,
          allowNull: false,
      },
      taeTotalValue: {
          type: Sequelize.DATE,
      },
      totalUnits: {
          type: Sequelize.STRING,
      },
      createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
      },
      updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
      },
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ImportShipmentProducts');
  }
};
