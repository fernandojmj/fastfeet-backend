// import Bee from "bee-queue";

// import DeliveryReadyMail from "../app/jobs/DeliveryReadyMail";
// import DeliveryCancelMail from "../app/jobs/DeliveryCancelMail";
// import redisConfig from "../config/redis";

// const jobs = [DeliveryCancelMail, DeliveryReadyMail];

// class Queue {
//   constructor() {
//     this.queues = {};

//     this.init();
//   }

//   init() {
//     jobs.forEach(({ key, handle }) => {
//       this.queues[key] = {
//         bee: new Bee(key, {
//           redis: redisConfig,
//         }),
//         handle,
//       };
//     });
//   }

//   add(queue, job) {
//     console.log("Adicionadno pedido a fila redis");

//     return this.queues[queue].bee.createJob(job).save();
//   }

//   processQueue() {
//     jobs.forEach((job) => {
//       const { bee, handle } = this.queues[job.key];
//       console.log(handle);
//       bee.on("failed", this.handleFailure).process(handle);
//     });
//   }

//   handleFailure(job, error) {
//     console.log(`Queue ${job.queue.name}: FAILED`, error);
//   }
// }

// export default new Queue();
