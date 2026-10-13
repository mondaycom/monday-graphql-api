export class SeamlessApiClientError extends Error {
  response: { errors: any; data?: any; extensions?: any; headers?: Headers };
  type: string;

  constructor(message: string, errors: any, data?: any, extensions?: any, headers?: Headers) {
    super(message);
    // Restores the prototype chain under the ES5 build so `instanceof SeamlessApiClientError` works.
    Object.setPrototypeOf(this, new.target.prototype);
    this.response = { errors, data, extensions, headers };
    // A literal, because minified builds mangle `constructor.name`.
    this.name = 'SeamlessApiClientError';
    this.type = 'SeamlessApiClientError';
  }
}
