export class AppError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status
    };
  }
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
} 