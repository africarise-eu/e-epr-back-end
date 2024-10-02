'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('FromPorts', {
       id: {
           allowNull: false,
           autoIncrement: true,
           primaryKey: true,
           type: Sequelize.INTEGER,
       },
       portname: {
           type: Sequelize.STRING,
       },
       province: {
           type: Sequelize.STRING,
       },
       townname: {
           type: Sequelize.STRING,
       },
       lat: {
           type: Sequelize.STRING,
       },
       lng: {
           type: Sequelize.STRING,
       },
       code: {
           type: Sequelize.STRING,
       }
   });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('FromPorts');
  }
};
