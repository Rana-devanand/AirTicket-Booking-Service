const bodyParser = require("body-parser");
const express = require("express");
const { PORT } = require("./config/serverConfig");
const apiRoutes = require("./routers/index");
const db = require("./models/index");
const app = express();

const setupAndStartServer = () => {
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.use("/api ", apiRoutes);

  app.listen(
    (PORT,
    async () => {
      console.log(`Server is running on port ${PORT}`);
      if (process.env.DB_SYNC) {
        db.sequelize.sync({ alter: true });
      }
    })
  );
};

setupAndStartServer();
