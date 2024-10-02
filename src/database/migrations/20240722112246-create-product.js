'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      productName: {
        type: Sequelize.STRING
      },
      productCategory: {
        type: Sequelize.STRING
      },
      production: {
        type: Sequelize.STRING
      },
      manufacturerCompany: {
        type: Sequelize.STRING
      },
      countryOfManufacture: {
        type: Sequelize.STRING
      },
      brandName: {
        type: Sequelize.STRING
      },
      productModelTypeVolume: {
        type: Sequelize.STRING
      },
      barcode: {
        type: Sequelize.STRING
      },
      internalArticleCode: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};