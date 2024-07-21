const bodyParser = require("body-parser");
const express = require("express");

const app = express();
const PORT = 3001;

const setupAndStartServer = () => {
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.listen(
    (PORT,
    async () => {
      console.log(`Server is running on port ${PORT}`);
    })
  );
};

setupAndStartServer();
