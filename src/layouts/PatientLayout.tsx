import { ReactNode } from "react";
import { PatientSidebar } from "@/components/patient/PatientSidebar";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientBottomNav } from "@/components/patient/PatientBottomNav";

interface PatientLayoutProps {
  children: ReactNode;
}

export function PatientLayout({ children }: PatientLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <PatientSidebar />
      <div className="lg:ml-64">
        <PatientHeader />
        <main className="p-4 pb-20 lg:p-6 lg:pb-6">
          {children}
        </main>
      </div>
      <PatientBottomNav />
    </div>
  );
}
