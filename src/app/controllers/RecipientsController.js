import Recipients from "../models/Recipients";
import Sequelize from "sequelize";

class RecipientsController {
  async show(req, res) {
    const rec = await Recipients.findByPk(req.params.id);
    return res.json(rec);
  }

  async showAll(req, res) {
    const rec = await Recipients.findAll();
    return res.json(rec);
  }

  async create(req, res) {
    console.log(req.name);
    const rec = await Recipients.create({
      ...req.body,
    });

    return res.json(rec);
  }

  async update(req, res) {
    console.log(req.body);
    console.log(req.params.id);
    Recipients.update(req.body, {
      returning: false,
      where: { id: req.params.id },
    }).then(function (rowsUpdated) {
      if (rowsUpdated === 1) {
        return res.json(true);
      } else {
        return res.json(false);
      }
    });
  }

  async delete(req, res) {
    Recipients.destroy({
      where: {
        id: req.params.id,
      },
    }).then(function (rowDeleted) {
      // rowDeleted will return number of rows deleted
      if (rowDeleted === 1) {
        return res.json({ return: true });
      } else {
        return res.json({ return: false });
      }
    });

    // return res.send();
  }

  async findRecipientByname(req, res) {
    const Op = Sequelize.Op;
    const filter = req.query.filter;
    let response = [];
    if (filter !== undefined) {
      response = await Recipients.findAll({
        where: {
          name: {
            [Op.like]: `%${filter}%`,
          },
        },
      });
    } else {
      response = await Recipients.findAll();
    }

    return res.json({ response });
  }
}

export default new RecipientsController();
