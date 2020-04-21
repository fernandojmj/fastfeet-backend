import Sequelize from "sequelize";

import databaseConfig from "../config/database";

import modelUser from "../app/models/User";
import modelRecipients from "../app/models/Recipients";
import modelDeliveryMan from "../app/models/DeliveryMan";
import modelDeliveri from "../app/models/Deliverie";
import modelDeliveryProblems from "../app/models/DeliveryProblems";
import modelFiles from "../app/models/File";

const models = [
  modelUser,
  modelRecipients,
  modelDeliveryMan,
  modelDeliveri,
  modelDeliveryProblems,
  modelFiles,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
