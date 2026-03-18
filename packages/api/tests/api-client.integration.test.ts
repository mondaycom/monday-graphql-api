import {
  createMockAgentContext,
  setupMockAgent,
  teardownMockAgent,
  createMockedApiClient,
  mockGraphQLResponse,
  MockAgentContext,
  MONDAY_API_ORIGIN,
  MONDAY_API_SUFFIX,
  JSON_HEADERS,
} from './test-utils';

describe('ApiClient timeout integration', () => {
  const ctx = createMockAgentContext();

  beforeEach(() => {
    setupMockAgent(ctx);
  });

  afterEach(async () => {
    await teardownMockAgent(ctx);
  });

  describe('request method', () => {
    it('should abort request when timeout is exceeded', async () => {
      mockGraphQLResponse(ctx.mockAgent, { users: [] }, { delay: 2000 });

      const apiClient = createMockedApiClient(ctx.mockAgent);
      const query = '{ users { id } }';

      await expect(apiClient.request(query, undefined, { timeoutMs: 100 })).rejects.toThrow('This operation was aborted');
    });

    it('should complete successfully when response arrives before timeout', async () => {
      mockGraphQLResponse(ctx.mockAgent, { users: [{ id: '1' }] });

      const apiClient = createMockedApiClient(ctx.mockAgent);
      const query = '{ users { id } }';

      const result = await apiClient.request(query, undefined, { timeoutMs: 500 });
      expect(result).toEqual({ users: [{ id: '1' }] });
    });

    it('should work without timeout option', async () => {
      mockGraphQLResponse(ctx.mockAgent, { users: [{ id: '1', name: 'John' }] });

      const apiClient = createMockedApiClient(ctx.mockAgent);
      const query = '{ users { id name } }';

      const result = await apiClient.request(query);
      expect(result).toEqual({ users: [{ id: '1', name: 'John' }] });
    });
  });

  describe('rawRequest method', () => {
    it('should abort rawRequest when timeout is exceeded', async () => {
      mockGraphQLResponse(ctx.mockAgent, { users: [] }, { delay: 2000 });

      const apiClient = createMockedApiClient(ctx.mockAgent);
      const query = '{ users { id } }';

      await expect(apiClient.rawRequest(query, undefined, { timeoutMs: 100 })).rejects.toThrow('This operation was aborted');
    });

    it('should complete rawRequest successfully when response arrives before timeout', async () => {
      mockGraphQLResponse(ctx.mockAgent, { users: [{ id: '1' }] });

      const apiClient = createMockedApiClient(ctx.mockAgent);
      const query = '{ users { id } }';

      const result = await apiClient.rawRequest(query, undefined, { timeoutMs: 500 });
      expect(result.data).toEqual({ users: [{ id: '1' }] });
    });
  });
});

