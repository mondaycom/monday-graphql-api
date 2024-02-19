export enum AvailableVersions {
  DEPRECATED = 'deprecated',
  MAINTENANCE = 'maintenance',
  CURRENT = 'current',
  RELEASE_CANDIDATE = 'release_candidate',
  DEV = 'dev',
}

export const defaultVersion = AvailableVersions.CURRENT;

export type ApiVersionType = AvailableVersions | string;

export type QueryVariables = Record<string, any>;