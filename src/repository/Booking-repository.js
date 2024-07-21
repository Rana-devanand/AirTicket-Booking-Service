const { StatusCodes } = require("http-status-codes");
const { ValidationError, AppError } = require("../utils/index");
const Booking = require("../models/index");

class BookingRepository extends Booking {
  async create(data) {
    try {
      const booking = await Booking.create(data);
      return booking;
    } catch (error) {
      if (error.name == "SequelizeValidationError") {
        throw new ValidationError(error);
      }

      throw new AppError(
        "RepositoryError",
        "Cannot create a booking ",
        "There was an error creating the booking ",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = BookingRepository;
