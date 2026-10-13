import { SeamlessApiClient } from '../lib/api-client/seamless-api-client';
import { DEFAULT_VERSION } from '../lib/constants';
import { SeamlessApiClientError } from '../lib/errors/seamless-api-client-error';

describe('SeamlessApiClient', () => {
  let postMessage: jest.Mock;
  let messageListener: (event: { data: any }) => void;

  beforeEach(() => {
    jest.useFakeTimers();
    postMessage = jest.fn();
    (global as any).window = {
      parent: { postMessage },
      addEventListener: jest.fn((_type: string, listener: (event: { data: any }) => void) => {
        messageListener = listener;
      }),
    };
  });

  afterEach(() => {
    jest.useRealTimers();
    delete (global as any).window;
  });

  const lastMessage = () => postMessage.mock.calls[postMessage.mock.calls.length - 1][0];

  const respond = (data: Record<string, unknown>) => {
    messageListener({ data: { requestId: lastMessage().requestId, ...data } });
  };

  it('sends no headers when none are given', () => {
    const client = new SeamlessApiClient();
    client.request('query { me { id } }');

    expect(lastMessage().args).toEqual({
      params: { query: 'query { me { id } }', variables: undefined },
      apiVersion: DEFAULT_VERSION,
    });
  });

  it('keeps the positional version and timeout arguments working', async () => {
    const client = new SeamlessApiClient();
    const promise = client.request('query { me { id } }', undefined, '2025-01', 1000);

    expect(lastMessage().args.apiVersion).toBe('2025-01');
    expect(lastMessage().args.headers).toBeUndefined();

    jest.advanceTimersByTime(1000);
    await expect(promise).rejects.toThrow('Request timed out');
  });

  it('accepts an options object with versionOverride and timeoutMs', async () => {
    const client = new SeamlessApiClient();
    const promise = client.request('query { me { id } }', undefined, { versionOverride: '2025-04', timeoutMs: 500 });

    expect(lastMessage().args.apiVersion).toBe('2025-04');

    jest.advanceTimersByTime(500);
    await expect(promise).rejects.toThrow('Request timed out');
  });

  it('sends idempotencyKey as the Idempotency-Key header', async () => {
    const client = new SeamlessApiClient();
    const promise = client.request('mutation { create_item }', undefined, { idempotencyKey: 'key-1' });

    expect(lastMessage()).toEqual(
      expect.objectContaining({
        method: 'api',
        args: expect.objectContaining({ headers: { 'Idempotency-Key': 'key-1' } }),
      }),
    );

    respond({ data: { create_item: { id: '1' } } });
    await expect(promise).resolves.toEqual(expect.objectContaining({ data: { create_item: { id: '1' } } }));
  });

  it('sends custom headers', () => {
    const client = new SeamlessApiClient();
    client.request('query { me { id } }', undefined, { headers: { 'X-Custom': 'value' } });

    expect(lastMessage().args.headers).toEqual({ 'X-Custom': 'value' });
  });

  it('lets idempotencyKey win over an Idempotency-Key header of any casing', () => {
    const client = new SeamlessApiClient();
    client.request('mutation { create_item }', undefined, {
      headers: { 'idempotency-key': 'from-headers', 'X-Custom': 'value' },
      idempotencyKey: 'from-option',
    });

    expect(lastMessage().args.headers).toEqual({ 'X-Custom': 'value', 'Idempotency-Key': 'from-option' });
  });

  it('rejects an empty idempotencyKey without sending the request', async () => {
    const client = new SeamlessApiClient();
    const promise = client.request('mutation { create_item }', undefined, { idempotencyKey: '' });

    await expect(promise).rejects.toThrow('idempotencyKey must not be empty');
    expect(postMessage).not.toHaveBeenCalled();
  });

  it('falls back to the 60s default when timeoutMs is omitted from the options object', async () => {
    const client = new SeamlessApiClient();
    const promise = client.request('query { me { id } }', undefined, { idempotencyKey: 'key-1' });
    const onRejected = jest.fn();
    promise.catch(onRejected);

    await jest.advanceTimersByTimeAsync(59999);
    expect(onRejected).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1);
    expect(onRejected).toHaveBeenCalledWith(expect.objectContaining({ message: 'Request timed out' }));
  });

  describe('error replies', () => {
    const errorReply = {
      errorMessage: 'Graphql validation errors',
      data: { errors: [{ message: 'e' }], data: { me: { id: '1' } }, extensions: { request_id: 'r' } },
      headers: { ratelimit: 'x' },
    };

    it('rejects with a SeamlessApiClientError carrying errors, data, extensions and headers', async () => {
      const client = new SeamlessApiClient();
      const promise = client.request('query { me { id } }');
      respond(errorReply);

      const error: any = await promise.catch((e) => e);
      expect(error).toBeInstanceOf(SeamlessApiClientError);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('SeamlessApiClientError');
      expect(error.type).toBe('SeamlessApiClientError');
      expect(error.message).toBe('Graphql validation errors');
      expect(error.response).toEqual({
        errors: [{ message: 'e' }],
        data: { me: { id: '1' } },
        extensions: { request_id: 'r' },
        headers: expect.any(Headers),
      });
      expect(error.response.headers.get('RateLimit')).toBe('x');
    });

    it('works with instanceof when constructed directly', () => {
      const error = new SeamlessApiClientError('m', []);
      expect(error instanceof SeamlessApiClientError).toBe(true);
      expect(error instanceof Error).toBe(true);
      expect(error.name).toBe('SeamlessApiClientError');
    });

    it('resolves partial data without errors with errorPolicy ignore', async () => {
      const client = new SeamlessApiClient(undefined, { errorPolicy: 'ignore' });
      const promise = client.request<any>('query { me { id } }');
      respond(errorReply);

      const res = await promise;
      expect(res.data).toEqual({ data: { me: { id: '1' } }, extensions: { request_id: 'r' } });
      expect(res).not.toHaveProperty('errorMessage');
      expect(res.headers.get('RateLimit')).toBe('x');
    });

    it('resolves partial data and errors with errorPolicy all', async () => {
      const client = new SeamlessApiClient(undefined, { errorPolicy: 'all' });
      const promise = client.request<any>('query { me { id } }');
      respond(errorReply);

      const res = await promise;
      expect(res.data).toEqual(errorReply.data);
      expect(res).not.toHaveProperty('errorMessage');
    });

    it('lets a per-request errorPolicy override the client one', async () => {
      const client = new SeamlessApiClient(undefined, { errorPolicy: 'ignore' });

      const all = client.request<any>('query { me { id } }', undefined, { errorPolicy: 'all' });
      respond(errorReply);
      expect((await all).data).toEqual(errorReply.data);

      const none = new SeamlessApiClient(undefined, { errorPolicy: 'all' }).request('query { me { id } }', undefined, {
        errorPolicy: 'none',
      });
      respond(errorReply);
      await expect(none).rejects.toBeInstanceOf(SeamlessApiClientError);
    });

    it.each(['ignore', 'all'] as const)(
      'still rejects host errors with no GraphQL errors (errorPolicy %s)',
      async (errorPolicy) => {
        const client = new SeamlessApiClient(undefined, { errorPolicy });

        const noBody = client.request('query { me { id } }');
        respond({ errorMessage: 'Missing query parameter' });
        await expect(noBody).rejects.toBeInstanceOf(SeamlessApiClientError);

        const emptyErrors = client.request('query { me { id } }');
        respond({ errorMessage: 'Graphql validation errors', data: { errors: [] } });
        await expect(emptyErrors).rejects.toBeInstanceOf(SeamlessApiClientError);
      },
    );

    it('resolves success replies with forwarded headers', async () => {
      const client = new SeamlessApiClient();
      const promise = client.request<any>('query { me { id } }');
      respond({ data: { data: { me: { id: '1' } } }, headers: { ratelimit: 'x' } });

      const res = await promise;
      expect(res.data.data.me.id).toBe('1');
      expect(res.headers.get('RateLimit')).toBe('x');
    });
  });
});
