"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("recipients", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      rua: {
        allowNull: false,
        type: Sequelize.STRING
      },
      numero: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      complemento: {
        allowNull: false,
        type: Sequelize.STRING
      },
      estado: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.STRING
      },
      cidade: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.STRING
      },
      cep: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.INTEGER
      },
      created_At: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_At: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("recipients");
  }
};
