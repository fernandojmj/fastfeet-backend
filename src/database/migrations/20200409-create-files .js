"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("files", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      size: {
        allowNull: false,
        unique: false,
        type: Sequelize.INTEGER,
      },
      key: {
        allowNull: false,
        unique: false,
        type: Sequelize.STRING,
      },
      url: {
        allowNull: false,
        unique: false,
        type: Sequelize.STRING,
      },
      created_At: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_At: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("files");
  },
};
