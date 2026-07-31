import type { Profile } from "@/lib/bff/getProfile";

function formatDate(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

const stats: Array<{ label: string; key: keyof Profile }> = [
  { label: "Unread messages", key: "new_messages" },
  { label: "New notifications", key: "new_notifications" },
  { label: "Friend requests", key: "new_friend_requests" },
];

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        Profile
      </p>
      <h2 className="mt-2 text-3xl font-semibold text-foreground">{profile.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{profile.location}</p>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm text-muted-foreground sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface-muted px-3 py-3">
          <dt className="font-medium text-foreground">Joined</dt>
          <dd className="mt-1">{formatDate(profile.joined)}</dd>
        </div>
        <div className="rounded-xl border border-border bg-surface-muted px-3 py-3">
          <dt className="font-medium text-foreground">Last seen</dt>
          <dd className="mt-1">{formatDate(profile.last_seen)}</dd>
        </div>
      </dl>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="rounded-xl border border-border bg-surface-muted px-4 py-3 text-center"
          >
            <p className="text-2xl font-semibold text-foreground">{profile[stat.key]}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
