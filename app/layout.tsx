import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Business Agency Platform",
  description: "A full-stack platform to showcase services, portfolios, and manage client inquiries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
      >
      <ClerkProvider>    
          {children}
      </ClerkProvider>
      </body>
    </html>
  );
}
