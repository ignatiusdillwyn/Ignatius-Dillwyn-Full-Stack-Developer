'use strict';
const { Model } = require('sequelize');

const JOB_TYPE_ENUM = [
  'Full-time',
  'Part-time',
  'Contract',
];

module.exports = (sequelize, DataTypes) => {
  class Jobs extends Model {
    static associate(models) {
      Jobs.belongsTo(models.UserCompanies, { foreignKey: "user_company_id" });
    }
  }

  Jobs.init({
    user_company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'user_company_id is required' },
        notEmpty: { msg: 'user_company_id is required' }
      }
    },
    job_title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'job_title is required' },
        notEmpty: { msg: 'job_title cannot be empty' }
      }
    },
    job_description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: 'job_description is required' },
        notEmpty: { msg: 'job_description cannot be empty' }
      }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'company is required' },
        notEmpty: { msg: 'company cannot be empty' }
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'location is required' },
        notEmpty: { msg: 'location cannot be empty' }
      }
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'salary is required' },
        isInt: { msg: 'salary must be an integer' },
        min: { args: [0], msg: 'salary cannot be negative' }
      }
    },
    job_type: {
      type: DataTypes.ENUM(...JOB_TYPE_ENUM),
      allowNull: false,
      validate: {
        notNull: { msg: 'job_type is required' },
        isIn: {
          args: [JOB_TYPE_ENUM],
          msg: 'job_type must be one of: ' + JOB_TYPE_ENUM.join(', ')
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Jobs',
  });

  Jobs.JOB_TYPE_ENUM = JOB_TYPE_ENUM;
  return Jobs;
};