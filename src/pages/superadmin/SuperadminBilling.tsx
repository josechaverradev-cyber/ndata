import { SuperadminLayout } from "@/layouts/SuperadminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const revenueData = [
  { name: "Ene", ingresos: 12500, gastos: 3200 },
  { name: "Feb", ingresos: 15800, gastos: 3500 },
  { name: "Mar", ingresos: 18200, gastos: 4100 },
  { name: "Abr", ingresos: 21500, gastos: 4800 },
  { name: "May", ingresos: 25800, gastos: 5200 },
  { name: "Jun", ingresos: 28900, gastos: 5800 },
];

const planDistribution = [
  { name: "Enterprise", value: 8, color: "hsl(var(--accent))" },
  { name: "Premium", value: 18, color: "hsl(var(--primary))" },
  { name: "Basic", value: 12, color: "hsl(var(--info))" },
  { name: "Free", value: 4, color: "hsl(var(--muted-foreground))" },
];

const recentTransactions = [
  { id: 1, org: "Centro Nutrición Plus", amount: 299, plan: "Enterprise", date: "2024-12-20", status: "completed" },
  { id: 2, org: "Clínica Salud Total", amount: 99, plan: "Premium", date: "2024-12-19", status: "completed" },
  { id: 3, org: "Consultorio Bienestar", amount: 49, plan: "Basic", date: "2024-12-18", status: "completed" },
  { id: 4, org: "NutriVida Integral", amount: 99, plan: "Premium", date: "2024-12-17", status: "pending" },
  { id: 5, org: "Clínica del Norte", amount: 99, plan: "Premium", date: "2024-12-16", status: "failed" },
];

export default function SuperadminBilling() {
  return (
    <SuperadminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Facturación</h1>
            <p className="text-muted-foreground">Gestión de ingresos y pagos</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos del Mes</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">$28,900</div>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" />
                +12% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">MRR</CardTitle>
              <TrendingUp className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">$24,500</div>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" />
                +8% crecimiento
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Suscripciones Activas</CardTitle>
              <CreditCard className="h-5 w-5 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">38</div>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" />
                +3 nuevas
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Churn Rate</CardTitle>
              <Receipt className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">2.3%</div>
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <ArrowDownRight className="h-3 w-3" />
                -0.5% vs anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border bg-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Ingresos vs Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
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
                      dataKey="ingresos" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary) / 0.2)" 
                      name="Ingresos"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="gastos" 
                      stroke="hsl(var(--destructive))" 
                      fill="hsl(var(--destructive) / 0.2)" 
                      name="Gastos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Distribución de Planes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {planDistribution.map((plan) => (
                  <div key={plan.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: plan.color }} />
                    <span className="text-sm text-muted-foreground">{plan.name}: {plan.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Transacciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tx.org}</p>
                      <p className="text-sm text-muted-foreground">Plan {tx.plan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">${tx.amount}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{tx.date}</span>
                      {tx.status === "completed" && <Badge className="bg-success/10 text-success border-0">Completado</Badge>}
                      {tx.status === "pending" && <Badge className="bg-warning/10 text-warning border-0">Pendiente</Badge>}
                      {tx.status === "failed" && <Badge className="bg-destructive/10 text-destructive border-0">Fallido</Badge>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperadminLayout>
  );
}
