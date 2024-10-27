'use strict';

const tableName = 'event_attendees';

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
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users', // Adjust this if your table is named differently
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE', // Adjust based on your requirements
        },
        eventId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'events', // Adjust this if your table is named differently
            key: 'eventId',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE', // Adjust based on your requirements
        },
        status: {
          type: Sequelize.ENUM('registered', 'attended', 'cancelled'),
          allowNull: false,
          defaultValue: 'registered',
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
          unique_event_attendee: {
            fields: ['userId', 'eventId'], // To ensure a user can register for an event only once
          },
        },
      },
    );
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable(tableName);
  },
};
