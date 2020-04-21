import DeliveyProblems from "../models/DeliveryProblems";
import moment from "moment-timezone";
import Sequelize from "sequelize";
import DeliveryMan from "../models/DeliveryMan";
import Deliverie from "../models/Deliverie";
import DeliveryProblems from "../models/DeliveryProblems";

class DeliveryProblemsController {
  //entregador cadastrar problemas na entrega apenas informando seu ID de cadastro (ID da encomenda no banco de dados);
  async create(req, res) {
    console.log(req.params);
    const rec = await DeliveyProblems.create({
      ...req.body,
      delivery_id: req.params.id,
    });

    return res.json(rec);
  }

  // todos os problemas de uma encomenda baseado no ID da encomenda.
  async findProblemsByDelivery(req, res) {
    const Op = Sequelize.Op;

    const response = await DeliveyProblems.findAll({
      where: {
        delivery_id: {
          [Op.eq]: req.params.id,
        },
      },
    });

    return res.json({ response });
  }

  async showAll(req, res) {
    const Op = Sequelize.Op;

    const response = await DeliveyProblems.findAll();

    return res.json({ response });
  }
  //distribuidora cancelar uma entrega baseado no ID do problema.
  async cancelDeliveryByproblems(req, res) {
    const Op = Sequelize.Op;

    let response = await DeliveyProblems.findAll({
      include: [{ model: Deliverie, as: "delivery" }],
      where: {
        id: {
          [Op.eq]: req.params.id,
        },
      },
    });
    let idDelivery = null;
    response.map((item) => {
      console.log(item.delivery.id);
      idDelivery = item.delivery.id;
    });

    const dataAtual = await moment().format();
    const requestUpdate = {
      canceledAt: dataAtual,
    };
    await Deliverie.update(requestUpdate, {
      where: {
        id: {
          [Op.eq]: idDelivery,
        },
      },
    }).then(function (rowsUpdated) {
      rowsUpdated.map((item) => {
        if (item === 1) {
          response = true;
        } else {
          response = false;
        }
      });
    });

    return res.json({ response });
  }
}

export default new DeliveryProblemsController();
