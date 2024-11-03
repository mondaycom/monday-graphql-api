# Changelog

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
