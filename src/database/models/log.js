'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Log extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Log.belongsTo(models.Company, {
                foreignKey: 'companyId',
                as: 'company',
            });
            Log.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
            });
        }
    }
    Log.init(
        {
            companyId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            objectType: DataTypes.STRING,
            objectName: DataTypes.STRING,
            fromStatus: DataTypes.STRING,
            toStatus: DataTypes.STRING,
            comment: DataTypes.TEXT,
            objectNameId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Log',
        }
    );
    return Log;
};
