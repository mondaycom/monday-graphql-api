export enum AvailableVersions {
  DEPRECATED = 'deprecated',
  MAINTENANCE = 'maintenance',
  CURRENT = 'current',
  RELEASE_CANDIDATE = 'release_candidate',
  DEV = 'dev',
  CURRENT_VERSION = '2024-04',
}

export const MONDAY_API_ENDPOINT = 'https://api.monday.com/v2';

export const DEFAULT_VERSION = AvailableVersions.CURRENT_VERSION;

export type ApiVersionType = AvailableVersions | string;

export type QueryVariables = Record<string, any>;
