# @lacolaco/style-guide-mcp

This project is a Model Context Protocol (MCP) server which provides coding style guide for developers.
It allows developers to adhere to best practices and maintain consistency in their code.

## Available Tools

- **typescript-style-guide**: Returns the [Google TypeScript Style Guide][] in Markdown format.
- **angular-style-guide**: Returns the full [Angular Style Guide][] in Markdown format.

[Google TypeScript Style Guide]: https://google.github.io/styleguide/tsguide.html
[Angular Style Guide]: https://angular.dev/style-guide

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd style-guide-mcp
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Build the project:
   ```bash
   pnpm build
   ```

## Usage

### Start the MCP Server

Replace `<cloned directory>` with the path to the cloned repository on your machine.

**mcp.json** (VS Code)

```json
{
  "servers": {
    "style-guide-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["<cloned directory>/build/index.js"],
      "env": {}
    }
  }
}
```

**Cline Setting**

```json
{
  "mcpServers": {
    "style-guide-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["<cloned directory>/build/index.js"],
      "env": {}
    }
  }
}
```

### Example Prompt

**GitHub Copilot Chat** (VS Code)

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
