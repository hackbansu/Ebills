'use strict';
module.exports = (sequelize, DataTypes) => {
    const invoice = sequelize.define('invoice', {
        number:{
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            validate: {
                min: 0,
                isInt: true
            }
        },
        total_price:{
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            validate: {
                min: 0,
                isInt: true
            }
        },
        invoice_date:{
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: true
            }
        },
        is_cancelled:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    }, {
        underscored: true,
    });

    invoice.associate = (models) => {
        invoice.belongsTo(models.shop, {
            foreignKey: {
                name: 'shop_id',
                allowNull: false
            }
        });
        invoice.belongsTo(models.user, {
            foreignKey: {
                name: 'user_id',
                allowNull: false
            }
        });
        invoice.belongsToMany(models.product, {through: models.invoice_product});
    };

    return invoice;
};