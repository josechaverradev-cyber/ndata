import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/config/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface NewPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface PatientFormData {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  genero: string;
  direccion: string;
}

const initialFormData: PatientFormData = {
  nombres: "",
  apellidos: "",
  email: "",
  telefono: "",
  fecha_nacimiento: "",
  genero: "",
  direccion: "",
};

export function NewPatientDialog({ open, onOpenChange, onSuccess }: NewPatientDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<PatientFormData>>({});

  const handleChange = (field: keyof PatientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario escribe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PatientFormData> = {};

    if (!formData.nombres.trim()) {
      newErrors.nombres = "El nombre es requerido";
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "El apellido es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor completa los campos requeridos correctamente",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombres: formData.nombres.trim(),
          apellidos: formData.apellidos.trim(),
          email: formData.email.trim().toLowerCase(),
          telefono: formData.telefono.trim() || null,
          fecha_nacimiento: formData.fecha_nacimiento || null,
          genero: formData.genero || null,
          direccion: formData.direccion.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error al crear paciente");
      }

      toast({
        title: "¡Éxito!",
        description: `Paciente ${formData.nombres} ${formData.apellidos} creado correctamente`,
      });

      // Resetear formulario
      setFormData(initialFormData);
      setErrors({});
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error creating patient:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el paciente. Verifica los datos e intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Paciente</DialogTitle>
          <DialogDescription>
            Completa la información básica del paciente. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Información Personal</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombres">
                  Nombres <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nombres"
                  placeholder="Juan Carlos"
                  value={formData.nombres}
                  onChange={(e) => handleChange("nombres", e.target.value)}
                  className={errors.nombres ? "border-destructive" : ""}
                  disabled={loading}
                />
                {errors.nombres && (
                  <p className="text-xs text-destructive">{errors.nombres}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellidos">
                  Apellidos <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="apellidos"
                  placeholder="Pérez García"
                  value={formData.apellidos}
                  onChange={(e) => handleChange("apellidos", e.target.value)}
                  className={errors.apellidos ? "border-destructive" : ""}
                  disabled={loading}
                />
                {errors.apellidos && (
                  <p className="text-xs text-destructive">{errors.apellidos}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan.perez@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="+57 300 123 4567"
                  value={formData.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
                  disabled={loading}
                  max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genero">Género</Label>
                <Select
                  value={formData.genero}
                  onValueChange={(value) => handleChange("genero", value)}
                  disabled={loading}
                >
                  <SelectTrigger id="genero">
                    <SelectValue placeholder="Selecciona género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                placeholder="Calle 123 # 45-67, Apartamento 101"
                value={formData.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Nota informativa */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Nota:</strong> Una vez creado el paciente, podrás completar información adicional como
              peso, altura, objetivos de salud y asignar planes nutricionales desde su perfil.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gradient-primary">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Paciente"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}