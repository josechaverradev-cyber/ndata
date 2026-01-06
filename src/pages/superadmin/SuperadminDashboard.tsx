import { SuperadminLayout } from "@/layouts/SuperadminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCog, Building2, TrendingUp, Activity, DollarSign, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const statsData = [
  { name: "Ene", usuarios: 120, ingresos: 4500 },
  { name: "Feb", usuarios: 180, ingresos: 6200 },
  { name: "Mar", usuarios: 250, ingresos: 8100 },
  { name: "Abr", usuarios: 320, ingresos: 10500 },
  { name: "May", usuarios: 410, ingresos: 13200 },
  { name: "Jun", usuarios: 520, ingresos: 16800 },
];

const recentActivity = [
  { id: 1, action: "Nuevo nutricionista registrado", user: "Dra. Ana López", time: "Hace 5 min", type: "user" },
  { id: 2, action: "Plan Premium activado", user: "Clínica Salud Total", time: "Hace 15 min", type: "billing" },
  { id: 3, action: "Alerta de seguridad", user: "Sistema", time: "Hace 30 min", type: "alert" },
  { id: 4, action: "Nueva organización creada", user: "Centro Nutrición Plus", time: "Hace 1 hora", type: "org" },
  { id: 5, action: "Usuario desactivado", user: "carlos@email.com", time: "Hace 2 horas", type: "user" },
];

export default function SuperadminDashboard() {
  return (
    <SuperadminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-xl sm:text-3xl font-bold text-foreground">Dashboard SuperAdmin</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Vista general del sistema</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Usuarios</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">2,847</div>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +12.5% este mes
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nutricionistas</CardTitle>
              <UserCog className="h-5 w-5 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">156</div>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +8 nuevos
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Organizaciones</CardTitle>
              <Building2 className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">42</div>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +3 este mes
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Mensuales</CardTitle>
              <DollarSign className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">$16,800</div>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +27% vs mes anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Crecimiento de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="usuarios"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary) / 0.2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Ingresos Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="ingresos" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${activity.type === 'alert' ? 'bg-destructive/10' :
                      activity.type === 'billing' ? 'bg-accent/10' :
                        activity.type === 'org' ? 'bg-warning/10' : 'bg-primary/10'
                    }`}>
                    {activity.type === 'alert' ? <AlertTriangle className="h-5 w-5 text-destructive" /> :
                      activity.type === 'billing' ? <DollarSign className="h-5 w-5 text-accent" /> :
                        activity.type === 'org' ? <Building2 className="h-5 w-5 text-warning" /> :
                          <Users className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperadminLayout>
  );
}
