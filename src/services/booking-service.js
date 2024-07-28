const axios = require("axios");
const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");
const { BookingRepository } = require("../repository/index");
const { ServiceError } = require("../utils/index");
const { StatusCodes } = require("http-status-codes");

const { createChannel, publishMessage } = require("../utils/messageQueue");
const { REMINDER_BINDING_KEY } = require("../config/serverConfig");

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }
  async createBooking(data) {
    try {
      // flight data
      const flightId = data.flightId;
      const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
      const flight = await axios.get(getFlightRequestURL);
      const flightData = flight.data.data;

      // Departure Airport data
      const getAirportDepartureData = `${FLIGHT_SERVICE_PATH}/api/v1/airport/${flightData.departureAirportId}`;
      const DepartureAirportName = await axios.get(getAirportDepartureData);

      //  Arrival Airport Data
      const getAirportArrivalData = `${FLIGHT_SERVICE_PATH}/api/v1/airport/${flightData.arrivalAirportId}`;
      const ArrivalAirportName = await axios.get(getAirportArrivalData);

      // Departure city data
      const DepartureCityData = `${FLIGHT_SERVICE_PATH}/api/v1/city/${DepartureAirportName.data.data.cityId}`;
      const DepartureCity = await axios.get(DepartureCityData);

      // // Departure city data
      const ArrivalCityData = `${FLIGHT_SERVICE_PATH}/api/v1/city/${ArrivalAirportName.data.data.cityId}`;
      const ArrivalCity = await axios.get(ArrivalCityData);

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

      // console.log(flightData);
      // console.log(flightData.FlightNumber);
      // console.log("DepartureAirportName:", DepartureAirportName.data.data.name); // done
      // console.log("ArrivalAirportName:", ArrivalAirportName.data.data.name); // done
      // console.log("DepartureCity  >", DepartureCity.data.data.name);
      // console.log("Arrival City > ", ArrivalCity.data.data.name);
      // console.log(booking.dataValues.status);
      // console.log(booking.dataValues.totalCost);
      // console.log(booking.dataValues.noOfSeats);

      const departureAirportName = DepartureAirportName.data.data.name;
      const arrivalAirportName = ArrivalAirportName.data.data.name;

      const departureCityName = DepartureCity.data.data.name;
      const arrivalCityName = ArrivalCity.data.data.name;
      const flightNumber = flightData.FlightNumber;

      const departureTime = flightData.departureTime.toString();
      const arrivalTime = flightData.arrivalTime.toString();
      // const bookingStatus = booking.dataValues.status;
      const flightTotalCost = booking.dataValues.totalCost;
      const totalNumberOfSeats = booking.dataValues.noOfSeats;

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
      const payload = {
        data: {
          subject: ` Your booking has been ${updateBookingStatus.status}`,
          content: `Your ticket is : ${updateBookingStatus.status}. \n Your Flight Number :  ${flightNumber}. \n You Booked total  ${totalNumberOfSeats}  seats. \nYour Total FLight cost is \n ${flightTotalCost}. \n Your flight Departure airport name :  ${departureAirportName} , Your flight Arrival airport name : ${arrivalAirportName} . Your Journey start : ${departureCityName} to  ${arrivalCityName} . \n Your flight Departure Time  ${departureTime} . Expected Arrival time  ${arrivalTime} . \n\n HAPPY JOURNEY 😊...`,

          recipientEmail: "devanandrana168@gmail.com",
          notificationTime: "2024-07-28T07:00:32.039Z",
        },
        service: "CREATE_TICKET",
      };
      const channel = await createChannel();
      publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));

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
