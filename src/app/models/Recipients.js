import Sequelize, { Model } from "sequelize";

class Recipients extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        rua: Sequelize.STRING,
        complemento: Sequelize.STRING,
        numero: Sequelize.INTEGER,
        estado: Sequelize.STRING,
        cidade: Sequelize.STRING,
        cep: Sequelize.BIGINT
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        underscoredAll: true
      }
    );
    return this;
  }
}
export default Recipients;
