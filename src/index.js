const bodyParser = require("body-parser");
const express = require("express");
const { PORT } = require("./config/serverConfig");
const apiRoutes = require("./routers/index");

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
    })
  );
};

setupAndStartServer();
