class ApiResponse {
  constructor(statusCode, data, message = "success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static ok(data, message = "success") {
    return new ApiResponse(200, data, message);
  }

  static accepted(data, message = "success") {
    return new ApiResponse(202, data, message);
  }

  static created(data, message = "success") {
    return new ApiResponse(201, data, message);
  }

}

export { ApiResponse };