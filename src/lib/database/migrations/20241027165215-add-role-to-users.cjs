'use strict';

const tableName = 'users';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the enum type if it doesn't exist
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_role') THEN
          CREATE TYPE "enum_users_role" AS ENUM ('client', 'user', 'organizer', 'admin');
        END IF;
      END $$;
    `);

    // Add the 'role' column to the 'users' table
    await queryInterface.addColumn(tableName, 'role', {
      type: Sequelize.ENUM('client', 'user', 'organizer', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the 'role' column
    await queryInterface.removeColumn(tableName, 'role');

    // Drop the enum type if it's no longer needed
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_users_role";`);
  },
};
