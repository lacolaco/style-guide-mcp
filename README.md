# Angular Style Guide MCP

This project provides a Model Context Protocol (MCP) server for the Angular Style Guide. It offers tools to retrieve and interact with the Google TypeScript Style Guide.

## Features

- **Get Style Guide Categories**: Retrieve a list of categories from the Google TypeScript Style Guide.
- **Get Style Guide Content**: Fetch detailed content for a specific category from the style guide.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd angular-style-guide-mcp
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

Run the following command to start the MCP server:
```bash
node build/index.js
```

### Available Tools

1. **get_style_guide_categories**
   - Description: Returns a list of categories from the Google TypeScript Style Guide.
   - Input: None

2. **get_style_guide_content**
   - Description: Returns the content of a specific category from the style guide.
   - Input:
     - `category` (string): The name of the category to fetch.

## Development

### Run in Development Mode

Use the following command to start the server in watch mode:
```bash
pnpm dev
```

### Code Style

This project follows the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html).

## Contributing

Contributions are welcome! Please follow the steps below:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.