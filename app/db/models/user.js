'use strict';
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isAlpha: true
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isAlpha: true
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
        gender:{
            type: DataTypes.ENUM('M', 'F'),
            allowNull: false,
            defaultValue: 'M',
            validate: {
                notEmpty: true
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

    user.associate = (models) => {
        user.hasMany(models.invoice, {
            foreignKey: {
                name: 'user_id',
                allowNull: false
            }
        });
    };

    return user;
};