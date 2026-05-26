import { getComplexityFromResponse } from '../../lib/helpers/rate-limit';

describe('getComplexityFromResponse', () => {
  it('should extract complexity info from response extensions', () => {
    const response = {
      extensions: {
        complexity: {
          before: 10000000,
          after: 9999500,
          query: 500,
          reset_in_x_seconds: 30,
        },
      },
    };

    const result = getComplexityFromResponse(response);
    expect(result).toEqual({
      before: 10000000,
      after: 9999500,
      query: 500,
      resetInSeconds: 30,
    });
  });

  it('should return null when no extensions', () => {
    expect(getComplexityFromResponse({})).toBeNull();
  });

  it('should return null when no complexity in extensions', () => {
    expect(getComplexityFromResponse({ extensions: {} })).toBeNull();
  });
});
