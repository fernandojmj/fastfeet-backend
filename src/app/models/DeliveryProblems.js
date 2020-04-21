import Sequelize, { Model } from "sequelize";

class DeliveryProblems extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING
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

  static associate(models) {
    this.belongsTo(models.Deliverie, {
      foreignKey: "delivery_id",
      as: "delivery"
    });
  }
}
export default DeliveryProblems;
