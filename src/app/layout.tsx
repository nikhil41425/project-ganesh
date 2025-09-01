import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import OfflineIndicator from "@/components/OfflineIndicator";
import DesktopPWAFeatures from "@/components/DesktopPWAFeatures";
import ClientOnly from "@/components/ClientOnly";
import PWAErrorBoundary from "@/components/PWAErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Friendz Youth - Dashboard",
  description: "A dashboard application with authentication and data management",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover"
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Project Ganesh",
    startupImage: [
      {
        url: "/icons/friendyouthlogo.png",
        media: "(device-width: 768px) and (device-height: 1024px)"
      }
    ]
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  },
  icons: {
    icon: [
      { url: "/icons/friendyouthlogo.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/friendyouthlogo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/friendyouthlogo.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/friendyouthlogo.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: [
      { url: "/icons/friendyouthlogo.png", sizes: "96x96", type: "image/png" }
    ]
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Project Ganesh",
    "application-name": "Project Ganesh",
    "msapplication-TileColor": "#000000",
    "msapplication-TileImage": "/icons/friendyouthlogo.png",
    "msapplication-config": "none",
    "format-detection": "telephone=no"
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PWAErrorBoundary>
          <ClientOnly>
            <OfflineIndicator />
          </ClientOnly>
        </PWAErrorBoundary>
        {children}
        <PWAErrorBoundary>
          <ClientOnly>
            <PWAInstallPrompt />
            <DesktopPWAFeatures />
          </ClientOnly>
        </PWAErrorBoundary>
      </body>
    </html>
  );
}
