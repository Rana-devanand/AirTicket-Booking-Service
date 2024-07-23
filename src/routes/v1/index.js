const express = require("express");
const { BookingController } = require("../../controllers/index");

const router = express.Router();
// Define All routers here...

router.post("/bookings", BookingController.create);

module.exports = router;
