import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";

function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Computed states
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [thisMonthExpenses, setThisMonthExpenses] = useState(0);
  const [highestCategory, setHighestCategory] = useState({ name: "None", value: 0 });
  const [chartData, setChartData] = useState([]);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      const data = res.data || [];
      setExpenses(data);
      calculateStats(data);
    } catch {
      // Set empty state if failed to load
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const calculateStats = (data) => {
    if (!data || data.length === 0) {
      setTotalExpenses(0);
      setThisMonthExpenses(0);
      setHighestCategory({ name: "None", value: 0 });
      setChartData([]);
      return;
    }

    // 1. Total expenses
    const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
    setTotalExpenses(total);

    // 2. This month's expenses
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthSum = data.reduce((sum, item) => {
      if (!item.expenseDate) return sum;
      const d = new Date(item.expenseDate);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        return sum + (item.amount || 0);
      }
      return sum;
    }, 0);
    setThisMonthExpenses(monthSum);

    // 3. Category grouping
    const categories = {};
    data.forEach((item) => {
      const name = item.category?.categoryName || "Uncategorized";
      categories[name] = (categories[name] || 0) + (item.amount || 0);
    });

    // Highest category calculation
    let maxCat = { name: "None", value: 0 };
    Object.keys(categories).forEach((key) => {
      if (categories[key] > maxCat.value) {
        maxCat = { name: key, value: categories[key] };
      }
    });
    setHighestCategory(maxCat);

    // 4. Formulate chart data
    const formattedChart = Object.keys(categories).map((key) => ({
      name: key,
      value: parseFloat(categories[key].toFixed(2)),
    }));
    setChartData(formattedChart);
  };

  const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#a855f7", "#f59e0b", "#f43f5e"];

  const formatCurrency = (val) => {
    return `₹${parseFloat(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="app-container">
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <main className="main-content">
          <div>
            <h1>Dashboard Overview</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
              Welcome back! Here is a summary of your financial activities.
            </p>
          </div>

          {loading ? (
            <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>
              Loading dashboard statistics...
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="summary-grid">
                <div className="glass-card stat-card blue">
                  <h3>Total Expenses</h3>
                  <div className="stat-value">{formatCurrency(totalExpenses)}</div>
                </div>

                <div className="glass-card stat-card green">
                  <h3>This Month</h3>
                  <div className="stat-value">{formatCurrency(thisMonthExpenses)}</div>
                </div>

                <div className="glass-card stat-card purple">
                  <h3>Highest Category</h3>
                  <div className="stat-value" style={{ fontSize: "24px" }}>
                    {highestCategory.name} ({formatCurrency(highestCategory.value)})
                  </div>
                </div>
              </div>

              {/* Chart section */}
              <div className="dashboard-grid">
                <div className="glass-card chart-card">
                  <h2>Category Distribution</h2>
                  <div style={{ width: "100%", height: 350, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={105}
                            paddingAngle={4}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {chartData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                                stroke="rgba(15, 23, 42, 0.8)" 
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              background: "rgba(15, 23, 42, 0.95)", 
                              border: "1px solid var(--border-glow)", 
                              borderRadius: "8px",
                              color: "white" 
                            }}
                            formatter={(value) => formatCurrency(value)}
                          />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ color: "var(--text-dim)" }}>
                        No data available to display chart.
                      </div>
                    )}
                  </div>
                </div>

                <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h2>Recent Logged Activity</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {expenses && expenses.length > 0 ? (
                      expenses.slice(-4).reverse().map((exp) => (
                        <div 
                          key={exp.id} 
                          style={{ 
                            padding: "12px", 
                            borderRadius: "8px", 
                            background: "rgba(255, 255, 255, 0.02)", 
                            border: "1px solid var(--border-glow)",
                            display: "flex",
                            justifyContent: "between",
                            alignItems: "center"
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "600", fontSize: "14px" }}>{exp.description}</div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{exp.category?.categoryName || "Uncategorized"}</div>
                          </div>
                          <div style={{ fontWeight: "700", color: "#38bdf8" }}>
                            {formatCurrency(exp.amount)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ color: "var(--text-dim)", textAlign: "center", padding: "20px" }}>
                        No recent expenses.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;