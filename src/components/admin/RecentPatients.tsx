import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PatientDetailsDialog } from "./PatientDetailsDialog";
import { PatientActionsDropdown } from "./PatientActionsDropdown";

interface RecentPatient {
  id: number;
  name: string;
  avatar: string | null;
  email: string;
  plan: string;
  status: string;
  joined: string;
  registered_at: string | null;
}

interface RecentPatientsProps {
  patients?: RecentPatient[];
  loading?: boolean;
}

const statusStyles = {
  activo: "bg-success/10 text-success border-success/20",
  pendiente: "bg-warning/10 text-warning border-warning/20",
  inactivo: "bg-muted text-muted-foreground border-muted",
};

export function RecentPatients({ patients = [], loading = false }: RecentPatientsProps) {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<RecentPatient | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewAll = () => {
    navigate("/patients");
  };

  const handlePatientClick = (patient: RecentPatient) => {
    setSelectedPatient(patient);
    setDetailsOpen(true);
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Pacientes Recientes</h3>
            <p className="text-sm text-muted-foreground">Últimas actualizaciones</p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-3 w-24 bg-muted rounded"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-16 bg-muted rounded"></div>
                <div className="h-3 w-20 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Pacientes Recientes</h3>
            <p className="text-sm text-muted-foreground">Últimas actualizaciones</p>
          </div>
          <button
            onClick={handleViewAll}
            className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="divide-y divide-border">
          {patients.length > 0 ? (
            patients.map((patient, index) => (
              <div
                key={patient.id}
                className="group flex items-center justify-between p-4 transition-colors hover:bg-muted/30 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handlePatientClick(patient)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-border">
                    <AvatarImage src={patient.avatar || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {patient.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.plan}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={statusStyles[patient.status as keyof typeof statusStyles] || statusStyles.activo}
                  >
                    {patient.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{patient.joined}</span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <PatientActionsDropdown
                      patient={patient}
                      onViewDetails={() => handlePatientClick(patient)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">No hay pacientes recientes</p>
            </div>
          )}
        </div>
      </div>

      <PatientDetailsDialog
        patient={selectedPatient}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}