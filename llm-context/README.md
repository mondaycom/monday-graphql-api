# Context & Documentation for AI-assisted coding

This package contains context and rules for LLM-assisted coding. 

With context, an LLM is more likely to write correct code. Without it, they may write nonsensical GraphQL queries or use the monday API client in the wrong way. 

The context comes in two files:
- graphql-api-best-practices: Sample queries to write good (performant and correct) API queries and mutations.
- api-client-best-practices: Instructions & boilerplate for using the API client to make requests. 

Each context file is a markdown file with some YAML front matter. The rules are split by topic to prevent LLM confusion. 

## Installation

You can copy these directly or clone the subdirectory using degit. 
```
npx degit https://github.com/mondaycom/monday-graphql-api/packages/llm-context/api
```

Clone into a subdirectory: 
```
npx degit https://github.com/mondaycom/monday-graphql-api/packages/llm-context/api .cursor/rules
```

## Usage with Cursor

1. Copy the files into `.cursor/rules` directory (project rules)
2. Add the files to Cursor's context by @mentioning them in the Cursor chat window (recommended). 

[Cursor Project Rules Documentation](https://docs.cursor.com/context/rules#project-rules)

## Usage with Copilot

1. Copy the files into a project-level context folder
2. Attach the relevant file (or all of them) to your query with #mention

[Copilot Chat Context Documentation](https://code.visualstudio.com/docs/copilot/chat/copilot-chat-context)