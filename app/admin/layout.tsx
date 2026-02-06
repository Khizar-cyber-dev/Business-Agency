import type { Metadata } from "next";
import '../../app/globals.css'
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ConditionalLayout from "./components/ConditionalLayout";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your services and portfolio",
};

// Admin pages depend on per-request auth (Clerk reads headers/cookies),
// so they cannot be statically pre-rendered at build time.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConditionalLayout sidebar={<Sidebar />} header={<Header />}>
      {children}
    </ConditionalLayout>
  );
}