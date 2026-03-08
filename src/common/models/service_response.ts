import { StatusCodes } from "http-status-codes";

export type ServiceResponseSchema<T> = {
  message: string;
  status: string;
  statusCode: number;
  data: T;
};

export class ServiceResponse {
  static success<T>(
    message: string,
    data: T,
    statusCode: number = StatusCodes.OK,
  ): ServiceResponseSchema<T> {
    return { message, status: "success", statusCode, data };
  }

  static failure<T>(
    message: string,
    data: T,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
  ): ServiceResponseSchema<T> {
    return { message, status: "error", statusCode, data };
  }
}
