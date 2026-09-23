'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'UserCompanies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      job_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      job_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      company: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      salary: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      job_type: {
        type: Sequelize.ENUM('Full-time', 'Part-time', 'Contract'),
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
    await queryInterface.dropTable('Jobs');
  }
};