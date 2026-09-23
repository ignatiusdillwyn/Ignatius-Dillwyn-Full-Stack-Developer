'use strict';
const { Model } = require('sequelize');

const STATUS_ENUM = [
  'Applied',
  'Reviewing',
  'Shortlisted',
  'Rejected',
  'Accepted'
];

module.exports = (sequelize, DataTypes) => {
  class Applications extends Model {
    static associate(models) {
      Applications.belongsTo(models.UserJobSeekers, {
        foreignKey: "user_jobseeker_id"
      });
      Applications.belongsTo(models.Jobs, {
        foreignKey: "job_id"
      });
      Applications.hasMany(models.ApplicationHistories, {
        foreignKey: "application_id"
      });
    }
  }

  Applications.init({
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'job_id is required' }
      }
    },
    user_jobseeker_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'user_jobseeker_id is required' }
      }
    },
    status: {
      type: DataTypes.ENUM(...STATUS_ENUM),
      allowNull: false,
      defaultValue: 'Applied',
      validate: {
        notNull: { msg: 'status is required' },
        isIn: {
          args: [STATUS_ENUM],
          msg: 'status must be one of: ' + STATUS_ENUM.join(', ')
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Applications',
  });

  Applications.STATUS_ENUM = STATUS_ENUM;
  return Applications;
};