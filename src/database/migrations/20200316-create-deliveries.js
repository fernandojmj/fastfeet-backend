"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("deliveries", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product: {
        allowNull: false,
        type: Sequelize.STRING
      },
      signature_id: {
        allowNull: true,
        type: Sequelize.STRING
      },
      canceled_at: {
        allowNull: true,
        unique: false,
        type: Sequelize.DATE
      },
      start_date: {
        allowNull: true,
        unique: false,
        type: Sequelize.DATE
      },
      end_date: {
        allowNull: true,
        unique: false,
        type: Sequelize.DATE
      },
      created_At: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_At: {
        allowNull: false,
        type: Sequelize.DATE
      },
      recipient_id: {
        type: Sequelize.INTEGER,
        reference: {
          model: "Recipients",
          key: "id",
          allowNull: false
        }
      },
      deliveryman_id: {
        type: Sequelize.INTEGER,
        reference: {
          model: "deliveryMan",
          key: "id",
          allowNull: false
        }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("deliveries");
  }
};
