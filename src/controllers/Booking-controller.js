const { StatusCodes } = require("http-status-codes");
const { BookingServices } = require("../services/index");

const bookingService = new BookingServices();

const create = async (req, res) => {
  try {
    const response = await bookingService.createBooking(req.body);
    console.log("from controller ", response);
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
};

module.exports = {
  create,
};
