import Sequelize, { Model } from "sequelize";
import "dotenv/config";

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        size: Sequelize.NUMBER,
        key: Sequelize.STRING,
        url: Sequelize.STRING,
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        underscoredAll: true,
      }
    );

    File.addHook("beforeCreate", (file, options) => {
      console.log("entrou no hook");
      console.log(file);
      if (file.url === "") {
        file.url = `${process.env.APP_URL}/files/${file.key}`;
      }
    });
    return this;
  }
}

export default File;
