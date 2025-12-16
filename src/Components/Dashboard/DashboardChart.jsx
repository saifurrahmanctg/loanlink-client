import { useEffect, useState } from "react";
import { useAuth } from "../../Provider/AuthProvider";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function DashboardChart() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/dashboard/stats/${user.email}`
        );
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRole(data.role);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // Prepare data for Recharts
  const chartData = stats.map((s) => ({
    name: s.label,
    value: s.value,
  }));

  return (
    <section className="py-10 px-6 bg-base-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-rajdhani text-3xl font-bold mb-6 text-center">
          Dashboard <span className="text-gradient">Stats Chart</span>
        </h2>

        {loading ? (
          <div className="flex justify-center items-center gap-3">
            <span className="loading loading-spinner loading-xl text-info"></span>
            <h3 className="text-gradient text-xl font-bold">
              Dashboard Chart is Loading . . .
            </h3>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => new Intl.NumberFormat().format(value)}
              />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
