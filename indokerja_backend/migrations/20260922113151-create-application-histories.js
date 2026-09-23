'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ApplicationHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      application_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Applications',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      previous_status: {
        type: Sequelize.ENUM('Applied', 'Reviewing', 'Shortlisted', 'Rejected', 'Accepted'),
        allowNull: false,
      },
      current_status: {
        type: Sequelize.ENUM('Applied', 'Reviewing', 'Shortlisted', 'Rejected', 'Accepted'),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ApplicationHistories');
  }
};