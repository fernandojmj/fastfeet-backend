import Deliveri from "../models/Deliverie";
import moment from "moment-timezone";
import Sequelize from "sequelize";
import DeliveryProblems from "../models/DeliveryProblems";
import RecipientsModel from "../models/Recipients";
import DeliveryManModel from "../models/DeliveryMan";
import Mail from "../../lib/Mail";

import Files from "../models/File";
import Queue from "../../lib/Queue";

import DeliveryReadyMail from "../jobs/DeliveryReadyMail";

class DeliveriController {
  async show(req, res) {
    const rec = await Deliveri.findOne({
      include: [
        {
          model: RecipientsModel,
          as: "recipient",
        },
        {
          model: DeliveryManModel,
          as: "deliveryman",
          include: [
            {
              model: Files,
              as: "avatarid",
            },
          ],
        },
        {
          model: Files,
          as: "signature_id",
        },
      ],
      where: {
        id: req.params.id,
      },
    });

    return res.json(rec);
  }

  async showAll(req, res) {
    const rec = await Deliveri.findAll({
      include: [
        {
          model: DeliveryManModel,
          as: "deliveryman",
          include: [
            {
              model: Files,
              as: "avatarid",
            },
          ],
        },

        {
          model: RecipientsModel,
          as: "recipient",
        },
        {
          model: Files,
          as: "signature_id",
        },
        // ,
        // {
        //   model: DeliveryProblems,
        //   as: "deliveryProblems"
        // }
      ],
    });
    return res.json(rec);
  }

  async create(req, res) {
    console.log(req.body);
    const { recipient_id } = req.body;
    const { deliveryman_id } = req.body;
    const DeliveryMan = deliveryman_id;
    const recipient = recipient_id;

    const recipientObject = await RecipientsModel.findByPk(recipient);

    if (!recipientObject) {
      return response
        .status(401)
        .json({ error: "Destinatário não encontrado" });
    }

    const deliveryManOBject = await DeliveryManModel.findByPk(DeliveryMan);

    if (!deliveryManOBject) {
      return response.status(401).json({ error: "Entregador não encontrado" });
    }

    const delivery = await Deliveri.create({
      ...req.body,
      recipient_id: recipient,
      deliveryman_id: DeliveryMan,
    });

    // await Queue.add(DeliveryReadyMail.key, {
    //   deliveryman: deliveryManOBject,
    //   delivery,
    //   recipientObject,
    // });
    console.log(deliveryManOBject);
    console.log(delivery);
    console.log(recipientObject);
    await Mail.sendMail({
      to: `${deliveryManOBject.name} <${deliveryManOBject.email}>`,
      subject: "FastFeet | Encomenda pronta para retirada!",
      template: "delivery_ready",
      context: {
        deliviremanName: `${deliveryManOBject.name}`,
        product: delivery.product,
        cidade: recipientObject.cidade,
        rua: recipientObject.rua,
        complemento: recipientObject.complemento,
        estado: recipientObject.estado,
        cep: recipientObject.cep,
        destinatario: recipientObject.name,
        numero: recipientObject.numero,
      },
    });

    return res.json(delivery);
  }

