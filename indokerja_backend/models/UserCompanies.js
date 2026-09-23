'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCompanies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserCompanies.hasMany(models.Jobs, { foreignKey: "user_company_id" });
    }
  }
  UserCompanies.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'unique_email_company_constraint',
        msg: 'Email is already registered' 
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
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'unique_company_name_constraint',
        msg: 'Company name is already used'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Company name cannot be empty"
        },
        is: {
          args: /^[a-zA-Z0-9\s]+$/,
          msg: "Company name can only contain letters, numbers, and spaces"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'UserCompanies',
  });
  return UserCompanies;
};