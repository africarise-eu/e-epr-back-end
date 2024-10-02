'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Verifier extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Verifier.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            verifierId: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            firstLogin: {
                type: DataTypes.DATE,
            },
            lastLogin: {
                type: DataTypes.DATE,
            },
            totalTask: {
                type: DataTypes.INTEGER,
            },
            taskAvg: {
                type: DataTypes.FLOAT,
            },
        },
        {
            sequelize,
            modelName: 'Verifier',
            paranoid: true,
        }
    );
    return Verifier;
};
