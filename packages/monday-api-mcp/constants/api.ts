// Define service URL configurations by environment

export enum ServiceType {
  Dona = 'dona',
  GraphRag = 'graphrag',
  OrgBot = 'org-bot',
}

type EnvironmentType = 'development' | 'production';
type EnvironmentConfig = Record<ServiceType, string>;

const environments: Record<EnvironmentType, EnvironmentConfig> = {
  development: {
    [ServiceType.Dona]: 'http://localhost:3036',
    [ServiceType.GraphRag]: 'http://localhost:3030',
    [ServiceType.OrgBot]: 'http://localhost:3032',
  },
  production: {
    [ServiceType.Dona]: 'https://dona.test.me',
    [ServiceType.GraphRag]: 'https://graphrag.test.me',
    [ServiceType.OrgBot]: 'https://org-bot.test.me',
  },
};

// Map NODE_ENV values to our environment keys
const ENV_MAPPING: Record<string, EnvironmentType> = {
  dev: 'development',
  development: 'development',
  prod: 'production',
  production: 'production',
};

// Get current environment with fallback to development
const currentEnv = ENV_MAPPING[process.env.NODE_ENV || ''] || 'development';
export const urls = environments[currentEnv];
