require("dotenv").config();
module.exports = {
  secret: process.env.secret,
  ttl: "7d",
};
