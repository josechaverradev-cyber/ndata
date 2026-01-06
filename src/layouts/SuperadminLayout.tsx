import { ReactNode } from "react";
import { SuperadminSidebar } from "@/components/superadmin/SuperadminSidebar";
import { SuperadminHeader } from "@/components/superadmin/SuperadminHeader";

interface SuperadminLayoutProps {
  children: ReactNode;
}

export function SuperadminLayout({ children }: SuperadminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <SuperadminSidebar />
      <div className="lg:ml-64">
        <SuperadminHeader />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