describe('ApiClient file upload integration', () => {
  const ctx = createMockAgentContext();

  beforeEach(() => {
    setupMockAgent(ctx);
  });

  afterEach(async () => {
    await teardownMockAgent(ctx);
  });

  // Helper to create ApiClient with request capture for file upload tests
  const createApiClientWithCapture = () => {
    return createMockedApiClient(ctx.mockAgent, {
      captureRequest: ctx.setCapturedRequest,
    });
  };

  describe('multipart form data conversion', () => {
    it('should convert request with single file to multipart/form-data', async () => {
      mockGraphQLResponse(ctx.mockAgent, { add_file_to_column: { id: '123' } });

      const apiClient = createApiClientWithCapture();
      const query = `mutation ($file: File!) { add_file_to_column(file: $file, item_id: 123, column_id: "files") { id } }`;
      const file = new Blob(['test file content'], { type: 'text/plain' });

      await apiClient.request(query, { file });

      // Verify request was converted to FormData
      expect(ctx.capturedRequest).not.toBeNull();
      expect(ctx.capturedRequest!.body).toBeInstanceOf(FormData);

      const formData = ctx.capturedRequest!.body as FormData;

      // Verify FormData structure
      expect(formData.get('query')).toBe(query);

      const variables = JSON.parse(formData.get('variables') as string);
      expect(variables).toEqual({ file: null }); // File replaced with null

      const map = JSON.parse(formData.get('map') as string);
      expect(map).toEqual({ '0': ['variables.file'] });

      expect(formData.get('0')).toBeInstanceOf(Blob);
    });

    it('should convert request with multiple files in array to multipart/form-data', async () => {
      mockGraphQLResponse(ctx.mockAgent, { upload_files: { success: true } });

      const apiClient = createApiClientWithCapture();
      const query = `mutation ($files: [File!]!) { upload_files(files: $files) { success } }`;
      const file1 = new Blob(['file 1 content'], { type: 'text/plain' });
      const file2 = new Blob(['file 2 content'], { type: 'text/plain' });

      await apiClient.request(query, { files: [file1, file2] });

      expect(ctx.capturedRequest).not.toBeNull();
      expect(ctx.capturedRequest!.body).toBeInstanceOf(FormData);

      const formData = ctx.capturedRequest!.body as FormData;

      const variables = JSON.parse(formData.get('variables') as string);
      expect(variables).toEqual({ files: [null, null] }); // Files replaced with null

      const map = JSON.parse(formData.get('map') as string);
      expect(map).toEqual({
        '0': ['variables.files.0'],
        '1': ['variables.files.1'],
      });

      expect(formData.get('0')).toBeInstanceOf(Blob);
      expect(formData.get('1')).toBeInstanceOf(Blob);
    });

    it('should handle nested files in objects', async () => {
      mockGraphQLResponse(ctx.mockAgent, { upload: { id: '456' } });

      const apiClient = createApiClientWithCapture();
      const query = `mutation ($input: UploadInput!) { upload(input: $input) { id } }`;
      const file = new Blob(['nested file'], { type: 'application/pdf' });

      await apiClient.request(query, {
        input: {
          name: 'document',
          attachment: {
            file,
            metadata: { size: 100 },
          },
        },
      });

      expect(ctx.capturedRequest).not.toBeNull();
      expect(ctx.capturedRequest!.body).toBeInstanceOf(FormData);

      const formData = ctx.capturedRequest!.body as FormData;

      const variables = JSON.parse(formData.get('variables') as string);
      expect(variables).toEqual({
        input: {
          name: 'document',
          attachment: {
            file: null,
            metadata: { size: 100 },
          },
        },
      });

      const map = JSON.parse(formData.get('map') as string);
      expect(map).toEqual({ '0': ['variables.input.attachment.file'] });
    });

    it('should remove Content-Type header for multipart requests', async () => {
      mockGraphQLResponse(ctx.mockAgent, { upload: { id: '789' } });

      const apiClient = createApiClientWithCapture();
      const query = `mutation ($file: File!) { upload(file: $file) { id } }`;
      const file = new Blob(['content'], { type: 'text/plain' });

      await apiClient.request(query, { file });

      expect(ctx.capturedRequest).not.toBeNull();
      // Content-Type should be removed to let browser set it with boundary
      expect(ctx.capturedRequest!.headers['Content-Type']).toBeUndefined();
      expect(ctx.capturedRequest!.headers['content-type']).toBeUndefined();
    });

    it('should keep request as JSON when no files are present', async () => {
      mockGraphQLResponse(ctx.mockAgent, { users: [{ id: '1' }] });

      const apiClient = createApiClientWithCapture();
      const query = '{ users { id } }';

      await apiClient.request(query, { limit: 10 });

      expect(ctx.capturedRequest).not.toBeNull();
      // Should remain as string (JSON), not FormData
      expect(typeof ctx.capturedRequest!.body).toBe('string');
      expect(ctx.capturedRequest!.headers['Content-Type']).toBe('application/json');
    });

    it('should work with rawRequest method for file uploads', async () => {
      mockGraphQLResponse(ctx.mockAgent, { add_file_to_column: { id: '999' } });

      const apiClient = createApiClientWithCapture();
      const query = `mutation ($file: File!) { add_file_to_column(file: $file, item_id: 456, column_id: "files") { id } }`;
      const file = new Blob(['raw request file'], { type: 'image/png' });

      const result = await apiClient.rawRequest(query, { file });

      expect(result.data).toEqual({ add_file_to_column: { id: '999' } });
      expect(ctx.capturedRequest!.body).toBeInstanceOf(FormData);
    });

    it('should handle mixed files and regular variables', async () => {
      mockGraphQLResponse(ctx.mockAgent, { create_item: { id: '111' } });

      const apiClient = createApiClientWithCapture();
      const query = `mutation ($name: String!, $file: File!, $tags: [String!]) { create_item(name: $name, file: $file, tags: $tags) { id } }`;
      const file = new Blob(['content'], { type: 'text/plain' });

      await apiClient.request(query, {
        name: 'My Item',
        file,
        tags: ['important', 'urgent'],
      });

      expect(ctx.capturedRequest!.body).toBeInstanceOf(FormData);

      const formData = ctx.capturedRequest!.body as FormData;
      const variables = JSON.parse(formData.get('variables') as string);

      expect(variables).toEqual({
        name: 'My Item',
        file: null,
        tags: ['important', 'urgent'],
      });

      const map = JSON.parse(formData.get('map') as string);
      expect(map).toEqual({ '0': ['variables.file'] });
    });
  });
});
