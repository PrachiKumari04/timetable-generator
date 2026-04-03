class ApiError extends Error {
  constructor(
    statusCode,
    message = "Somthing went wrong",
    errors = [],
    data = null,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.data = data;
    this.errors = errors;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
  
  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
  static unAuthorized(message, errors = []) {
    return new ApiError(401, message, errors);
  }
  static forbidden(message, errors = []) {
    return new ApiError(403, message, errors);
  }
  static notFound(message, errors = []) {
    return new ApiError(404, message, errors);
  }

  static internalServerError(message, errors = []) {
    return new ApiError(500, message, errors, null);
  }

  
}
export { ApiError };