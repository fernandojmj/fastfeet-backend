import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "../../config/auth";

import Sequelize, { Model } from "sequelize";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        avatar: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        underscoredAll: true
      }
    );

    this.addHook("beforeSave", async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  generateToken({ id }) {
    return jwt.sign({ id }, auth.secret, { expiresIn: auth.ttl });
  }
}
export default User;
