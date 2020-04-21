import express from "express";
import multer from "multer";
import multerConfig from "./config/multer";
import UserController from "./app/controllers/UserController";
import authMiddlaware from "./app/middlewares/auth";
import RecipientsController from "./app/controllers/RecipientsController";
import SessionController from "./app/controllers/SessionController";
import DeliveryManController from "./app/controllers/DeliveryManController ";
import DeliveriController from "./app/controllers/DeliveriController";
import DeliveryProblemsController from "./app/controllers/DeliveryProblemsController";
import FileController from "./app/controllers/FileController";

const routes = express.Router();

const upload = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);
routes.post("/files", upload.single("file"), FileController.store);

// Recipients
routes.get(
  "/recenpients/showAll",
  authMiddlaware,
  RecipientsController.showAll
);
routes.get("/recenpients/show/:id", authMiddlaware, RecipientsController.show);
routes.get(
  "/recenpients",
  authMiddlaware,
  RecipientsController.findRecipientByname
);
routes.put(
  "/recenpients/edit/:id",
  authMiddlaware,
  RecipientsController.update
);
routes.delete(
  "/recenpients/delete/:id",
  authMiddlaware,
  RecipientsController.delete
);
routes.post("/recenpients/create", authMiddlaware, RecipientsController.create);

// DeliveryMan
routes.get(
  "/deliveryMan/showAll",
  authMiddlaware,
  DeliveryManController.showAll
);
routes.get("/deliveryMan/show/:id", DeliveryManController.show);
routes.get(
  "/deliveryMan",
  authMiddlaware,
  DeliveryManController.findDeliveryManByname
);
routes.put(
  "/deliveryMan/edit/:id",
  authMiddlaware,
  DeliveryManController.update
);
routes.delete(
  "/deliveryMan/delete/:id",
  authMiddlaware,
  DeliveryManController.delete
);

routes.post(
  "/deliveryMan/create",
  authMiddlaware,
  DeliveryManController.create
);

//deliveri
routes.post("/deliveries/create", authMiddlaware, DeliveriController.create);

routes.get("/delivery/showAll", authMiddlaware, DeliveriController.showAll);
routes.get("/delivery/show/:id", DeliveriController.show);
routes.put("/delivery/edit/:id", authMiddlaware, DeliveriController.update);
routes.delete(
  "/delivery/delete/:id",
  authMiddlaware,
  DeliveriController.delete
);
routes.get(
  "/delivery/product",
  authMiddlaware,
  DeliveriController.findDeliveryByProduct
);
routes.get(
  "/deliveryMan/:id/deliveries",
  DeliveriController.findDeliveryByDeliveryMan
);
routes.get(
  "/deliveryMan/:id/deliveried",
  DeliveriController.findDeliveredByDeliveryMan
);

//withdrawal
routes.get(
  "/delivery/withdrawal/:id/deliveryman/:deliveryManId",
  DeliveriController.withdrawal
);
routes.put("/delivery/deliveryEnd/:id", DeliveriController.deliveryEnd);
routes.post(
  "/delivery/withdrawalManual",
  DeliveriController.deliveryStartManual
);
routes.post(
  "/delivery/deliveryEndManual",
  DeliveriController.deliveryEndManual
);

//problems
routes.post("/delivery/:id/problems", DeliveryProblemsController.create);
routes.get(
  "/delivery/:id/problems",
  DeliveryProblemsController.findProblemsByDelivery
);
routes.get(
  "/deliveries/problems",
  authMiddlaware,
  DeliveriController.findDeliveryWithProblems
);
routes.get("/problems", authMiddlaware, DeliveryProblemsController.showAll);
//distribuidora cancelar uma entrega baseado no ID do problema.
routes.delete(
  "/problem/:id/cancel-delivery",
  authMiddlaware,
  DeliveryProblemsController.cancelDeliveryByproblems
);

export default routes;
