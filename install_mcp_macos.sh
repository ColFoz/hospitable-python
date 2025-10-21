#!/bin/bash
# Hospitable MCP Server Installation Script for macOS
# This script sets up the MCP server for use with Claude Desktop

set -e  # Exit on error

echo "========================================================================"
echo "Hospitable MCP Server - macOS Installation"
echo "========================================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Find Python path
echo "Step 1: Finding Python installation..."
PYTHON_PATH=$(which python3)
if [ -z "$PYTHON_PATH" ]; then
    echo -e "${RED}Error: python3 not found in PATH${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Found Python at: $PYTHON_PATH${NC}"
echo ""

# Step 2: Upgrade pip
echo "Step 2: Upgrading pip..."
$PYTHON_PATH -m pip install --upgrade pip --user
echo -e "${GREEN}✓ pip upgraded${NC}"
echo ""

# Step 3: Install dependencies
echo "Step 3: Installing dependencies..."
echo "Installing requests and python-dotenv..."
pip3 install --user requests python-dotenv
echo ""

echo "Installing MCP SDK..."
# Try different methods to install MCP
if pip3 install --user mcp 2>/dev/null; then
    echo -e "${GREEN}✓ Installed mcp from PyPI${NC}"
elif pip3 install --user "mcp[cli]" 2>/dev/null; then
    echo -e "${GREEN}✓ Installed mcp[cli] from PyPI${NC}"
else
    echo -e "${YELLOW}⚠ Standard installation failed, trying from git...${NC}"
    pip3 install --user git+https://github.com/modelcontextprotocol/python-sdk.git
    echo -e "${GREEN}✓ Installed MCP SDK from git${NC}"
fi
echo ""

# Step 4: Install the Hospitable SDK in development mode
echo "Step 4: Installing Hospitable SDK..."
cd "$(dirname "$0")"
PROJECT_DIR=$(pwd)
pip3 install --user -e .
echo -e "${GREEN}✓ Hospitable SDK installed${NC}"
echo ""

# Step 5: Generate Claude Desktop configuration
echo "Step 5: Generating Claude Desktop configuration..."
echo ""

MCP_SERVER_PATH="$PROJECT_DIR/mcp_server.py"
CONFIG_DIR="$HOME/Library/Application Support/Claude"
CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"

echo "Detected paths:"
echo "  Python:     $PYTHON_PATH"
echo "  MCP Server: $MCP_SERVER_PATH"
echo "  Config:     $CONFIG_FILE"
echo ""

# Create config directory if it doesn't exist
mkdir -p "$CONFIG_DIR"

# Check if config file exists
if [ -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}⚠ Claude Desktop config already exists${NC}"
    echo ""
    echo "Your existing config is at: $CONFIG_FILE"
    echo ""
    echo "You need to ADD this section to your existing 'mcpServers' object:"
    echo ""
    cat <<EOF
    "hospitable": {
      "command": "$PYTHON_PATH",
      "args": [
        "$MCP_SERVER_PATH"
      ],
      "env": {
        "HOSPITABLE_PAT": "YOUR_TOKEN_HERE"
      }
    }
EOF
    echo ""
    echo -e "${YELLOW}IMPORTANT: Don't replace your entire config, just add the 'hospitable' section!${NC}"
else
    # Create new config
    cat > "$CONFIG_FILE" <<EOF
{
  "mcpServers": {
    "hospitable": {
      "command": "$PYTHON_PATH",
      "args": [
        "$MCP_SERVER_PATH"
      ],
      "env": {
        "HOSPITABLE_PAT": "YOUR_TOKEN_HERE"
      }
    }
  }
}
EOF
    echo -e "${GREEN}✓ Created new Claude Desktop config${NC}"
    echo ""
    echo "Config file created at: $CONFIG_FILE"
fi

echo ""
echo "========================================================================"
echo "Installation Complete!"
echo "========================================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Edit the Claude Desktop config to add your token:"
echo "   code '$CONFIG_FILE'"
echo "   or"
echo "   nano '$CONFIG_FILE'"
echo ""
echo "2. Replace YOUR_TOKEN_HERE with your actual Hospitable PAT"
echo ""
echo "3. Completely quit and restart Claude Desktop (Cmd+Q, then reopen)"
echo ""
echo "4. Test it by asking Claude:"
echo '   "Can you list my Hospitable properties?"'
echo ""
echo "========================================================================"
echo ""

# Step 6: Test the MCP server
echo "Would you like to test the MCP server now? (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "Testing MCP server..."
    echo "Please enter your Hospitable PAT (or press Enter to skip):"
    read -r token

    if [ -n "$token" ]; then
        echo ""
        echo "Running server test..."
        HOSPITABLE_PAT="$token" $PYTHON_PATH "$MCP_SERVER_PATH" &
        SERVER_PID=$!
        sleep 2

        if ps -p $SERVER_PID > /dev/null; then
            echo -e "${GREEN}✓ Server started successfully!${NC}"
            kill $SERVER_PID
        else
            echo -e "${RED}✗ Server failed to start. Check for errors above.${NC}"
        fi
    else
        echo "Skipping test."
    fi
fi

echo ""
echo -e "${GREEN}All done! Enjoy using the Hospitable MCP server with Claude Desktop!${NC}"
echo ""
