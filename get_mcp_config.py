#!/usr/bin/env python3
"""
Helper script to generate the correct Claude Desktop MCP configuration.
Run this script and copy the output to your Claude Desktop config.
"""

import sys
import os
import json

# Get the absolute path to Python
python_path = sys.executable

# Get the absolute path to mcp_server.py
script_dir = os.path.dirname(os.path.abspath(__file__))
mcp_server_path = os.path.join(script_dir, "mcp_server.py")

# Generate the config
config = {
    "mcpServers": {
        "hospitable": {
            "command": python_path,
            "args": [mcp_server_path],
            "env": {
                "HOSPITABLE_PAT": "YOUR_TOKEN_HERE"
            }
        }
    }
}

print("=" * 70)
print("CLAUDE DESKTOP MCP CONFIGURATION")
print("=" * 70)
print()
print("Copy this configuration to your Claude Desktop config file:")
print()

# On macOS
if sys.platform == "darwin":
    config_path = "~/Library/Application Support/Claude/claude_desktop_config.json"
# On Linux
elif sys.platform == "linux":
    config_path = "~/.config/Claude/claude_desktop_config.json"
# On Windows
else:
    config_path = "%APPDATA%\\Claude\\claude_desktop_config.json"

print(f"Config file location: {config_path}")
print()
print(json.dumps(config, indent=2))
print()
print("=" * 70)
print("IMPORTANT:")
print("1. Replace YOUR_TOKEN_HERE with your actual Hospitable PAT")
print("2. If you already have other MCP servers, merge this into your")
print("   existing mcpServers section")
print("3. Restart Claude Desktop after saving the config")
print("=" * 70)
print()
print("Detected paths:")
print(f"  Python: {python_path}")
print(f"  MCP Server: {mcp_server_path}")
print("=" * 70)
