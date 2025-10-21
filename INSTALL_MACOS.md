# Quick Install for macOS

## Automated Installation (Recommended)

Run this single command in Terminal:

```bash
cd /Users/colinforrester/hospitable-python
chmod +x install_mcp_macos.sh
./install_mcp_macos.sh
```

The script will:
1. ✓ Find your Python installation
2. ✓ Upgrade pip
3. ✓ Install all dependencies (including MCP SDK)
4. ✓ Install the Hospitable SDK
5. ✓ Generate Claude Desktop configuration
6. ✓ Test the server (optional)

## After Installation

1. **Edit the config file** to add your Hospitable PAT:
   ```bash
   code ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

2. **Replace `YOUR_TOKEN_HERE`** with your actual Hospitable Personal Access Token

3. **Restart Claude Desktop** (Cmd+Q to quit, then reopen)

4. **Test it** by asking Claude:
   > "Can you list my Hospitable properties?"

## Manual Installation

If you prefer to install manually, see [CLAUDE_DESKTOP_SETUP.md](./CLAUDE_DESKTOP_SETUP.md)

## What You'll Be Able to Do

Once installed, you can ask Claude in natural language to:

- **List properties**: "Show me all my properties"
- **Get property details**: "What are the details for my property in Miami?"
- **View reservations**: "Show me upcoming reservations for this week"
- **Search availability**: "Are any of my properties available from June 1-7?"
- **Manage messages**: "Show me recent messages from guests"
- **Handle reviews**: "Are there any reviews I need to respond to?"

## Troubleshooting

### "Spawn python Enoent" error
- Make sure you ran the installation script
- The config must have full paths (not just `python3`)
- Example: `/usr/bin/python3` not `python3`

### "Module not found: mcp"
- Run: `pip3 install git+https://github.com/modelcontextprotocol/python-sdk.git`

### "Module not found: hospitable"
- Run: `cd /Users/colinforrester/hospitable-python && pip3 install -e .`

### API returns 403 errors
- Verify your token is correct in the config
- Your token should be the same one that works with Data Fetcher

### Still not working?
- Check Claude Desktop logs
- Test manually: `HOSPITABLE_PAT=yourtoken /usr/bin/python3 /Users/colinforrester/hospitable-python/mcp_server.py`

## Your Installation Paths

Based on your system:
- **Python**: `/usr/bin/python3`
- **Project**: `/Users/colinforrester/hospitable-python`
- **MCP Server**: `/Users/colinforrester/hospitable-python/mcp_server.py`
- **Config**: `~/Library/Application Support/Claude/claude_desktop_config.json`

## Getting Help

For issues, check:
1. The installation script output
2. [CLAUDE_DESKTOP_SETUP.md](./CLAUDE_DESKTOP_SETUP.md) for detailed setup
3. [MCP_SERVER.md](./MCP_SERVER.md) for MCP server documentation
