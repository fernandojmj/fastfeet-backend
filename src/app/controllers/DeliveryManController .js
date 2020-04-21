import DeliveryMan from "../models/DeliveryMan";
import Sequelize from "sequelize";
import ModelFile from "../models/File";

class DeliveryManController {
  async show(req, res) {
    const Op = Sequelize.Op;
    const rec = await DeliveryMan.findAll({
      include: [
        {
          model: ModelFile,
          as: "avatarid",
          attributes: ["url", "path", "id"],
        },
      ],
      where: {
        id: {
          [Op.eq]: req.params.id,
        },
      },
    });
    return res.json(rec[0]);
  }

  async showAll(req, res) {
    const rec = await DeliveryMan.findAll({
      include: [
        {
          model: ModelFile,
          as: "avatarid",
        },
      ],
    });
    return res.json(rec);
  }

  async create(req, res) {
    const rec = await DeliveryMan.create({
      ...req.body,
    });

    return res.json(rec);
  }

  async update(req, res) {
    DeliveryMan.update(req.body, {
      returning: false,
      where: { id: req.params.id },
    }).then(function (rowsUpdated) {
      if (rowsUpdated > 0) {
        return res.json(true);
      } else {
        return res.json(false);
      }
    });
  }

  async delete(req, res) {
    DeliveryMan.destroy({
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

  async findDeliveryManByname(req, res) {
    const Op = Sequelize.Op;
    const filter = req.query.filter;
    let response = [];
    if (filter !== undefined) {
      response = await DeliveryMan.findAll({
        include: [
          {
            model: ModelFile,
            as: "avatarid",
          },
        ],
        where: {
          name: {
            [Op.like]: `%${filter}%`,
          },
        },
      });
    } else {
      response = await DeliveryMan.findAll();
    }

    return res.json({ response });
  }
}

export default new DeliveryManController();
