'use strict';

const tableName = 'verification_tokens';

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
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        uniqueKeys: {
          unique_verification_token: {
            fields: ['email'], // Ensure a user can have only one verification token at a time
          },
        },
      },
    );
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable(tableName);
  },
};
