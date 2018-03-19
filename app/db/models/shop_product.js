'use strict';
module.exports = (sequelize, DataTypes) => {
    const shop_product = sequelize.define('shop_product', {
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
        }
    }, {
        underscored: true,
    });

    shop_product.associate = (models) => {

    };

    return shop_product;
};