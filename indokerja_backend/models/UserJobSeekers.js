'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserJobSeekers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserJobSeekers.hasMany(models.Applications, { foreignKey: "user_jobseeker_id" });
    }
  }
  UserJobSeekers.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'unique_email_jobseeker_constraint',
        msg: 'Email is already registered'  // ← pesan error di sini
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Email cannot be empty",
        },
        isEmail: {
          args: true,
          msg: "Email format is invalid"
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 255],
          msg: "Password must be at least 8 characters"
        },
        notEmpty: {
          args: true,
          msg: "Password cannot be empty"
        },
        notNull: {
          args: true,
          msg: "Password is required"
        },
        // Custom validator: harus mengandung huruf dan angka
        isValidPassword(value) {
          if (!/[a-zA-Z]/.test(value)) {
            throw new Error("Password must contain at least one letter");
          }
          if (!/[0-9]/.test(value)) {
            throw new Error("Password must contain at least one number");
          }
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'unique_username_constraint',
        msg: 'Username is already used'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Username cannot be empty"
        },
        is: {
          args: /^[a-zA-Z0-9\s]+$/,
          msg: "Username can only contain letters, numbers, and spaces"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'UserJobSeekers',
  });
  return UserJobSeekers;
};