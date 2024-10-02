'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserCompany extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            UserCompany.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'User',
            });
            UserCompany.belongsTo(models.Company, {
                foreignKey: 'companyId',
                as: 'Company',
            });
        }
    }
    UserCompany.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            companyId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'UserCompany',
            paranoid: true,
        }
    );
    return UserCompany;
};
