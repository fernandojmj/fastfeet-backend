import User from "../models/User";

class SessionController {
  async store(req, res, next) {
    const { email, password } = req.body;

    // try {
    console.log("obtendo usuario: " + email);
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).json({ erro: "usuario não existe" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ erro: "Login invalido" });
    }

    const { id, name, avatar } = user;
    return res.json({
      user: {
        id,
        name,
        email,
        avatar
      },
      token: user.generateToken(user.id)
    });
  }
  // catch(error) {
  //   return res.status(400).json({ erro: "ocorreu um erro ao efetuar o login" });
  // }
}

export default new SessionController();
