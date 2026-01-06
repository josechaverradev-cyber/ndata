import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_URL } from "@/config/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Patient {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  fecha_nacimiento?: string | null;
  genero?: string | null;
  direccion?: string | null;
}

interface EditPatientDialogProps {
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditPatientDialog({ patient, open, onOpenChange, onSuccess }: EditPatientDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    genero: "",
    direccion: "",
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        nombres: patient.nombres || "",
        apellidos: patient.apellidos || "",
        email: patient.email || "",
        telefono: patient.telefono || "",
        fecha_nacimiento: patient.fecha_nacimiento || "",
        genero: patient.genero || "",
        direccion: patient.direccion || "",
      });
    }
  }, [patient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/patients/${patient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar paciente");
      }

      toast({
        title: "¡Éxito!",
        description: "Paciente actualizado correctamente",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el paciente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombres">Nombres *</Label>
              <Input
                id="nombres"
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellidos">Apellidos *</Label>
              <Input
                id="apellidos"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genero">Género</Label>
            <Select
              value={formData.genero}
              onValueChange={(value) => setFormData({ ...formData, genero: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Femenino">Femenino</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}