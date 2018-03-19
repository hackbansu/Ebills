'use strict';
module.exports = (sequelize, DataTypes) => {
    const invoice_product = sequelize.define('invoice_product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                notEmpty: true,
            }
        },
        count: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1,
                isInt: true
            }
        },
        price: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            validate: {
                min: 0,
                isInt: true
            }
        },
        total_price: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            validate: {
                min: 0,
                isInt: true
            }
        }
    }, {
        underscored: true,
    });

    invoice_product.associate = (models) => {

    };

    return invoice_product;
};