"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  up: (QueryInterface) => {
    return QueryInterface.bulkInsert(
      "users",
      [
        {
          name: "Distribuidora FastFeet",
          email: "admin@fastfeet.com",
          password_hash: bcrypt.hashSync("2020", 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
