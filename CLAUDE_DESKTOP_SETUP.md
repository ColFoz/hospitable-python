# Claude Desktop Setup Guide

## Fixing the "Spawn python Enoent" Error

This error means Claude Desktop can't find Python. You need to use **full paths** in your configuration.

## Step 1: Find Your Paths

On your Mac, open Terminal and run:

```bash
# Find your Python path
which python3

# Navigate to the hospitable-python directory  
cd /path/to/hospitable-python

# Get the full path to mcp_server.py
pwd
```

## Step 2: Create Your Configuration

The Claude Desktop config file is located at:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### Example Configuration

If `which python3` shows `/opt/homebrew/bin/python3` and your project is at `/Users/yourname/hospitable-python`, your config should be:

```json
{
  "mcpServers": {
    "hospitable": {
      "command": "/opt/homebrew/bin/python3",
      "args": [
        "/Users/yourname/hospitable-python/mcp_server.py"
      ],
      "env": {
        "HOSPITABLE_PAT": "your_token_here"
      }
    }
  }
}
```

### Important Notes

1. **Use FULL paths** - Never use just `python` or `python3`
2. **Use YOUR actual paths** - The paths above are examples
3. **Replace the token** - Use your real Hospitable PAT
4. **Keep existing servers** - If you have other MCP servers configured, add this to the existing `mcpServers` section

## Step 3: Install Dependencies

```bash
cd /path/to/hospitable-python
pip3 install -e ".[mcp]"
```

Or install dependencies directly:
```bash
pip3 install mcp requests python-dotenv
```

## Step 4: Restart Claude Desktop

After saving the config file, completely quit and restart Claude Desktop.

## Verify It Works

After restart, in Claude Desktop you should be able to:

1. Ask Claude to list your Hospitable properties
2. Get reservation information
3. Send messages to guests
4. Respond to reviews

Example: "Can you list my Hospitable properties?"

## Troubleshooting

### Still getting Enoent error?
- Double-check your Python path with `which python3`
- Make sure mcp_server.py path is absolute (starts with /)
- Verify the file exists at that path

### Permission denied?
- Make sure mcp_server.py is executable: `chmod +x mcp_server.py`

### Module not found?
- Run the pip install command from Step 3
- Make sure you're using the same Python that has the packages installed

### API errors (403)?
- This is expected from the Claude Code environment due to IP restrictions
- On your local Mac, it should work fine since your IP is already allowed
- Verify your token is correct in the config

## Getting Help

If you continue to have issues:
1. Check the Claude Desktop logs
2. Verify Python and paths are correct
3. Test the server manually: `HOSPITABLE_PAT=yourtoken /full/path/to/python3 /full/path/to/mcp_server.py`
