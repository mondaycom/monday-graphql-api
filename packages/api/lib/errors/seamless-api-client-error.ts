export class SeamlessApiClientError extends Error {
  response: { errors: any };
  type: string;

  constructor(message: string, errors: any) {
    super(message);
    this.response = { errors };
    this.name = this.constructor.name;
    this.type = 'SeamlessApiClientError';
  }
}
