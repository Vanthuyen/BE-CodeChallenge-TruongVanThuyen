export class BadRequestException extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestException';
    this.status = 400;
  }
}

export class NotFoundException extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundException';
    this.status = 404;
  }
}

export class ConflictException extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'ConflictException';
    this.status = 409;
  }
}
