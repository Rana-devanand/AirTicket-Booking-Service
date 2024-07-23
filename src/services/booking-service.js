const axios = require("axios");
const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");
const { BookingRepository } = require("../repository/index");
const { ServiceError } = require("../utils/index");
const { StatusCodes } = require("http-status-codes");

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }
  async createBooking(data) {
    try {
      // console.log(data);
      const flightId = data.flightId;
      const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
      const flight = await axios.get(getFlightRequestURL);
      const flightData = flight.data.data;
      const priceOfTheFlight = flightData.Price;

      if (data.noOfSeats > flightData.totalSeats) {
        throw new ServiceError(
          "Something went wrong in Booking Process",
          "Not enough seats available",
          StatusCodes.BAD_REQUEST
        );
      }
      const totalCost = priceOfTheFlight * data.noOfSeats;
      const bookingPayload = { ...data, totalCost };
      const booking = await this.bookingRepository.create(bookingPayload);

      const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
      const leftFlightSeat = flightData.TotalSeats - booking.noOfSeats;
      await axios.patch(updateFlightRequestURL, {
        TotalSeats: leftFlightSeat,
      });
      //  Now after  booking the flight we will update the flight status .
      const updateBookingStatus = await this.bookingRepository.update(
        booking.id,
        {
          status: "Booked",
        }
      );

      return updateBookingStatus;
    } catch (error) {
      // console.log(error);
      if (error.name == "RepositoryError" || error.name == "ValidationError") {
        throw error;
      }

      throw new ServiceError();
    }
  }
}

module.exports = BookingService;
