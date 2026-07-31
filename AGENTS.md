<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# agentic-bff architecture

`agentic-bff` demonstrates the Backend-For-Frontend pattern serving two consumers — a web UI and an MCP-connected AI agent — from one aggregation function. See `README.md` for the full narrative and diagram. Conventions to preserve:

## Layering

- `lib/services/*.ts` — one file per demo "microservice" (user, messages, notifications, friend-requests). Plain async functions reading the fixtures in `lib/data/*.json`. No HTTP involved — these stand in for calls a real BFF would make to separate backend services.
- `lib/bff/getProfile.ts` — the aggregator. Calls the service functions **directly**, never over HTTP, and shapes the result into the single `Profile` DTO. This is the one function both consumers below call.
- `app/api/*/route.ts` — thin Route Handlers, one per service plus `/api/bff` for the aggregate. They exist so each "microservice" stays independently curlable (a demo/teaching feature), and each just calls its corresponding `lib/services` function and returns JSON. They are not used internally by the aggregator.
- `app/page.tsx` — the web consumer. A Server Component that calls `getProfile()` directly (no HTTP round trip), then hands the result to a client component that uses React Query to refetch `/api/bff` on demand.
- `mcp/server.ts` — the agent consumer. A stdio MCP server exposing a single `get_profile` tool that calls `getProfile()` directly and returns the already-shaped DTO — not raw per-service data. Keeping the payload pre-aggregated keeps token cost low for whatever agent calls it.

## Rules

- Never reintroduce self-fetch aggregation (a Route Handler calling another Route Handler over HTTP via `req.headers.host`). Server Components and the BFF aggregator call `lib/services`/`lib/bff` functions directly.
- Use native `fetch` for any client-side HTTP. No axios, no ky.
- The MCP tool returns the shaped `Profile` DTO, not raw service data — don't add tools that dump unaggregated fixtures.
