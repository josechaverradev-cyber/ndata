import { AdminLayout } from "@/layouts/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { useAuth } from "@/hooks/useAuth";
import { RecentPatients } from "@/components/admin/RecentPatients";
import { UpcomingAppointments } from "@/components/admin/UpcomingAppointments";
import { NutritionChart } from "@/components/admin/NutritionChart";
import { QuickActions } from "@/components/admin/QuickActions";
import { Users, Apple, Calendar, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

// API Configuration
import { API_URL } from "@/config/api";

interface DashboardStats {
  patients: {
    total: number;
    change: string;
    change_type: string;
  };
  plans: {
    total: number;
    change: string;
    change_type: string;
  };
  appointments: {
    total: number;
    pending_today: number;
    change: string;
    change_type: string;
  };
  progress: {
    average: number;
    change: string;
    change_type: string;
  };
}

interface RecentPatient {
  id: number;
  name: string;
  avatar: string | null;
  email: string;
  plan: string;
  status: string;
  joined: string;
  registered_at: string | null;
}

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

const Index = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPatients, setRecentPatients] = useState<RecentPatient[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('🔄 Iniciando fetch de datos del dashboard...');

        // Fetch stats, pacientes y citas en paralelo
        const [statsResponse, patientsResponse, appointmentsResponse] = await Promise.all([
          fetch(`${API_URL}/dashboard/stats`),
          fetch(`${API_URL}/dashboard/recent-patients?limit=5`),
          fetch(`${API_URL}/dashboard/upcoming-appointments?limit=5`)
        ]);

        console.log('📊 Stats response status:', statsResponse.status);
        console.log('👥 Patients response status:', patientsResponse.status);
        console.log('📅 Appointments response status:', appointmentsResponse.status);

        if (!statsResponse.ok) {
          throw new Error(`Error al cargar las estadísticas: ${statsResponse.status}`);
        }
        if (!patientsResponse.ok) {
          throw new Error(`Error al cargar pacientes recientes: ${patientsResponse.status}`);
        }
        if (!appointmentsResponse.ok) {
          throw new Error(`Error al cargar citas: ${appointmentsResponse.status}`);
        }

        const [statsData, patientsData, appointmentsData] = await Promise.all([
          statsResponse.json(),
          patientsResponse.json(),
          appointmentsResponse.json()
        ]);

        console.log('✅ Stats data:', statsData);
        console.log('✅ Patients data:', patientsData);
        console.log('✅ Appointments data:', appointmentsData);
        console.log('📝 Número de pacientes recibidos:', patientsData.length);
        console.log('📝 Número de citas recibidas:', appointmentsData.length);

        setStats(statsData);
        setRecentPatients(patientsData);
        setUpcomingAppointments(appointmentsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido";
        console.error('❌ Error fetching dashboard data:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
        console.log('✔️ Fetch completado, loading = false');
      }
    };

    fetchDashboardData();
  }, []);

  // Log cuando cambia el estado
  useEffect(() => {
    console.log('🔄 Estado actualizado:');
    console.log('  - Loading:', loading);
    console.log('  - Error:', error);
    console.log('  - Stats:', stats);
    console.log('  - Patients count:', recentPatients.length);
    console.log('  - Appointments count:', upcomingAppointments.length);
  }, [loading, error, stats, recentPatients, upcomingAppointments]);

  // Mostrar estado de carga
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error al cargar el dashboard</p>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Reintentar
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenida, {user?.name || "Dra. García"}. Aquí está el resumen de tu día.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Pacientes Activos"
            value={stats?.patients.total.toString() || "0"}
            change={stats?.patients.change || "+0% este mes"}
            changeType={stats?.patients.change_type as "positive" | "negative" | "neutral"}
            icon={Users}
            iconColor="primary"
          />
          <StatsCard
            title="Planes Activos"
            value={stats?.plans.total.toString() || "0"}
            change={stats?.plans.change || "+0% este mes"}
            changeType={stats?.plans.change_type as "positive" | "negative" | "neutral"}
            icon={Apple}
            iconColor="accent"
          />
          <StatsCard
            title="Citas Esta Semana"
            value={stats?.appointments.total.toString() || "0"}
            change={stats?.appointments.change || "0 pendientes hoy"}
            changeType={stats?.appointments.change_type as "positive" | "negative" | "neutral"}
            icon={Calendar}
            iconColor="info"
          />
          <StatsCard
            title="Progreso Promedio"
            value={`${stats?.progress.average || 0}%`}
            change={stats?.progress.change || "+0% vs mes anterior"}
            changeType={stats?.progress.change_type as "positive" | "negative" | "neutral"}
            icon={TrendingUp}
            iconColor="warning"
          />
        </div>

        {/* Main content grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart - 2 columns */}
          <div className="lg:col-span-2">
            <NutritionChart />
          </div>
          {/* Quick Actions - 1 column */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Bottom grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <UpcomingAppointments appointments={upcomingAppointments} loading={loading} />
          <RecentPatients patients={recentPatients} loading={loading} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Index;