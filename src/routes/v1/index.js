const express = require("express");
const router = express.Router();

const { BookingController } = require("../../controllers/index");
// const { createChannel } = require("../../utils/messageQueue");

// const channel = await createChannel();
const bookingController = new BookingController();

// Define All routers here...

router.post("/bookings", bookingController.create);
router.post("/publish", bookingController.sendMessageToQueue);

module.exports = router;
