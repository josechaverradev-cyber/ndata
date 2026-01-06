import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="lg:ml-64">
        <AdminHeader />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
