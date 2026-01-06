import { PatientLayout } from "@/layouts/PatientLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Save, User, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import { useAuth } from "@/hooks/useAuth";

const allergiesList = [
  { id: "gluten", label: "Gluten" },
  { id: "lactose", label: "Lactosa" },
  { id: "nuts", label: "Frutos secos" },
  { id: "seafood", label: "Mariscos" },
  { id: "eggs", label: "Huevos" },
  { id: "soy", label: "Soja" },
];

const dietPreferencesList = [
  { id: "vegetarian", label: "Vegetariano" },
  { id: "vegan", label: "Vegano" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "mediterranean", label: "Mediterránea" },
  { id: "lowcarb", label: "Baja en carbohidratos" },
];

export default function PatientProfile() {
  const navigate = useNavigate();

  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    genero: "",
    direccion: "",
    foto_perfil: "",
    altura: "",
    peso_actual: "",
    peso_objetivo: "",
    nivel_actividad: "",
    objetivos_salud: "",
    condiciones_medicas: "",
    alimentos_disgusto: ""
  });

  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);


  const { user, isLoading: isAuthLoading } = useAuth();

  // Cargar datos iniciales
  useEffect(() => {
    if (!isAuthLoading && user?.email) {
      fetch(`${API_URL}/profile/${user.email}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            nombres: data.nombres || "",
            apellidos: data.apellidos || "",
            email: data.email || "",
            telefono: data.telefono || "",
            fecha_nacimiento: data.fecha_nacimiento || "",
            genero: data.genero || "",
            direccion: data.direccion || "",
            foto_perfil: data.foto_perfil || "",
            altura: data.altura || "",
            peso_actual: data.peso_actual || "",
            peso_objetivo: data.peso_objetivo || "",
            nivel_actividad: data.nivel_actividad || "",
            objetivos_salud: data.objetivos_salud || "",
            condiciones_medicas: data.condiciones_medicas || "",
            alimentos_disgusto: data.alimentos_disgusto || ""
          });
          setSelectedAllergies(data.alergias || []);
          setSelectedPreferences(data.preferencias || []);
        })
        .catch(() => toast.error("Error al cargar datos de perfil"));
    }
  }, [isAuthLoading, user?.email]);

  const handlePhotoClick = () => fileInputRef.current?.click();


  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validación de tamaño (2MB)
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("La imagen es muy pesada (máximo 2MB)");
      }

      setUploadingPhoto(true);
      const photoData = new FormData();
      photoData.append("file", file);

      try {
        const response = await fetch(`${API_URL}/patient/${formData.email}/profile`, {
          method: "POST",
          body: photoData,
        });
        const result = await response.json();
        if (result.success) {
          setFormData(prev => ({ ...prev, foto_perfil: result.foto_url }));
          toast.success("Foto actualizada");
        }
      } catch (error) {
        toast.error("Error al subir la foto");
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAllergyChange = (allergyId: string, checked: boolean) => {
    setSelectedAllergies(prev =>
      checked ? [...prev, allergyId] : prev.filter(id => id !== allergyId)
    );
  };

  const handlePreferenceChange = (prefId: string, checked: boolean) => {
    setSelectedPreferences(prev =>
      checked ? [...prev, prefId] : prev.filter(id => id !== prefId)
    );
  };

  const handleSave = async () => {
    setLoading(true);
    const profileData = {
      ...formData,
      altura: formData.altura ? parseFloat(formData.altura.toString()) : null,
      peso_actual: formData.peso_actual ? parseFloat(formData.peso_actual.toString()) : null,
      peso_objetivo: formData.peso_objetivo ? parseFloat(formData.peso_objetivo.toString()) : null,
      alergias: selectedAllergies,
      preferencias: selectedPreferences
    };

    try {
      const response = await fetch(`${API_URL}/profile/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();
      if (result.success) {
        // Actualizar localStorage para compatibilidad si es necesario, pero preferir contexto
        localStorage.setItem("userData", JSON.stringify({ ...user, profile_complete: result.profile_complete }));
        toast.success("Perfil actualizado correctamente");
        if (result.profile_complete) {
          toast.info("Perfil completo. Ya puedes navegar libremente.");
          navigate("/dashboard");
        }
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientLayout>
      <div className="space-y-4 lg:space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl lg:text-3xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-sm lg:text-base text-muted-foreground mt-1">Gestiona tu información personal y preferencias</p>
        </div>

        <div className="grid gap-4 lg:gap-6 lg:grid-cols-3">
          {/* Profile Photo Card */}
          <Card className="md:col-span-1">
            <CardHeader><CardTitle className="text-sm">Tu Foto</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-primary/10">
                  <AvatarImage src={formData.foto_perfil} />
                  <AvatarFallback className="bg-secondary">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handlePhotoClick}
                  disabled={uploadingPhoto}
                  className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
                >
                  {uploadingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </div>
              <p className="mt-4 text-sm font-semibold">{formData.nombres} {formData.apellidos}</p>
            </CardContent>
          </Card>

          {/* Personal Info Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombres">Nombre</Label>
                  <Input id="nombres" value={formData.nombres} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input id="apellidos" value={formData.apellidos} onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" value={formData.telefono} onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                  <Input id="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genero">Género</Label>
                  <Select value={formData.genero} onValueChange={(val) => setFormData({ ...formData, genero: val })}>
                    <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical Data Card */}
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle className="text-base">Datos Físicos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input id="altura" type="number" value={formData.altura} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="peso_actual">Peso actual (kg)</Label>
                <Input id="peso_actual" type="number" value={formData.peso_actual} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nivel_actividad">Nivel de actividad</Label>
                <Select value={formData.nivel_actividad} onValueChange={(val) => setFormData({ ...formData, nivel_actividad: val })}>
                  <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentario</SelectItem>
                    <SelectItem value="light">Ligera</SelectItem>
                    <SelectItem value="moderate">Moderada</SelectItem>
                    <SelectItem value="active">Activa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Allergies and Preferences */}
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle className="text-base">Alergias</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {allergiesList.map((a) => (
                  <div key={a.id} className="flex items-center space-x-2">
                    <Checkbox id={a.id} checked={selectedAllergies.includes(a.id)} onCheckedChange={(c) => handleAllergyChange(a.id, c as boolean)} />
                    <Label htmlFor={a.id} className="text-xs">{a.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader><CardTitle className="text-base">Preferencias</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {dietPreferencesList.map((p) => (
                  <div key={p.id} className="flex items-center space-x-2">
                    <Checkbox id={p.id} checked={selectedPreferences.includes(p.id)} onCheckedChange={(c) => handlePreferenceChange(p.id, c as boolean)} />
                    <Label htmlFor={p.id} className="text-xs">{p.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="lg:col-span-3">
            <CardHeader><CardTitle className="text-base">Información Adicional</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="objetivos_salud">Objetivos de salud</Label>
                <Textarea id="objetivos_salud" value={formData.objetivos_salud} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condiciones_medicas">Condiciones médicas</Label>
                <Textarea id="condiciones_medicas" value={formData.condiciones_medicas} onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading} className="gap-2 w-full sm:w-auto">
            <Save className="h-4 w-4" />
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </PatientLayout>
  );
}