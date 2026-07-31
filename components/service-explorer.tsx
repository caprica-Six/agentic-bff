"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Profile } from "@/lib/bff/getProfile";
import { ProfileCard } from "@/components/profile-card";

const endpoints = [
  { label: "BFF (aggregated)", path: "/api/bff" },
  { label: "User service", path: "/api/user" },
  { label: "Messages service", path: "/api/messages?action=unread" },
  { label: "Notifications service", path: "/api/notifications?action=unseen" },
  { label: "Friend requests service", path: "/api/friend-requests" },
];

export function ServiceExplorer({ initialProfile }: { initialProfile: Profile }) {
  const [response, setResponse] = useState<unknown>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  // Demonstrates the modern equivalent of the legacy repo's client-side
  // refetch: React Query hitting the BFF's own /api/bff endpoint, seeded
  // with the profile already rendered server-side.
  const { data: profile } = useQuery<Profile>({
    queryKey: ["bff-profile"],
    queryFn: async () => {
      const res = await fetch("/api/bff");
      return res.json();
    },
    initialData: initialProfile,
  });

  async function callEndpoint(label: string, path: string) {
    setActiveLabel(label);
    const res = await fetch(path);
    setResponse(await res.json());
  }

  return (
    <div className="space-y-6">
      <ProfileCard profile={profile} />

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Call an individual microservice endpoint
        </h3>
        <div className="flex flex-wrap gap-2">
          {endpoints.map((endpoint) => (
            <button
              key={endpoint.path}
              type="button"
              onClick={() => callEndpoint(endpoint.label, endpoint.path)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                activeLabel === endpoint.label
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-foreground hover:border-foreground"
              }`}
            >
              {endpoint.label}
            </button>
          ))}
        </div>
      </div>

      {response !== null && (
        <pre className="max-h-96 overflow-auto rounded-xl border border-border bg-surface p-4 text-sm text-foreground">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
