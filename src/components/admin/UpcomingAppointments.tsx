import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpcomingAppointment {
  id: number;
  patient_id: number;
  patient_name: string;
  patient_avatar: string | null;
  date: string;
  date_label: string;
  time: string;
  duration: string;
  type: string;
  status: string;
  notes?: string;
}

interface UpcomingAppointmentsProps {
  appointments?: UpcomingAppointment[];
  loading?: boolean;
}

const statusStyles = {
  confirmada: "bg-success/10 text-success border-success/20",
  pendiente: "bg-warning/10 text-warning border-warning/20",
  cancelada: "bg-destructive/10 text-destructive border-destructive/20",
};

export function UpcomingAppointments({ appointments = [], loading = false }: UpcomingAppointmentsProps) {
  const navigate = useNavigate();

  const handleViewCalendar = () => {
    navigate("/appointments");
  };

  const handleAppointmentClick = (appointmentId: number) => {
    navigate(`/appointments/${appointmentId}`);
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Próximas Citas</h3>
            <p className="text-sm text-muted-foreground">Agenda de hoy y mañana</p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted rounded"></div>
                <div className="h-3 w-24 bg-muted rounded"></div>
              </div>
              <div className="h-6 w-20 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Próximas Citas</h3>
          <p className="text-sm text-muted-foreground">Agenda de hoy y mañana</p>
        </div>
        <button
          onClick={handleViewCalendar}
          className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Ver calendario
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="divide-y divide-border">
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <div
              key={appointment.id}
              className="group flex items-start gap-4 p-4 transition-colors hover:bg-muted/30 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleAppointmentClick(appointment.id)}
            >
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarImage src={appointment.patient_avatar || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {appointment.patient_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-foreground truncate">
                    {appointment.patient_name}
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      statusStyles[appointment.status as keyof typeof statusStyles] ||
                      statusStyles.pendiente
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {appointment.date_label}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {appointment.time}
                  </span>
                  <span className="flex items-center gap-1">
                    {appointment.type === "videollamada" ? (
                      <Video className="h-3 w-3" />
                    ) : (
                      <Building2 className="h-3 w-3" />
                    )}
                    {appointment.type === "videollamada" ? "Virtual" : "Presencial"}
                  </span>
                </div>
                {appointment.notes && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {appointment.notes}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No hay citas programadas</p>
          </div>
        )}
      </div>
    </div>
  );
}