require("dotenv").config();
module.exports = {
  host: process.env.REDIS,
  port: process.env.PORT_REDIS,
};
