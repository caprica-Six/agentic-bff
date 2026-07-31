# agentic-bff

A small demo of the **Backend-For-Frontend (BFF)** pattern, rebuilt for the agentic era: the same aggregation logic that shapes data for a web UI also runs as an **MCP tool**, so an AI agent can call it directly instead of re-deriving the same data from scratch.

This is the modern successor to [`react-bff`](https://github.com/caprica-Six/react-bff) (Next.js 13, Pages Router, 2023) — same demo data and profile shape, rebuilt on the current Next.js App Router with no self-fetch anti-pattern, and extended with an MCP server.

## Why this matters

The BFF pattern exists to decouple a frontend from a set of backend services: aggregate, shape, and hand the client exactly what it needs instead of making it stitch together several raw API responses.

That same argument holds for AI agents. An agent calling four separate "microservice" endpoints and reasoning over the raw responses burns tokens and reasoning steps it doesn't need to. If the aggregation and shaping already happens once, on the server, both consumers — a React component and an MCP tool call — can reuse it:

```
                    ┌────────────────────────────┐
                    │   lib/services/*.ts          │
                    │  user, messages,             │
                    │  notifications,              │
                    │  friend-requests             │  (plain async functions,
                    └──────────────┬───────────────┘   no internal HTTP hop)
                                   │ direct calls
                    ┌──────────────▼───────────────┐
                    │   lib/bff/getProfile.ts        │
                    │  (aggregates + shapes Profile) │
                    └──────┬───────────────┬─────────┘
                           │               │
              ┌────────────▼───┐   ┌───────▼────────────┐
              │  Web Consumer   │   │   Agent Consumer     │
              │  Server Comp.   │   │   MCP tool:           │
              │  + client       │   │   get_profile()       │
              │  refetch via    │   │   (thin, pre-shaped   │
              │  React Query    │   │    payload — no raw   │
              │                 │   │    per-service data)  │
              └─────────────────┘   └───────────────────────┘
```

`lib/bff/getProfile.ts` is the only place the aggregation logic lives. The web page and the MCP tool both call it directly — neither one re-implements it, and neither one talks to the other's transport.

## Demo: what it aggregates

The demo domain is a user profile page, aggregating four "microservices" (each backed by a static JSON fixture, standing in for real backend calls):

- **user** — name, location, address, join date
- **messages** — unread count, most recent message
- **notifications** — unseen count
- **friend-requests** — pending count

`getProfile()` combines these into one `Profile` DTO:

```ts
interface Profile {
  name: string;
  location: string;
  address: string;
  joined: string;
  last_seen: string;
  new_notifications: number;
  new_messages: number;
  new_friend_requests: number;
}
```

## Architecture

- **`lib/services/*.ts`** — one module per demo microservice, reading its fixture from `lib/data/*.json`. Plain async functions; no HTTP.
- **`lib/bff/getProfile.ts`** — the aggregator. Calls the service functions directly and shapes the `Profile` DTO. Used by both consumers below.
- **`app/api/*/route.ts`** — thin Route Handlers (`/api/user`, `/api/messages`, `/api/notifications`, `/api/friend-requests`, `/api/bff`), each independently curlable, each calling its corresponding service function. Kept for parity with the legacy demo and so you can inspect each "microservice" in isolation — the aggregator does **not** call these over HTTP.
- **`app/page.tsx`** — the web consumer. A Server Component that calls `getProfile()` directly for the first render, then a client component refetches `/api/bff` via [TanStack Query](https://tanstack.com/query) on demand.
- **`mcp/server.ts`** — the agent consumer. A local [MCP](https://modelcontextprotocol.io) server (stdio transport) exposing one tool, `get_profile`, which calls `getProfile()` directly and returns the same shaped DTO — not raw per-service data.

### Vs. the legacy `react-bff`

|                | `react-bff` (legacy)                                       | `agentic-bff`                                      |
| -------------- | ---------------------------------------------------------- | -------------------------------------------------- |
| Router         | Pages Router                                               | App Router                                         |
| Aggregation    | `/api/bff` self-fetches its own API routes over HTTP       | `getProfile()` calls service functions directly    |
| HTTP client    | axios                                                      | native `fetch`                                     |
| Client refetch | `useEffect` + axios hitting an unrelated external API demo | TanStack Query refetching the BFF's own `/api/bff` |
| Consumers      | web only                                                   | web **and** an MCP tool for AI agents              |

## Tech stack

- [Next.js](https://nextjs.org) (App Router, Server Components)
- TypeScript (strict)
- Tailwind CSS v4
- [TanStack Query](https://tanstack.com/query) for client-side refetching
- [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk) for the MCP server
- [Vitest](https://vitest.dev) for service and BFF regression tests

## Getting started

```bash
npm install
npm run test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the profile page. Use the buttons under "Call an individual microservice endpoint" to inspect each raw service response, and the theme toggle for light/dark mode.

You can also curl each endpoint directly:

```bash
curl localhost:3000/api/bff
curl localhost:3000/api/user
curl "localhost:3000/api/messages?action=unread"
curl "localhost:3000/api/notifications?action=unseen"
curl localhost:3000/api/friend-requests
```

### Running the MCP server

```bash
npm run mcp
```

This starts a stdio MCP server exposing the `get_profile` tool. To try it from an MCP-aware client (Claude Code, Claude Desktop, etc.), point it at this command, e.g. in Claude Code's MCP config:

```json
{
  "mcpServers": {
    "agentic-bff": {
      "command": "npx",
      "args": ["tsx", "mcp/server.ts"],
      "cwd": "/absolute/path/to/agentic-bff"
    }
  }
}
```

Then ask the connected agent to call `get_profile` — it gets back the same shaped `Profile` object the web page renders.

### Other scripts

```bash
npm run build   # production build
npm run lint    # eslint
npm run test    # vitest test suite
```

## Repo conventions for agentic tooling

This repo ships `CLAUDE.md` / `AGENTS.md` documenting the architecture decisions above, and a curated Claude Code skill (`vercel-react-best-practices`) under `.claude/skills/` — signaling the conventions an AI coding agent should follow when contributing here.

## License

MIT
