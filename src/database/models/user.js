'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsTo(models.Role, {
                foreignKey: 'roleId',
                as: 'Role',
            });
            User.hasMany(models.UserCompany, {
                foreignKey: 'userId',
                as: 'Company',
                // through: model.UserCompany,
            });
            User.hasMany(models.Product, { foreignKey: 'userId' });
            User.hasMany(models.ImportShipments, { foreignKey: 'userId' });
            User.hasMany(models.ImportShipmentProducts, { foreignKey: 'userId' });
            User.hasMany(models.CompensationRequest, { foreignKey: 'userId' });
            User.hasOne(models.Verifier, {
                foreignKey: 'userId',
                as: 'verifier',
            });
            User.hasOne(models.Company, {
                foreignKey: 'userId',
                as: 'Companies',
            });
        }
    }
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            inviteLink: {
                type: DataTypes.STRING,
            },
            roleId: {
                type: DataTypes.INTEGER,
            },
            imagePath: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: 'enabled',
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            isVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            otp: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            otpExpiration: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            otpToken: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            accessToken: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            inviteLinkExpiration: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            profileImage: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'User',
        }
    );
    return User;
};
