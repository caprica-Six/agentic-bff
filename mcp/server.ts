import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { getProfile } from "@/lib/bff/getProfile";

/**
 * The agent-facing consumer of the BFF. It calls the same getProfile()
 * aggregator the web UI uses and returns the already-shaped Profile DTO
 * rather than raw per-service data — keeping the payload an agent has to
 * read small, instead of duplicating the aggregation logic here.
 */
const server = new McpServer({
  name: "agentic-bff",
  version: "0.1.0",
});

const profileOutputSchema = {
  name: z.string(),
  location: z.string(),
  address: z.string(),
  joined: z.string(),
  last_seen: z.string(),
  new_notifications: z.number(),
  new_messages: z.number(),
  new_friend_requests: z.number(),
};

server.registerTool(
  "get_profile",
  {
    title: "Get profile",
    description:
      "Returns the aggregated user profile (name, location, joined/last-seen dates, and unread counts for messages, notifications, and friend requests) shaped by the BFF — the same data the web UI displays.",
    outputSchema: profileOutputSchema,
  },
  async () => {
    const profile = await getProfile();
    return {
      content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
      structuredContent: { ...profile },
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  console.error("agentic-bff MCP server failed to start:", error);
  process.exit(1);
});
