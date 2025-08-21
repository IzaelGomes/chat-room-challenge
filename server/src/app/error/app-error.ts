export class AppError extends Error {
  private statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }

  get getErrorInfo(): { message: string; statusCode: number } {
    return {
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}
