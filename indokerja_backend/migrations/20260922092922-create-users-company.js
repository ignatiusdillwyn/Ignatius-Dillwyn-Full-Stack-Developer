'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserCompanies', {
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
      company: {
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
    await queryInterface.addConstraint('UserCompanies', {
      fields: ['email'],
      type: 'unique',
      name: 'unique_email_company_constraint'
    });

    // Tambahkan unique constraint untuk username
    await queryInterface.addConstraint('UserCompanies', {
      fields: ['company'],
      type: 'unique',
      name: 'unique_company_name_constraint'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserCompanies');
  }
};