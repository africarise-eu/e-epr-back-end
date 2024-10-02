'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class CompensationRequest extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CompensationRequest.belongsTo(models.TaeFee, { foreignKey: 'materialId' });
            CompensationRequest.belongsTo(models.User, { foreignKey: 'userId' });
            CompensationRequest.belongsTo(models.EndDestination, { foreignKey: 'edOrganisationId' });
            CompensationRequest.belongsTo(models.Company, { foreignKey: 'companyId' });
            CompensationRequest.hasMany(models.CompensationDocument, { foreignKey: 'compensationRequestId' });
        }
    }

    CompensationRequest.init(
        {
            deliveryToEdDate: DataTypes.DATE,
            materialId: DataTypes.INTEGER,
            deliveredKgs: DataTypes.FLOAT,
            edOrganisationId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            companyId: DataTypes.INTEGER,
            status: DataTypes.STRING,
            rejectedReason: DataTypes.TEXT,
            createdAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'CompensationRequest',
        }
    );

    return CompensationRequest;
};
