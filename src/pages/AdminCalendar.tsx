import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Video,
  MapPin,
  MoreHorizontal,
  Loader2,
  CalendarIcon
} from "lucide-react";
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { NewAppointmentDialog } from "@/components/admin/NewAppointmentDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  date: Date;
  time: string;
  duration: string;
  type: "presencial" | "videollamada";
  status: "confirmada" | "pendiente" | "cancelada";
  notes?: string;
}

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00"
];

export default function AdminCalendar() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week">("week");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/appointments`);
      const formattedAppointments = response.data.map((apt: any) => ({
        id: apt.id,
        patientId: apt.patient_id,
        patientName: apt.patient_name,
        // Fix: Append T00:00:00 to force local time interpretation instead of UTC
        date: new Date(apt.date + "T00:00:00"),
        time: apt.time,
        duration: apt.duration,
        type: apt.type,
        status: apt.status,
        notes: apt.notes,
      }));
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las citas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => isSameDay(apt.date, date));
  };

  const getAppointmentForSlot = (date: Date, time: string) => {
    return appointments.find(apt => isSameDay(apt.date, date) && apt.time === time);
  };

  const handlePrevious = () => {
    if (view === "week") {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  const handleNext = () => {
    if (view === "week") {
      setSelectedDate(addWeeks(selectedDate, 1));
    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleCancelAppointment = async (id: number) => {
    try {
      await axios.patch(`${API_URL}/appointments/${id}/status`, {
        status: "cancelada"
      });

      setAppointments(prev => prev.map(apt =>
        apt.id === id ? { ...apt, status: "cancelada" as const } : apt
      ));

      toast({
        title: "Cita cancelada",
        description: "La cita ha sido cancelada correctamente.",
      });
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast({
        title: "Error",
        description: "No se pudo cancelar la cita",
        variant: "destructive",
      });
    }
  };

  const handleConfirmAppointment = async (id: number) => {
    try {
      await axios.patch(`${API_URL}/appointments/${id}/status`, {
        status: "confirmada"
      });

      setAppointments(prev => prev.map(apt =>
        apt.id === id ? { ...apt, status: "confirmada" as const } : apt
      ));

      toast({
        title: "Cita confirmada",
        description: "La cita ha sido confirmada correctamente.",
      });
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast({
        title: "Error",
        description: "No se pudo confirmar la cita",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta cita?")) return;

    try {
      await axios.delete(`${API_URL}/appointments/${id}`);

      setAppointments(prev => prev.filter(apt => apt.id !== id));

      toast({
        title: "Cita eliminada",
        description: "La cita ha sido eliminada correctamente.",
      });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la cita",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "pendiente":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "cancelada":
        return "bg-red-500/20 text-red-700 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className={`mb-3 border-l-4 transition-all hover:shadow-md ${appointment.status === "confirmada" ? "border-l-green-500 shadow-green-500/10" :
      appointment.status === "pendiente" ? "border-l-amber-500 shadow-amber-500/10" :
        "border-l-red-500 shadow-red-500/10"
      }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">{appointment.patientName}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {appointment.time} - {appointment.duration}
              </span>
              <span className="flex items-center gap-1">
                {appointment.type === "videollamada" ? (
                  <Video className="h-3 w-3" />
                ) : (
                  <MapPin className="h-3 w-3" />
                )}
                {appointment.type === "videollamada" ? "Videollamada" : "Presencial"}
              </span>
            </div>
            {appointment.notes && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {appointment.notes}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className={`${getStatusColor(appointment.status)} px-2 py-1`}>
              {appointment.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {appointment.status === "pendiente" && (
                  <DropdownMenuItem onClick={() => handleConfirmAppointment(appointment.id)}>
                    Confirmar cita
                  </DropdownMenuItem>
                )}
                {appointment.type === "videollamada" && appointment.status !== "cancelada" && (
                  <DropdownMenuItem onClick={() => toast({ title: "Iniciando videollamada..." })}>
                    Iniciar videollamada
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => toast({
                  title: appointment.patientName,
                  description: `${format(appointment.date, "PPP", { locale: es })} - ${appointment.time}`
                })}>
                  Ver detalles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/admin/progress?patientId=${appointment.patientId}`)}>
                  Registrar Progreso
                </DropdownMenuItem>
                {appointment.status !== "cancelada" && (
                  <DropdownMenuItem
                    className="text-orange-600"
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    Cancelar cita
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDeleteAppointment(appointment.id)}
                >
                  Eliminar cita
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[600px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendario</h1>
            <p className="text-muted-foreground">Gestiona tus citas y consultas</p>
          </div>
          <NewAppointmentDialog onAppointmentCreated={fetchAppointments}>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cita
            </Button>
          </NewAppointmentDialog>
        </div>

        {/* Calendar Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleToday}>
              Hoy
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="ml-4 text-lg font-semibold">
              {view === "week"
                ? `${format(weekStart, "d MMM", { locale: es })} - ${format(addDays(weekStart, 6), "d MMM yyyy", { locale: es })}`
                : format(selectedDate, "MMMM yyyy", { locale: es })
              }
            </span>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week")}>
            <TabsList>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mes</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Calendar Views */}
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main Calendar */}
          <Card>
            <CardContent className="p-0">
              {view === "week" ? (
                <div className="overflow-auto">
                  {/* Week Header */}
                  <div className="grid grid-cols-8 border-b">
                    <div className="p-3 text-center text-sm font-medium text-muted-foreground border-r">
                      Hora
                    </div>
                    {weekDays.map((day, i) => (
                      <div
                        key={i}
                        className={`p-3 text-center border-r last:border-r-0 transition-colors ${isSameDay(day, new Date()) ? "bg-primary/5 border-primary/20" : "bg-card/50"
                          }`}
                      >
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          {format(day, "EEE", { locale: es })}
                        </div>
                        <div className={`text-xl font-bold h-8 w-8 mx-auto flex items-center justify-center rounded-full ${isSameDay(day, new Date()) ? "bg-primary text-primary-foreground shadow-primary/30 shadow-lg" : "text-foreground"
                          }`}>
                          {format(day, "d")}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Time Slots */}
                  <div className="max-h-[600px] overflow-y-auto">
                    {timeSlots.map((time) => (
                      <div key={time} className="grid grid-cols-8 border-b last:border-b-0">
                        <div className="p-2 text-xs text-muted-foreground border-r text-center">
                          {time}
                        </div>
                        {weekDays.map((day, i) => {
                          const appointment = getAppointmentForSlot(day, time);
                          return (
                            <div
                              key={i}
                              className={`p-1 min-h-[50px] border-r last:border-r-0 ${isSameDay(day, new Date()) ? "bg-primary/5" : ""
                                }`}
                            >
                              {appointment && (
                                <div
                                  className={`p-2 rounded-lg text-xs cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-sm ${appointment.status === "confirmada"
                                    ? "bg-green-500/15 hover:bg-green-500/25 border border-green-500/20 text-green-700 dark:text-green-300"
                                    : appointment.status === "pendiente"
                                      ? "bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/20 text-amber-700 dark:text-amber-300"
                                      : "bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-700 dark:text-red-300"
                                    }`}
                                  onClick={() => toast({
                                    title: appointment.patientName,
                                    description: `${appointment.time} - ${appointment.type}`
                                  })}
                                >
                                  <div className="font-semibold truncate mb-0.5">{appointment.patientName}</div>
                                  <div className="opacity-90 flex items-center gap-1.5 text-[10px] sm:text-xs">
                                    {appointment.type === "videollamada" ? (
                                      <Video className="h-3 w-3" />
                                    ) : (
                                      <MapPin className="h-3 w-3" />
                                    )}
                                    {appointment.duration}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md pointer-events-auto mx-auto"
                    locale={es}
                    modifiers={{
                      hasAppointment: appointments.map(apt => apt.date)
                    }}
                    modifiersStyles={{
                      hasAppointment: {
                        fontWeight: "bold",
                        textDecoration: "underline",
                        color: "hsl(var(--primary))"
                      }
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sidebar - Day Appointments */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {format(selectedDate, "EEEE, d MMMM", { locale: es })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getAppointmentsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-2">
                    {getAppointmentsForDate(selectedDate).map((apt) => (
                      <AppointmentCard key={apt.id} appointment={apt} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed hover:bg-muted/30 transition-colors">
                    <div className="h-16 w-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <CalendarIcon className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-medium text-foreground">No hay citas programadas</p>
                    <p className="text-sm text-muted-foreground">para este día</p>
                    <Button variant="link" className="mt-2 text-primary" size="sm">
                      Programar ahora
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Resumen del día</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total citas</span>
                  <Badge variant="secondary">
                    {getAppointmentsForDate(selectedDate).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Confirmadas</span>
                  <Badge className="bg-green-500/20 text-green-700">
                    {getAppointmentsForDate(selectedDate).filter(a => a.status === "confirmada").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pendientes</span>
                  <Badge className="bg-yellow-500/20 text-yellow-700">
                    {getAppointmentsForDate(selectedDate).filter(a => a.status === "pendiente").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Videollamadas</span>
                  <Badge variant="outline">
                    {getAppointmentsForDate(selectedDate).filter(a => a.type === "videollamada").length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}