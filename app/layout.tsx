/**
 * Root Layout Component
 * 
 * This is the root layout component that wraps all pages in the application.
 * It sets up the HTML document structure, metadata, and global styles.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @returns {JSX.Element} The root layout structure
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Initialize Geist Sans font with custom variable for CSS usage
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Initialize Geist Mono font with custom variable for code/monospace text
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Application metadata
 * Defines the default metadata for all pages
 * Can be overridden by individual page metadata
 */
export const metadata: Metadata = {
  title: "Student Onboarding",
  description: "Test App for Playground",
};

/**
 * Root layout component that wraps all pages
 * Applies global styles and fonts to the entire application
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
