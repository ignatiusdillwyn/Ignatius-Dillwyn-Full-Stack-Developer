'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Cek dulu, buat kalau belum ada
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_Jobs_job_type" AS ENUM (
          'Full-time', 'Part-time', 'Contract'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

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
        type: '"enum_Jobs_job_type"',
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
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_Jobs_job_type";`
    );
  }
};