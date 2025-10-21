#!/usr/bin/env python3
"""
Hospitable MCP Server

A Model Context Protocol server that exposes the Hospitable SDK functionality
for use with Claude Desktop and other MCP clients.
"""

import os
import sys
import json
from datetime import datetime
from typing import Any, Optional

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

from hospitable import HospitableClient
from hospitable.exceptions import (
    HospitableAPIError,
    AuthenticationError,
    ValidationError,
    RateLimitError,
    NotFoundError,
)


# Initialize the MCP server
app = Server("hospitable-sdk")

# Global client instance
_client: Optional[HospitableClient] = None


def get_client() -> HospitableClient:
    """Get or create the Hospitable client instance."""
    global _client
    if _client is None:
        # Try to get token from environment variables
        token = os.getenv("HOSPITABLE_PAT") or os.getenv("HOSPITABLE_TOKEN")
        if not token:
            raise AuthenticationError(
                "No Hospitable token found. Set HOSPITABLE_PAT or HOSPITABLE_TOKEN environment variable."
            )
        _client = HospitableClient(token=token)
    return _client


def format_error(error: Exception) -> str:
    """Format an error message for display."""
    if isinstance(error, RateLimitError):
        return f"Rate limit exceeded. Retry after: {error.retry_after} seconds"
    elif isinstance(error, HospitableAPIError):
        return f"API Error ({error.status_code}): {error.message}"
    return f"Error: {str(error)}"


def serialize_data(data: Any) -> str:
    """Serialize data to JSON string, handling dataclasses and datetime objects."""
    def default_serializer(obj):
        if hasattr(obj, "__dict__"):
            # Handle dataclasses and similar objects
            return obj.__dict__
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return str(obj)

    return json.dumps(data, indent=2, default=default_serializer)


