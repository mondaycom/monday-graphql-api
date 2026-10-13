export class SeamlessApiClientError extends Error {
  response: { errors: any; data?: any; extensions?: any; headers?: Record<string, string> };
  type: string;

  constructor(message: string, errors: any, data?: any, extensions?: any, headers?: Record<string, string>) {
    super(message);
    // Restores the prototype chain under the ES5 build so `instanceof SeamlessApiClientError` works.
    Object.setPrototypeOf(this, new.target.prototype);
    this.response = { errors, data, extensions, headers };
    this.name = this.constructor.name;
    this.type = 'SeamlessApiClientError';
  }
}
