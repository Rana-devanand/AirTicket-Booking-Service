const { StatusCodes } = require("http-status-codes");
const { BookingServices } = require("../services/index");

const { createChannel, publishMessage } = require("../utils/messageQueue");
const { REMINDER_BINDING_KEY } = require("../config/serverConfig");
const bookingService = new BookingServices();

class BookingController {
  constructor() {}

  async sendMessageToQueue(req, res) {
    const channel = await createChannel();
    const payload = {
      data: {
        subject: "This is the notification from queue ",
        content: "This is the some Content from queue",
        recipientEmail: "devanandrana168@gmail.com",
        notificationTime: "2024-07-26T19:58:32.202Z",
      },
      service: "CREATE_TICKET",
    };
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
    return res.status(StatusCodes.OK).json({
      message: "Message sent to queue",
    });
  }
  async create(req, res) {
    try {
      const response = await bookingService.createBooking(req.body);
      return res.status(StatusCodes.OK).json({
        data: response,
        message: "Booking created successfully",
        success: true,
        err: {},
      });
    } catch (error) {
      return res.status(500).json({
        data: {},
        message: error.message,
        success: false,
        err: error.explanation,
      });
    }
  }
}

module.exports = BookingController;
