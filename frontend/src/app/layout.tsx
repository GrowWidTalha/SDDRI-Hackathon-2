/* Root layout with HTML structure and metadata.

[Task]: T049, T058
[From]: specs/001-user-auth/plan.md, specs/005-ux-improvement/tasks.md
[Updated]: specs/012-ui-redesign/tasks.md - T-009

Added ThemeProvider for Deep Rich Dark theme support and glassmorphism UI.
*/
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChatProvider } from "@/components/chatbot/ChatProvider";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider, ThemeScript } from "@/components/design-system";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo List App",
  description: "A simple todo list application with user authentication",
  keywords: ["todo", "tasks", "productivity"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* SSR-safe theme initialization */}
        <ThemeScript />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="dark" storageKey="app-theme">
          <NuqsAdapter>
            <ChatProvider>
              {/* Skip to main content link for accessibility */}
              <a href="#main-content" className="skip-to-content">
                Skip to main content
              </a>
              <div id="main-content">
                {children}
              </div>
            </ChatProvider>
            <Toaster />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
