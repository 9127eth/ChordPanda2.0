import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from './contexts/AuthContext'; // Will be used to wrap the app for authentication
import { CardProvider } from './contexts/CardContext';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
}); // Will be used for sans-serif font styling

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
}); // Will be used for monospace font styling

export const metadata: Metadata = {
  title: "Chord Panda",
  description: "Unlock the secrets of music theory with our captivating melody and chord generator.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>
          <CardProvider>{children}</CardProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
