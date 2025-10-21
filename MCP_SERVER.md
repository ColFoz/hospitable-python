# Hospitable MCP Server

A Model Context Protocol (MCP) server that exposes the Hospitable Python SDK functionality for use with Claude Desktop and other MCP clients.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that enables AI assistants like Claude to securely connect to external data sources and tools. This MCP server allows Claude Desktop to interact with the Hospitable API directly through natural language.

## Features

The MCP server provides the following tools to Claude Desktop:

### Properties
- **list_properties** - List all properties with pagination
- **get_property** - Get detailed property information
- **search_properties** - Search for available properties by dates, guests, location
- **get_property_calendar** - Get calendar availability and pricing
- **update_property_calendar** - Update calendar dates (availability, pricing, min stay)

### Reservations
- **list_reservations** - List reservations with filters
- **get_reservation** - Get detailed reservation information

### Messages
- **list_messages** - List messages for a reservation
- **send_message** - Send a message to guests

### Reviews
- **list_reviews** - List reviews for a property
- **respond_to_review** - Respond to a review

### User
- **get_user** - Get authenticated user information
- **get_token_info** - Get JWT token information

## Installation

### 1. Install the Package and MCP Dependencies

**Option A: Install with MCP extras (recommended)**
```bash
# Install the SDK with MCP server support
pip install -e ".[mcp]"
```

**Option B: Install from requirements file**
```bash
# Install the Hospitable SDK
pip install -e .

# Install MCP server dependencies
pip install -r requirements-mcp.txt
```

### 2. Get Your Hospitable API Token

You'll need a Hospitable API token (Personal Access Token recommended for testing):

1. Log in to your Hospitable account
2. Go to Settings > API Access
3. Generate a Personal Access Token
4. Copy the token for the next step

### 3. Configure Claude Desktop

Edit your Claude Desktop configuration file to add the MCP server:

**macOS/Linux:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add the following configuration:

```json
{
  "mcpServers": {
    "hospitable": {
      "command": "python",
      "args": [
        "/absolute/path/to/hospitable-python/mcp_server.py"
      ],
      "env": {
        "HOSPITABLE_PAT": "your_personal_access_token_here"
      }
    }
  }
}
```

**Important:**
- Replace `/absolute/path/to/hospitable-python/mcp_server.py` with the actual absolute path to the MCP server file
- Replace `your_personal_access_token_here` with your actual Hospitable token
- On Windows, use forward slashes (/) or escaped backslashes (\\\\) in the path

### 4. Restart Claude Desktop

After saving the configuration file, restart Claude Desktop completely (quit and reopen the application).

## Usage Examples

Once configured, you can interact with the Hospitable API through natural language in Claude Desktop:

### Example Conversations

**List Properties:**
```
"Show me all my properties"
```

**Search for Available Properties:**
```
"Find properties available from December 1-7, 2024 for 2 adults and 1 child"
```

**Get Reservations:**
```
"Show me all reservations for property <uuid> in January 2025"
```

**Send a Message:**
```
"Send a message to the guest in reservation <uuid> saying 'Welcome! Check-in is at 3pm.'"
```

**Get Reviews:**
```
"Show me recent reviews for my property <uuid>"
```

**Update Calendar:**
```
"Block December 25-26, 2024 on property <uuid> and mark them as unavailable"
```

## Troubleshooting

### Server Not Appearing

1. **Check the configuration file syntax** - Ensure valid JSON (no trailing commas, proper quotes)
2. **Verify the file path** - Make sure the path to `mcp_server.py` is absolute and correct
3. **Check Python installation** - Ensure Python 3.8+ is available in your PATH
4. **View Claude Desktop logs**:
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\Logs\`

### Authentication Errors

1. **Verify your token** - Make sure the `HOSPITABLE_PAT` environment variable is set correctly
2. **Check token validity** - Ensure your token hasn't expired
3. **Test the token** - Run the example.py script to verify the token works:
   ```bash
   HOSPITABLE_PAT=your_token python example.py
   ```

### Rate Limits

The Hospitable API has rate limits:
- Messages: 2 per minute per reservation, 50 per 5 minutes globally
- Other endpoints: Check the API documentation

The MCP server will return clear error messages if you hit rate limits.

## Environment Variables

The server supports these environment variables for authentication:

- `HOSPITABLE_PAT` - Personal Access Token (recommended)
- `HOSPITABLE_TOKEN` - Alternative token variable

Set these in the Claude Desktop configuration file as shown above.

## Development

### Running the Server Standalone

For testing, you can run the MCP server standalone:

```bash
HOSPITABLE_PAT=your_token python mcp_server.py
```

This will start the server in stdio mode, waiting for MCP protocol messages.

### Adding New Tools

To add new tools to the MCP server:

1. Add the tool definition in the `list_tools()` function
2. Add the tool handler in the `call_tool()` function
3. Test with Claude Desktop

## Security Notes

- Never commit your API tokens to version control
- Use environment variables for sensitive credentials
- The MCP server runs locally and communicates only with the Hospitable API
- Your token is never sent to Anthropic or Claude

## API Reference

For detailed information about the Hospitable API:
- [Hospitable API Documentation](https://developer.hospitable.com/docs/public-api-docs/)
- [SDK Documentation](./docs/README.md)
- [API Changelog](./API_CHANGELOG.md)

## Support

For issues or questions:
- Hospitable SDK: [GitHub Issues](https://github.com/your-username/hospitable-python/issues)
- MCP Protocol: [MCP Documentation](https://modelcontextprotocol.io/)
- Claude Desktop: [Anthropic Support](https://support.anthropic.com/)

## License

MIT License - see [LICENSE](./LICENSE) file for details.
