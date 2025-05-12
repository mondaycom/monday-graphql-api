# Monday GraphQL SDKs Monorepo

This monorepo contains all the packages for the monday.com GraphQL SDKs. Currently, it holds the following packages:

- [@mondaydotcomorg/api](./packages/api) - Our official sdk, used to make api calls
- [@mondaydotcomorg/api-types](./packages/api-types) - Types
- [@mondaydotcomorg/setup-api](./packages/setup-api) - After installing the api, use this to setup typed api environment

## Development

This project uses [Turborepo](https://turbo.build/) for managing the monorepo. Common commands:

```bash
# Build all packages
yarn build

# Run tests
yarn test

# Run development mode
yarn dev
```

## AI-assisted coding

If you're using an LLM to write code, check out the `llm-context` folder for rules you can pass to your agent to help it use the API client package correctly. 

## Usage of generated code

The packages in this monorepo contain files that are generated using monday.com's sdk generator, you will find them inside the `generated` folder of each package.
Contributions to this code are only accepted in files that were not generated. If you think that a change is needed in the generated code, please open an issue and we will look into it.
