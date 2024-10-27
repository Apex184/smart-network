'use strict';

const tableName = 'two_factor_tokens';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      tableName,
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'users', // Adjust this if your table is named differently
            key: 'email',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE', // Adjust based on your requirements
        },
        token: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        expires: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Automatically set to the current timestamp
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Set default value without update clause
        },
      },
      {
        uniqueKeys: {
          unique_two_factor_token: {
            fields: ['email'], // Ensure a user can have only one two-factor token at a time
          },
        },
      },
    );

    // Adding a trigger to automatically update the updatedAt field
    await queryInterface.sequelize.query(`
      CREATE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updatedAt = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER update_two_factor_tokens_updated_at
      BEFORE UPDATE ON ${tableName}
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
    `);
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable(tableName);
  },
};
