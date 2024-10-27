'use strict';

const tableName = 'events';

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
        eventId: {
          type: Sequelize.STRING(12),
          allowNull: false,
          unique: true,
        },
        eventCode: {
          type: Sequelize.STRING(8),
          allowNull: false,
          unique: true,
        },
        eventName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        eventDescription: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        eventLocation: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        eventQrCodeUrl: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        eventStatus: {
          type: Sequelize.ENUM('upcoming', 'ongoing', 'completed', 'canceled'),
          allowNull: false,
          defaultValue: 'upcoming', // default status
        },
        eventVisibility: {
          type: Sequelize.ENUM('public', 'private'),
          allowNull: false,
          defaultValue: 'public', // default visibility
        },
        organizerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users', // Assuming you have a 'users' table
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL', // Change to 'SET NULL' or 'RESTRICT' as needed
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
          unique_event: {
            fields: ['eventId', 'eventCode'], // Example of unique constraint
          },
        },
      },
    );
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable(tableName);
  },
};
