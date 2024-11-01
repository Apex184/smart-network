'use strict';

const tableName = 'users';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(tableName, 'publicId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn(tableName, 'publicId', {
      type: Sequelize.STRING(12),
      allowNull: false,
      unique: true,
      defaultValue: null,
    });
  },
};
