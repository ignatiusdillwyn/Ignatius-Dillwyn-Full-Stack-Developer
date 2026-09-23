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
  class ApplicationHistories extends Model {
    static associate(models) {
      ApplicationHistories.belongsTo(models.Applications, {
        foreignKey: "application_id"
      });
    }
  }

  ApplicationHistories.init({
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'application_id is required' }
      }
    },
    previous_status: {
      type: DataTypes.ENUM(...STATUS_ENUM),
      allowNull: false,
      validate: {
        notNull: { msg: 'previous_status is required' },
        isIn: {
          args: [STATUS_ENUM],
          msg: 'previous_status must be one of: ' + STATUS_ENUM.join(', ')
        }
      }
    },
    current_status: {
      type: DataTypes.ENUM(...STATUS_ENUM),
      allowNull: false,
      validate: {
        notNull: { msg: 'current_status is required' },
        isIn: {
          args: [STATUS_ENUM],
          msg: 'current_status must be one of: ' + STATUS_ENUM.join(', ')
        }
      }
    }
  }, {
    sequelize,
    modelName: 'ApplicationHistories',
  });

  ApplicationHistories.STATUS_ENUM = STATUS_ENUM;
  return ApplicationHistories;
};