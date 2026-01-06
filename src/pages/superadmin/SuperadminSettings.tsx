import { useState } from "react";
import { SuperadminLayout } from "@/layouts/SuperadminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Bell,
  Mail,
  Database,
  Lock,
  Globe,
  Save
} from "lucide-react";
import { toast } from "sonner";

export default function SuperadminSettings() {
  const [settings, setSettings] = useState({
    siteName: "NutriData",
    supportEmail: "soporte@NutriData.com",
    maxUsersPerOrg: 100,
    maxPatientsPerNutritionist: 50,
    enableRegistration: true,
    requireEmailVerification: true,
    enableTwoFactor: false,
    maintenanceMode: false,
    emailNotifications: true,
    slackNotifications: false,
  });

  const handleSave = () => {
    toast.success("Configuración guardada");
  };

  return (
    <SuperadminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración del Sistema</h1>
          <p className="text-muted-foreground">Ajustes globales de la plataforma</p>
        </div>

        {/* General Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre del Sitio</Label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email de Soporte</Label>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Máx. usuarios por organización</Label>
                <Input
                  type="number"
                  value={settings.maxUsersPerOrg}
                  onChange={(e) => setSettings({ ...settings, maxUsersPerOrg: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Máx. pacientes por nutricionista</Label>
                <Input
                  type="number"
                  value={settings.maxPatientsPerNutritionist}
                  onChange={(e) => setSettings({ ...settings, maxPatientsPerNutritionist: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Permitir Registro Público</p>
                <p className="text-sm text-muted-foreground">Los usuarios pueden crear cuentas sin invitación</p>
              </div>
              <Switch
                checked={settings.enableRegistration}
                onCheckedChange={(checked) => setSettings({ ...settings, enableRegistration: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Verificación de Email</p>
                <p className="text-sm text-muted-foreground">Requerir verificación de email al registrarse</p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Autenticación de Dos Factores</p>
                <p className="text-sm text-muted-foreground">Habilitar 2FA para todos los usuarios</p>
              </div>
              <Switch
                checked={settings.enableTwoFactor}
                onCheckedChange={(checked) => setSettings({ ...settings, enableTwoFactor: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Modo Mantenimiento</p>
                <p className="text-sm text-muted-foreground">Bloquear acceso excepto a superadmins</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Notificaciones por Email</p>
                  <p className="text-sm text-muted-foreground">Recibir alertas del sistema por email</p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Integración Slack</p>
                  <p className="text-sm text-muted-foreground">Enviar alertas a canal de Slack</p>
                </div>
              </div>
              <Switch
                checked={settings.slackNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, slackNotifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50 bg-card">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Zona de Peligro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10">
              <div>
                <p className="font-medium text-foreground">Restablecer Sistema</p>
                <p className="text-sm text-muted-foreground">Eliminar todos los datos y configuraciones</p>
              </div>
              <Button variant="destructive">Restablecer</Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gradient-primary border-0">
            <Save className="h-4 w-4 mr-2" />
            Guardar Configuración
          </Button>
        </div>
      </div>
    </SuperadminLayout>
  );
}
