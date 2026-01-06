import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from "@/config/api";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Activity,
  Target,
  AlertCircle,
  Heart,
  Apple,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Patient {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  foto_perfil: string | null;
  status: string;
  role: string;
  peso_actual: number | null;
  peso_objetivo: number | null;
  nivel_actividad: string | null;
  progreso: number;
  proxima_cita: string;
}

interface PatientDetailsDialogProps {
  patient: Patient | null; // Permitimos null para evitar errores externos
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
  onEdit?: () => void;
  onViewPlans?: () => void;
}

const statusStyles: Record<string, string> = {
  activo: "bg-success/10 text-success border-success/20",
  pendiente: "bg-warning/10 text-warning border-warning/20",
  inactivo: "bg-muted text-muted-foreground border-muted",
};

export function PatientDetailsDialog({
  patient,
  open,
  onOpenChange,
  onUpdate,
  onEdit,
  onViewPlans,
}: PatientDetailsDialogProps) {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // SOLUCIÓN AL ERROR: Si no hay paciente, no renderizamos nada para evitar el crash
  if (!patient) return null;

  // Función para obtener las iniciales del paciente
  const getInitials = (nombres: string, apellidos: string) => {
    return `${nombres?.[0] || ''}${apellidos?.[0] || ''}`.toUpperCase();
  };

  // Función para formatear fechas de forma segura
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "No especificado";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`${API_URL}/patients/${patient.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar paciente");
      }

      toast({
        title: "¡Éxito!",
        description: "Paciente eliminado correctamente",
      });

      setDeleteDialogOpen(false);
      onOpenChange(false);
      onUpdate?.();
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el paciente",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={patient.foto_perfil || ""} alt={`${patient.nombres} ${patient.apellidos}`} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {getInitials(patient.nombres, patient.apellidos)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span>{patient.nombres} {patient.apellidos}</span>
                  <Badge variant="outline" className={statusStyles[patient.status] || statusStyles.activo}>
                    {patient.status}
                  </Badge>
                </div>
                <DialogDescription className="mt-1">
                  Información detallada del paciente
                </DialogDescription>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="health">Salud</TabsTrigger>
              <TabsTrigger value="plans">Planes</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm mt-1">{patient.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                      <p className="text-sm mt-1">{patient.telefono || "No registrado"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ID del Sistema</p>
                      <p className="text-sm mt-1">#{patient.id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Próxima Cita</p>
                      <p className="text-sm mt-1">{formatDate(patient.proxima_cita)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Activity className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nivel de Actividad</p>
                      <p className="text-sm mt-1 capitalize">{patient.nivel_actividad || "No especificado"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Rol</p>
                      <p className="text-sm mt-1 capitalize">{patient.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Objetivos de Peso</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Peso Actual</p>
                        <p className="text-2xl font-bold">
                          {patient.peso_actual ? `${patient.peso_actual} kg` : "No registrado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Peso Objetivo</p>
                        <p className="text-2xl font-bold">
                          {patient.peso_objetivo ? `${patient.peso_objetivo} kg` : "No registrado"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Progreso</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Progreso Total</span>
                        <span className="text-2xl font-bold text-primary">{patient.progreso}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${patient.progreso}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="plans" className="space-y-4 mt-4">
              <div className="p-6 rounded-lg border border-border bg-card text-center">
                <Apple className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Planes Nutricionales</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Consulta y gestiona los planes nutricionales asignados a este paciente
                </p>
                <Button variant="outline" onClick={() => {
                  onViewPlans?.();
                  onOpenChange(false);
                }}>
                  Ver Planes Asignados
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                onEdit?.();
                onOpenChange(false);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente a <strong>{patient.nombres} {patient.apellidos}</strong> y
              todos sus datos asociados. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Eliminando..." : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}