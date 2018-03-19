'use strict';
module.exports = (sequelize, DataTypes) => {
    const shop = sequelize.define('shop', {
        picture: {
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },
        contact: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            unique: true,
            validate: {
                max: 9999999999,
                min: 1000000000,
                isInt: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
            }
        },
        owner_full_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        opening_hours: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            validate: {
                max: 24,
                min: 0,
                isInt: true
            }
        },
        closing_hours: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            validate: {
                max: 24,
                min: 0,
                isInt: true
            }
        },
        is_online: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        },
        is_email_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        email_verify_key: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        is_contact_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        OTP: {
            type: DataTypes.INTEGER.UNSIGNED,
            unique: true,
            allowNull: true
        }
    }, {
        underscored: true,
    });

    shop.associate = (models) => {
        shop.hasMany(models.offer, {
            foreignKey: {
                name: 'shop_id',
                allowNull: false
            }
        });
        shop.hasMany(models.invoice, {
            foreignKey: {
                name: 'shop_id',
                allowNull: false
            }
        });
        shop.belongsToMany(models.product, {through: models.shop_product});
    };

    return shop;
};