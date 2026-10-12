import { SeamlessApiClient } from '../lib/api-client/seamless-api-client';
import { DEFAULT_VERSION } from '../lib/constants';

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
});
