import { useState, useEffect } from 'react';
import { PatientLayout } from "@/layouts/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Flame, Dumbbell, Clock, Calendar, User, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Meal {
  meal: string;
  food: string;
  calories: number;
  time: string;
}

interface PlanData {
  has_plan: boolean;
  plan_name?: string;
  doctor?: string;
  start_date?: string;
  duration?: string;
  stats?: {
    calories: { target: number };
    protein: { target: number };
    carbs: { target: number };
    fat: { target: number };
  };
  week_plan?: {
    [key: string]: Meal[];
  };
  message?: string;
}

export default function MyPlan() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState<PlanData | null>(null);

  const { user, isLoading: isAuthLoading } = useAuth();
  const patientId = user?.id;

  useEffect(() => {
    if (!isAuthLoading) {
      if (patientId) {
        fetchPlanData();
      } else {
        setLoading(false);
      }
    }
  }, [isAuthLoading, patientId]);

  const fetchPlanData = async () => {
    try {
      const response = await fetch(`${API_URL}/patient/${patientId}/plan/weekly`);
      if (!response.ok) throw new Error('Error al cargar el plan');
      const data = await response.json();
      setPlanData(data);
    } catch (error) {
      console.error('Error fetching plan:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar tu plan nutricional",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </PatientLayout>
    );
  }

  if (!planData || !planData.has_plan) {
    return (
      <PatientLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Card className="p-8 text-center max-w-md border-border shadow-card">
            <Apple className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold">No tienes un plan activo</h2>
            <p className="text-muted-foreground mt-2">
              {planData?.message || "Tu nutricionista aún no te ha asignado un plan de alimentación activo."}
            </p>
          </Card>
        </div>
      </PatientLayout>
    );
  }

  const { plan_name, doctor, start_date, duration, stats, week_plan, message } = planData;

  const days = [
    { id: "lunes", label: "Lun" },
    { id: "martes", label: "Mar" },
    { id: "miercoles", label: "Mié" },
    { id: "jueves", label: "Jue" },
    { id: "viernes", label: "Vie" },
    { id: "sabado", label: "Sáb" },
    { id: "domingo", label: "Dom" },
  ];

  return (
    <PatientLayout>
      <div className="space-y-4 lg:space-y-6 animate-fade-in">
        {/* Plan Header */}
        <Card className="border-border shadow-card overflow-hidden">
          <div className="gradient-primary p-4 lg:p-6 text-primary-foreground">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <Badge className="bg-white/20 text-white border-0 mb-2 lg:mb-3 text-[10px] lg:text-xs uppercase tracking-wider font-bold">Plan Activo</Badge>
                <h1 className="text-lg lg:text-2xl font-bold">{plan_name}</h1>
                <p className="text-xs lg:text-sm opacity-90 mt-1">Sigue tu guía para alcanzar tus metas</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="flex items-center gap-2 text-xs lg:text-sm opacity-90 sm:justify-end">
                  <User className="h-3 w-3 lg:h-4 lg:w-4" />
                  {doctor || "Tu Nutricionista"}
                </div>
                <div className="flex items-center gap-2 text-xs lg:text-sm opacity-90 mt-1 sm:justify-end">
                  <Calendar className="h-3 w-3 lg:h-4 lg:w-4" />
                  Inicio: {start_date || "Pendiente"}
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-3 lg:p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
              <div className="text-center p-2 lg:p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-[10px] lg:text-sm text-muted-foreground uppercase font-medium">Calorías Meta</p>
                <p className="text-base lg:text-2xl font-bold text-foreground mt-1">
                  {stats?.calories?.target || 0}<span className="text-[10px] lg:text-sm font-normal text-muted-foreground"> kcal</span>
                </p>
              </div>
              <div className="text-center p-2 lg:p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-[10px] lg:text-sm text-muted-foreground uppercase font-medium">Proteína</p>
                <p className="text-base lg:text-2xl font-bold text-foreground mt-1">
                  {stats?.protein?.target || 0}g
                </p>
              </div>
              <div className="text-center p-2 lg:p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-[10px] lg:text-sm text-muted-foreground uppercase font-medium">Carbos</p>
                <p className="text-base lg:text-2xl font-bold text-foreground mt-1">
                  {stats?.carbs?.target || 0}g
                </p>
              </div>
              <div className="text-center p-2 lg:p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-[10px] lg:text-sm text-muted-foreground uppercase font-medium">Grasas</p>
                <p className="text-base lg:text-2xl font-bold text-foreground mt-1">
                  {stats?.fat?.target || 0}g
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Message */}
        {message && (
          <Card className="border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Apple className="h-4 w-4" />
              </div>
              <p className="text-sm text-primary font-medium">{message}</p>
            </CardContent>
          </Card>
        )}

        {/* Weekly Plan */}
        <Card className="border-border shadow-card">
          <CardHeader className="pb-3 lg:pb-6">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
              <Apple className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              Menú Semanal
            </CardTitle>
            <CardDescription className="text-xs lg:text-sm">Tu planificación diaria personalizada</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="lunes" className="w-full">
              <TabsList className="grid w-full grid-cols-7 mb-4 lg:mb-6 h-8 lg:h-10">
                {days.map(day => (
                  <TabsTrigger key={day.id} value={day.id} className="text-[10px] lg:text-sm px-1 lg:px-3">
                    {day.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {days.map(day => (
                <TabsContent key={day.id} value={day.id} className="space-y-2 lg:space-y-3">
                  {week_plan && week_plan[day.id] && week_plan[day.id].length > 0 ? (
                    week_plan[day.id].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 lg:p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-center gap-2 lg:gap-4 min-w-0">
                          <div className="flex h-8 w-8 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-sm lg:text-base">{item.meal}</p>
                            <p className="text-xs lg:text-sm text-muted-foreground line-clamp-2">{item.food}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                          <Badge variant="secondary" className="flex items-center gap-1 text-[10px] lg:text-xs bg-accent/10 text-accent-foreground border-accent/20">
                            <Flame className="h-3 w-3" />
                            {item.calories} kcal
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-medium">{item.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 lg:py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border">
                      <Apple className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-3 opacity-30" />
                      <p className="text-xs lg:text-sm font-medium">
                        {message ? "Menú pendiente de carga" : "No hay comidas programadas para este día"}
                      </p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Objectives */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
          <Card className="border-border shadow-card hover:border-primary/30 transition-colors">
            <CardContent className="p-3 lg:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Flame className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs lg:text-sm text-muted-foreground truncate font-medium">OBJETIVO CALÓRICO</p>
                  <p className="text-base lg:text-xl font-bold text-foreground">{stats?.calories?.target || 0} kcal/día</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-card hover:border-accent/30 transition-colors">
            <CardContent className="p-3 lg:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <Dumbbell className="h-5 w-5 lg:h-6 lg:w-6 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs lg:text-sm text-muted-foreground truncate font-medium">ACTIVIDAD FÍSICA</p>
                  <p className="text-base lg:text-xl font-bold text-foreground">Según tu perfil</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-card hover:border-info/30 transition-colors">
            <CardContent className="p-3 lg:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-xl bg-info/10">
                  <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-info" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs lg:text-sm text-muted-foreground truncate font-medium">DURACIÓN</p>
                  <p className="text-base lg:text-xl font-bold text-foreground">{duration || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
}
