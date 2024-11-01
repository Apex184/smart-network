'use strict';

const tableName = 'users';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(tableName, 'role', {
      type: Sequelize.ENUM('client', 'user', 'organizer', 'admin'),
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(tableName, 'role', {
      type: Sequelize.ENUM('client', 'user', 'organizer', 'admin'),
      allowNull: false,

    });
  },
};
