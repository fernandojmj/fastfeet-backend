import User from "../models/User";

class UserController {
  async store(req, res) {
    const { email, password, password_hash } = req.body;
    console.log(email);
    if (password !== password_hash) {
      return res.status(400).json({ error: "Senha não confere" });
    }
    if (await User.findOne({ where: { email: email } })) {
      return res.status(400).json({ error: "Usuario já existe" });
    }

    const user = await User.create(req.body);
    return res.json(user);
  }
}

export default new UserController();
