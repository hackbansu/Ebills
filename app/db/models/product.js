'use strict';
module.exports = (sequelize, DataTypes) => {
    const product = sequelize.define('product', {
        clip_art: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        overall_rating: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                max: 5,
                min: 0,
                isFloat: true,
            }
        },
        total_ratings: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
                isInt: true
            }
        }
    }, {
        underscored: true,
    });

    product.associate = (models) => {
        product.belongsToMany(models.shop, {through: models.shop_product});
        product.belongsToMany(models.invoice, {through: models.invoice_product});
    };

    return product;
};