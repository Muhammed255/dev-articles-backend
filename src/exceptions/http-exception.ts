import createHttpError from "http-errors";
import { HTTPStatusCode } from "../enum/http-status-code.enum";

export class BadRequestException {
  constructor(message = 'Bad Request') {
    throw createHttpError(HTTPStatusCode.BadRequest, message);
  }
}

export class BadGatewayException {
  constructor(message = 'Internal Server Error') {
    throw createHttpError(HTTPStatusCode.InternalServerError, message);
  }
}

export class NotFoundException {
  constructor(message = 'Not Found') {
    throw createHttpError(HTTPStatusCode.NotFound, message);
  }
}