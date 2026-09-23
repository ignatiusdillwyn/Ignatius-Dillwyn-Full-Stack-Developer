'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Cek dulu, buat enum kalau belum ada
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_Applications_status" AS ENUM (
          'Applied', 'Reviewing', 'Shortlisted', 'Rejected', 'Accepted'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

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
        type: '"enum_Applications_status"', // pakai tanda kutip karena PostgreSQL case-sensitive
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
    await queryInterface.dropTable('Applications');
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_Applications_status";`
    );
  }
};