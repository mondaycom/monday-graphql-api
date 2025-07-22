# Changelog

## [11.0.0]

### ⚠️ Breaking Changes

- **Default API version updated**: The default API version is now `2025-07`

### Added

- **API version override capability**: Added the ability to override the API version per request using the `versionOverride` option in `RequestOptions`. This can be passed to both `request` and `rawRequest` methods. This allows using the same API client for different versions.

## [7.0.0]

### ⚠️ Breaking Changes

- **SeamlessApiClient error type**: The `SeamlessApiClient` class now aligns its error format with the ApiClient class. Errors are now nested under response.errors. Use the SeamlessApiClientError type provided by the package to handle these errors.

## [6.0.0]

### ⚠️ Breaking Changes

- **ApiClient data format changed**: The `ApiClient` class constructor now expects variables in JSON format instead of params.
- **Method name change**: To call the client, use `request` instead of `query`.

### Added

- **`rawRequest` method**: Allows fetching data in the old format, returning `data`, `errors`, `extensions`...
- **Versions validation**: The client now validates the version of the API it’s interacting with.
- **Enhanced request configuration**: The `ApiClient` class now accepts a `requestConfig` object, allowing for additional customization options.
- **`ClientError` type for error handling**: Introduced the `ClientError` type, providing a structured format for handling errors consistently within the `ApiClient`.

### Fixed

- **GraphQL library dependency**: Resolved an issue where the GraphQL library was sometimes required as a dependency; this is now included by default.
