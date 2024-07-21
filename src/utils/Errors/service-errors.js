const { StatusCodes } = require("http-status-codes");

class ServiceError extends Error {
  constructor(
    message = "Something went wrong",
    explanation = "Service layer error",
    StatusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    this.name = "ServiceError";
    this.message = message;
    this.explanation = explanation;
    this.statusCode = StatusCode;
  }
}

module.exports = ServiceError;
