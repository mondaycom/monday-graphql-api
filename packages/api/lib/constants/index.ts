export enum AvailableVersions {
  DEPRECATED = 'deprecated',
  STABLE = 'stable',
  PREVIEW = 'preview',
}

export const defaultVersion = AvailableVersions.STABLE;

export type ApiVersionType = AvailableVersions | string;

export type QueryVariables = Record<string, any>;
