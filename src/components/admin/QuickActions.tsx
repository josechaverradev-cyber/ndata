import { useState } from "react";
import { Plus, FileText, UserPlus, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewPatientDialog } from "./NewPatientDialog";
import { NewPlanDialog } from "./NewPlanDialog";
import { NewAppointmentDialog } from "./NewAppointmentDialog";

const actions = [
  {
    icon: UserPlus,
    label: "Nuevo Paciente",
    description: "Registrar nuevo paciente",
    color: "primary",
    action: "patient",
  },
  {
    icon: FileText,
    label: "Crear Plan",
    description: "Nuevo plan nutricional",
    color: "accent",
    action: "plan",
  },
  {
    icon: Calendar,
    label: "Agendar Cita",
    description: "Programar consulta",
    color: "info",
    action: "appointment",
  },
];

const colorClasses = {
  primary: "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground group-hover:scale-110",
  accent: "bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground group-hover:scale-110",
  info: "bg-info/10 text-info hover:bg-info hover:text-info-foreground group-hover:scale-110",
};

export function QuickActions() {
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);

  const handleAction = (action: string) => {
    switch (action) {
      case "patient":
        setPatientDialogOpen(true);
        break;
      case "plan":
        setPlanDialogOpen(true);
        break;
      case "appointment":
        setAppointmentDialogOpen(true);
        break;
    }
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Acciones Rápidas</h3>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <button
              key={action.label}
              onClick={() => handleAction(action.action)}
              className={cn(
                "group flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all duration-300",
                "bg-muted/30 hover:bg-muted/50 hover:scale-[1.02] animate-slide-up"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
                colorClasses[action.color as keyof typeof colorClasses]
              )}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{action.label}</p>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              <Plus className="h-5 w-5 text-muted-foreground transition-transform group-hover:rotate-90" />
            </button>
          ))}
        </div>
      </div>

      <NewPatientDialog open={patientDialogOpen} onOpenChange={setPatientDialogOpen} />
      <NewPlanDialog open={planDialogOpen} onOpenChange={setPlanDialogOpen} />
      <NewAppointmentDialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen} />
    </>
  );
}
