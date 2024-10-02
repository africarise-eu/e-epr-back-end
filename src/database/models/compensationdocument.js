'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompensationDocument extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CompensationDocument.belongsTo(models.CompensationRequest, { foreignKey: 'compensationRequestId' });
    }
  }
  CompensationDocument.init({
    documentUrl: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CompensationDocument',
  });
  return CompensationDocument;
};