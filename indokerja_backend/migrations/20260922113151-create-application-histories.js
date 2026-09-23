'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Cek dulu, buat enum kalau belum ada
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_ApplicationHistories_status" AS ENUM (
          'Applied', 'Reviewing', 'Shortlisted', 'Rejected', 'Accepted'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

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
        type: '"enum_ApplicationHistories_status"',
        allowNull: false,
      },
      current_status: {
        type: '"enum_ApplicationHistories_status"',
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
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_ApplicationHistories_status";`
    );
  }
};