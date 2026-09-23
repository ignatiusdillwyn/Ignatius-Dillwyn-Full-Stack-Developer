'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Jobs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_jobseeker_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'UserJobSeekers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('Applied', 'Reviewing', 'Shortlisted', 'Rejected', 'Accepted'),
        allowNull: false,
        defaultValue: 'Applied',   // ← opsional, tapi recommended
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
    await queryInterface.dropTable('Applications');
  }
};