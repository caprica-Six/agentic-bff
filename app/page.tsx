import { getProfile } from "@/lib/bff/getProfile";
import { ServiceExplorer } from "@/components/service-explorer";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Home() {
  const profile = await getProfile();

  return (
    <div className="flex flex-1 flex-col bg-background">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
        <header className="flex items-start justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              agentic-bff
            </p>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Backend-For-Frontend, for web and AI agents
            </h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              One aggregation function shapes this profile for the web UI below
              — and for any MCP-connected agent that calls the{" "}
              <code className="rounded border border-border bg-surface-muted px-1.5 py-0.5 text-sm text-foreground">
                get_profile
              </code>{" "}
              tool.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <ServiceExplorer initialProfile={profile} />
      </main>
    </div>
  );
}
