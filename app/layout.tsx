import type { Metadata } from "next";
import "./globals.css";
import { ThemeScript } from "@/components/theme-script";
import { QueryProvider } from "@/components/query-provider";

export const metadata: Metadata = {
  title: "agentic-bff",
  description:
    "A Backend-For-Frontend demo whose aggregation logic serves both a web UI and an AI agent via MCP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
