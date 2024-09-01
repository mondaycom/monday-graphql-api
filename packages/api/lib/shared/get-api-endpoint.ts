import { MONDAY_API_ENDPOINT } from '../constants/index';

export const getApiEndpoint = (): string => {
  if (process.env.MONDAY_API_ENDPOINT) {
    return process.env.MONDAY_API_ENDPOINT;
  }

  const platformApiSecrets = process.env.PLATFORM_API;
  if (platformApiSecrets) {
    try {
      const platformApiSecretsMap = JSON.parse(platformApiSecrets);
      if (platformApiSecretsMap.PLATFORM_API_ENDPOINT) {
        return platformApiSecretsMap.PLATFORM_API_ENDPOINT;
      }
    } catch (error) {
      console.error('Failed to parse PLATFORM_API_SECRETS', error);
    }
  }

  return MONDAY_API_ENDPOINT;
};