  async update(req, res) {
    Deliveri.update(req.body, {
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
    Deliveri.destroy({
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

  async withdrawal(req, res) {
    const Op = Sequelize.Op;
    // moment.locale();
    const horaAtual = moment().hour();
    const hourEnd = await !moment(horaAtual).isAfter(18);
    const hourStart = await moment(horaAtual).isAfter(8);
    let returnWithdrawal = false;

    const qtdRetiradaDia = await Deliveri.findAll({
      where: {
        startDate: {
          [Op.between]: [
            moment().format("YYYY-MM-DD") + " " + "00:00:00",
            moment().format("YYYY-MM-DD") + " " + "23:59:59",
          ],
        },
        deliveryman_id: req.params.deliveryManId,
      },
    });

    // console.log(res.json(qtdRetiradaDia));
    console.log(qtdRetiradaDia.length);

    if (qtdRetiradaDia.length < 5) {
      //Atualiza data de retira dentro do horario permitido
      if (hourEnd && hourStart) {
        console.log("retirada Permitida");

        const dataAtual = await moment().format();
        console.log(dataAtual);
        const requestUpdate = {
          startDate: dataAtual,
        };

        await Deliveri.update(requestUpdate, {
          returning: false,
          where: { id: req.params.id },
        }).then(function (rowsUpdated) {
          rowsUpdated.map((item) => {
            if (item === 1) {
              returnWithdrawal = true;
            }
          });
        });
      } else {
        return res.json({
          Withdrawal: "Horario não permitido para retirada",
        });
      }
    } else {
      return res.json({
        Withdrawal:
          "Você possui " +
          qtdRetiradaDia.length +
          " e não pode realizar mais retiradas hoje. ",
      });
    }

    return res.json({
      Withdrawal: returnWithdrawal,
    });
  }

  async deliveryEnd(req, res) {
    console.log(req.params);
    // moment.locale();
    const dataAtual = await moment().format();

    const signature_id = req.body.signature_id;

    const requestUpdate = {
      endDate: dataAtual,
      signatureId: signature_id,
    };
    let response = false;
    await Deliveri.update(requestUpdate, {
      returning: false,
      where: { id: req.params.id },
    }).then(function (rowsUpdated) {
      rowsUpdated.map((item) => {
        if (item === 1) {
          response = true;
        }
      });
    });

    return res.json(response);
  }
  async deliveryEndManual(req, res) {
    console.log(req.params);
    // moment.locale();
    const datafinalizing = req.body.endDate;
    const id = req.body.id;
    const requestUpdate = {
      endDate: datafinalizing,
    };
    let response = false;
    await Deliveri.update(requestUpdate, {
      returning: false,
      where: { id: id },
    }).then(function (rowsUpdated) {
      rowsUpdated.map((item) => {
        if (item === 1) {
          response = true;
        }
      });
    });
    return res.json({
      end: response,
    });
  }

  async deliveryStartManual(req, res) {
    console.log(req.params);
    // moment.locale();
    const dataStart = req.body.startDate;
    const id = req.body.id;
    const Op = Sequelize.Op;

    const qtdRetiradaDia = await Deliveri.findAll({
      where: {
        startDate: {
          [Op.between]: [
            moment().format("YYYY-MM-DD") + " " + "00:00:00",
            moment().format("YYYY-MM-DD") + " " + "23:59:59",
          ],
        },
        deliveryman_id: req.body.deliveryManId,
      },
    });

    // console.log(res.json(qtdRetiradaDia));
    console.log(qtdRetiradaDia.length);

    if (qtdRetiradaDia.length < 5) {
      const requestUpdate = {
        startDate: dataStart,
      };
      let response = false;
      await Deliveri.update(requestUpdate, {
        returning: false,
        where: { id: id },
      }).then(function (rowsUpdated) {
        rowsUpdated.map((item) => {
          if (item === 1) {
            response = true;
          }
        });
      });
    } else {
      return res.json({
        response: `Você possui ${qtdRetiradaDia.length} retiradas e não pode realizar mais retiradas hoje`,
      });
    }

    return res.json({
      response: response,
    });
  }

  async findDeliveryByDeliveryMan(req, res) {
    const Op = Sequelize.Op;
    const response = await Deliveri.findAll({
      include: [
        {
          model: DeliveryManModel,
          as: "deliveryman",
          include: [
            {
              model: Files,
              as: "avatarid",
            },
          ],
        },
        {
          model: RecipientsModel,
          as: "recipient",
        },
        // ,
        // {
        //   model: DeliveryProblems,
        //   as: "deliveryProblems"
        // }
      ],
      where: {
        endDate: {
          [Op.is]: null,
        },
        canceled_at: {
          [Op.is]: null,
        },
        deliveryman_id: req.params.id,
      },
    });

    return res.json({ response });
  }

  async findDeliveredByDeliveryMan(req, res) {
    const Op = Sequelize.Op;
    const response = await Deliveri.findAll({
      include: [
        {
          model: DeliveryManModel,
          as: "deliveryman",
          include: [
            {
              model: Files,
              as: "avatarid",
            },
          ],
        },
        {
          model: RecipientsModel,
          as: "recipient",
        },
        // ,
        // {
        //   model: DeliveryProblems,
        //   as: "deliveryProblems"
        // }
      ],
      where: {
        endDate: {
          [Op.not]: null,
        },
        deliveryman_id: req.params.id,
      },
    });

    return res.json({ response });
  }
  //listar todas as entregas com algum problema
  async findDeliveryWithProblems(req, res) {
    const Op = Sequelize.Op;
    const response = await Deliveri.findAll({
      include: [
        {
          model: DeliveryProblems,
          as: "deliveryProblems",
          where: {
            delivery_id: {
              [Op.not]: null,
            },
          },
        },
      ],
    });

    return res.json({ response });
  }
  //lista de encomendas por nome do produto
  async findDeliveryByProduct(req, res) {
    const Op = Sequelize.Op;
    const filter = req.query.filter;
    let response = [];
    if (filter !== undefined) {
      response = await Deliveri.findAll({
        include: [
          {
            model: DeliveryManModel,
            as: "deliveryman",
            include: [
              {
                model: Files,
                as: "avatarid",
              },
            ],
          },
          {
            model: RecipientsModel,
            as: "recipient",
          },
          // ,
          // {
          //   model: DeliveryProblems,
          //   as: "deliveryProblems"
          // }
        ],
        where: {
          product: {
            [Op.like]: `%${filter}%`,
          },
        },
      });
    } else {
      response = await Deliveri.findAll();
    }

    return res.json(response);
  }
}

export default new DeliveriController();
