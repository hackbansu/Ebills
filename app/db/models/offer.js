'use strict';
module.exports = (sequelize, DataTypes) => {
    const offer = sequelize.define('offer', {
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        title:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        t_and_c:{
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        show_title:{
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        }
    }, {
        underscored: true,
    });

    offer.associate = (models) => {
        offer.belongsTo(models.shop, {
            foreignKey: {
                name: 'shop_id',
                allowNull: false
            }
        });
    };

    return offer;
};