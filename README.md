# @lacolaco/style-guide-mcp

This project is a Model Context Protocol (MCP) server which provides coding style guide for developers.
It allows developers to adhere to best practices and maintain consistency in their code.

> [!NOTE]
> This project is a work for personal learning purposes and is not intended for production use.
> No warranty is provided.

## Available Tools

- **typescript-style-guide**: Returns the [Google TypeScript Style Guide][] in Markdown format.
- **angular-style-guide**: Returns the full [Angular Style Guide][] in Markdown format.

[Google TypeScript Style Guide]: https://google.github.io/styleguide/tsguide.html
[Angular Style Guide]: https://angular.dev/style-guide

## Installation

`style-guide-mcp` command line tool is available as an npm package. You can install it globally using the following command:

```bash
# Resolve @lacolaco scope package from GitHub Packages
npm_config_@lacolaco:registry=https://npm.pkg.github.com/

# npm
npm install -g @lacolaco/style-guide-mcp

# pnpm
pnpm add -g @lacolaco/style-guide-mcp
```

**mcp.json** (after global installation)

```json
{
  "servers": {
    "style-guide-mcp": {
      "type": "stdio",
      "command": "style-guide-mcp"
    }
  }
}
```

Or, you can also install it with npx in MCP server setting (see below).

**mcp.json** (without global installation)

```json
{
  "servers": {
    "style-guide-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["--package", "@lacolaco/style-guide-mcp", "style-guide-mcp"],
      "env": {
        "npm_config_@lacolaco:registry": "https://npm.pkg.github.com/"
      }
    }
  }
}
```

### Example Prompt

```plaintext
Refactor the code to follow #typescript-style-guide.
```

## Development

### Run in Development Mode

Use the following command to start the server in watch mode:

```bash
pnpm dev
```

## Contributing

Contributions are welcome! Please follow the steps below:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
