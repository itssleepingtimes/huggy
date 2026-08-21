import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#FF5C8A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Huggy" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <ScrollViewStyleReset />
        {/* iOS Safari's 100vh includes space the collapsible toolbar can cover, which can hide
            fixed-bottom content like the tab bar. 100dvh tracks the actual visible area. */}
        <style>{`
          html, body, #root { height: 100vh; height: 100dvh; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
