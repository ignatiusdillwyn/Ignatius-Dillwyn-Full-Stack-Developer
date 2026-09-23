'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserJobSeekers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
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

    // Tambahkan unique constraint untuk email
    await queryInterface.addConstraint('UserJobSeekers', {
      fields: ['email'],
      type: 'unique',
      name: 'unique_email_jobseeker_constraint'
    });

    // Tambahkan unique constraint untuk username
    await queryInterface.addConstraint('UserJobSeekers', {
      fields: ['username'],
      type: 'unique',
      name: 'unique_username_constraint'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserJobSeekers');
  }
};