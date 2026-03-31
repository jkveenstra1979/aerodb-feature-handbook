import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AeroDB Feature Handbook',
  description: 'Navigable AeroDB feature catalog with AIXM mapping & ownership',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,300;400;500&family=Inter:wght@400;500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