@app.list_tools()
async def list_tools() -> list[Tool]:
    """List all available MCP tools."""
    return [
        # Properties tools
        Tool(
            name="list_properties",
            description="List all properties with pagination. Returns basic property information.",
            inputSchema={
                "type": "object",
                "properties": {
                    "include": {
                        "type": "string",
                        "description": "Comma-separated list of related resources to include (e.g., 'calendar,photos')",
                    },
                    "page": {
                        "type": "integer",
                        "description": "Page number (default: 1)",
                        "default": 1,
                    },
                    "per_page": {
                        "type": "integer",
                        "description": "Results per page (default: 10, max: 100)",
                        "default": 10,
                    },
                },
            },
        ),
        Tool(
            name="get_property",
            description="Get detailed information about a specific property by UUID.",
            inputSchema={
                "type": "object",
                "properties": {
                    "uuid": {
                        "type": "string",
                        "description": "The property UUID",
                    },
                    "include": {
                        "type": "string",
                        "description": "Comma-separated list of related resources to include",
                    },
                },
                "required": ["uuid"],
            },
        ),
        Tool(
            name="search_properties",
            description="Search for available properties with specific criteria (dates, guests, location).",
            inputSchema={
                "type": "object",
                "properties": {
                    "start_date": {
                        "type": "string",
                        "description": "Check-in date (YYYY-MM-DD)",
                    },
                    "end_date": {
                        "type": "string",
                        "description": "Check-out date (YYYY-MM-DD)",
                    },
                    "adults": {
                        "type": "integer",
                        "description": "Number of adults",
                    },
                    "children": {
                        "type": "integer",
                        "description": "Number of children",
                    },
                    "pets": {
                        "type": "integer",
                        "description": "Number of pets",
                    },
                    "location": {
                        "type": "string",
                        "description": "Location to search (city, address, etc.)",
                    },
                },
                "required": ["start_date", "end_date", "adults"],
            },
        ),
        Tool(
            name="get_property_calendar",
            description="Get calendar information for a property, including availability and pricing.",
            inputSchema={
                "type": "object",
                "properties": {
                    "uuid": {
                        "type": "string",
                        "description": "The property UUID",
                    },
                    "start_date": {
                        "type": "string",
                        "description": "Start date (YYYY-MM-DD)",
                    },
                    "end_date": {
                        "type": "string",
                        "description": "End date (YYYY-MM-DD)",
                    },
                },
                "required": ["uuid"],
            },
        ),
        Tool(
            name="update_property_calendar",
            description="Update calendar dates for a property (max 60 dates per request). Set availability, pricing, min stay, etc.",
            inputSchema={
                "type": "object",
                "properties": {
                    "uuid": {
                        "type": "string",
                        "description": "The property UUID",
                    },
                    "dates": {
                        "type": "array",
                        "description": "Array of date objects to update (max 60)",
                        "items": {
                            "type": "object",
                            "properties": {
                                "date": {"type": "string", "description": "Date (YYYY-MM-DD)"},
                                "available": {"type": "boolean", "description": "Is the date available?"},
                                "price": {"type": "number", "description": "Nightly price"},
                                "min_stay": {"type": "integer", "description": "Minimum stay nights"},
                            },
                            "required": ["date"],
                        },
                    },
                },
                "required": ["uuid", "dates"],
            },
        ),
        # Reservations tools
        Tool(
            name="list_reservations",
            description="List reservations with optional filters (properties, dates, platform).",
            inputSchema={
                "type": "object",
                "properties": {
                    "properties": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Array of property UUIDs to filter by",
                    },
                    "start_date": {
                        "type": "string",
                        "description": "Start date filter (YYYY-MM-DD)",
                    },
                    "end_date": {
                        "type": "string",
                        "description": "End date filter (YYYY-MM-DD)",
                    },
                    "date_query": {
                        "type": "string",
                        "description": "Date query type: 'checkin' or 'checkout'",
                        "enum": ["checkin", "checkout"],
                    },
                    "platform_id": {
                        "type": "string",
                        "description": "Filter by platform ID",
                    },
                    "conversation_id": {
                        "type": "string",
                        "description": "Filter by conversation ID",
                    },
                    "include": {
                        "type": "string",
                        "description": "Comma-separated list of related resources to include",
                    },
                    "page": {
                        "type": "integer",
                        "description": "Page number (default: 1)",
                        "default": 1,
                    },
                    "per_page": {
                        "type": "integer",
                        "description": "Results per page (default: 10, max: 100)",
                        "default": 10,
                    },
                },
            },
        ),
        Tool(
            name="get_reservation",
            description="Get detailed information about a specific reservation by UUID.",
            inputSchema={
                "type": "object",
                "properties": {
                    "uuid": {
                        "type": "string",
                        "description": "The reservation UUID",
                    },
                    "include": {
                        "type": "string",
                        "description": "Comma-separated list of related resources to include",
                    },
                },
                "required": ["uuid"],
            },
        ),
        # Messages tools
        Tool(
            name="list_messages",
            description="List all messages for a specific reservation.",
            inputSchema={
                "type": "object",
                "properties": {
                    "reservation_uuid": {
                        "type": "string",
                        "description": "The reservation UUID",
                    },
                },
                "required": ["reservation_uuid"],
            },
        ),
        Tool(
            name="send_message",
            description="Send a message to a guest for a specific reservation. Rate limit: 2/min per reservation, 50/5min globally.",
            inputSchema={
                "type": "object",
                "properties": {
                    "reservation_uuid": {
                        "type": "string",
                        "description": "The reservation UUID",
                    },
                    "body": {
                        "type": "string",
                        "description": "The message body/content to send",
                    },
                    "images": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Optional array of image URLs (max 3, 5MB each)",
                    },
                },
                "required": ["reservation_uuid", "body"],
            },
        ),
        # Reviews tools
        Tool(
            name="list_reviews",
            description="List reviews for a specific property.",
            inputSchema={
                "type": "object",
                "properties": {
                    "property_uuid": {
                        "type": "string",
                        "description": "The property UUID",
                    },
                    "include": {
                        "type": "string",
                        "description": "Comma-separated list of related resources to include",
                    },
                    "page": {
                        "type": "integer",
                        "description": "Page number (default: 1)",
                        "default": 1,
                    },
                    "per_page": {
                        "type": "integer",
                        "description": "Results per page (default: 10, max: 100)",
                        "default": 10,
                    },
                },
                "required": ["property_uuid"],
            },
        ),
        Tool(
            name="respond_to_review",
            description="Respond to a review.",
            inputSchema={
                "type": "object",
                "properties": {
                    "review_uuid": {
                        "type": "string",
                        "description": "The review UUID",
                    },
                    "response": {
                        "type": "string",
                        "description": "Your response to the review",
                    },
                },
                "required": ["review_uuid", "response"],
            },
        ),
        # User tools
        Tool(
            name="get_user",
            description="Get information about the authenticated user and their billing details.",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        Tool(
            name="get_token_info",
            description="Get information about the current authentication token (for JWT tokens only).",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
    ]


@app.call_tool()
async def call_tool(name: str, arguments: Any) -> list[TextContent]:
    """Handle tool calls."""
    try:
        client = get_client()
        result = None

        # Properties tools
        if name == "list_properties":
            result = client.properties.list(
                include=arguments.get("include"),
                page=arguments.get("page", 1),
                per_page=arguments.get("per_page", 10),
            )

        elif name == "get_property":
            result = client.properties.get(
                uuid=arguments["uuid"],
                include=arguments.get("include"),
            )

        elif name == "search_properties":
            result = client.properties.search(
                start_date=arguments["start_date"],
                end_date=arguments["end_date"],
                adults=arguments["adults"],
                children=arguments.get("children"),
                pets=arguments.get("pets"),
                location=arguments.get("location"),
            )

        elif name == "get_property_calendar":
            result = client.properties.get_calendar(
                uuid=arguments["uuid"],
                start_date=arguments.get("start_date"),
                end_date=arguments.get("end_date"),
            )

        elif name == "update_property_calendar":
            result = client.properties.update_calendar(
                uuid=arguments["uuid"],
                dates=arguments["dates"],
            )

        # Reservations tools
        elif name == "list_reservations":
            result = client.reservations.list(
                properties=arguments.get("properties"),
                start_date=arguments.get("start_date"),
                end_date=arguments.get("end_date"),
                include=arguments.get("include"),
                date_query=arguments.get("date_query", "checkin"),
                platform_id=arguments.get("platform_id"),
                conversation_id=arguments.get("conversation_id"),
                page=arguments.get("page", 1),
                per_page=arguments.get("per_page", 10),
            )

        elif name == "get_reservation":
            result = client.reservations.get(
                uuid=arguments["uuid"],
                include=arguments.get("include"),
            )

        # Messages tools
        elif name == "list_messages":
            result = client.messages.list(
                reservation_uuid=arguments["reservation_uuid"]
            )

        elif name == "send_message":
            result = client.messages.send(
                reservation_uuid=arguments["reservation_uuid"],
                body=arguments["body"],
                images=arguments.get("images"),
            )

        # Reviews tools
        elif name == "list_reviews":
            result = client.reviews.list(
                property_uuid=arguments["property_uuid"],
                include=arguments.get("include"),
                page=arguments.get("page", 1),
                per_page=arguments.get("per_page", 10),
            )

        elif name == "respond_to_review":
            result = client.reviews.respond(
                review_uuid=arguments["review_uuid"],
                response=arguments["response"],
            )

        # User tools
        elif name == "get_user":
            result = client.user.get()

        elif name == "get_token_info":
            result = client.get_token_info()

        else:
            return [TextContent(type="text", text=f"Unknown tool: {name}")]

        # Serialize and return the result
        return [TextContent(type="text", text=serialize_data(result))]

    except Exception as e:
        error_message = format_error(e)
        return [TextContent(type="text", text=error_message)]


async def main():
    """Run the MCP server."""
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options(),
        )


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
