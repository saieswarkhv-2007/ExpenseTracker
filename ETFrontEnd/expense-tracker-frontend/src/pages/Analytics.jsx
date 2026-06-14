import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { 
  PieChart, 
  Pie, 
  Tooltip, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Legend, 
  CartesianGrid 
} from "recharts";

function Analytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      const data = res.data || [];
      processData(data);
    } catch {
      setCategoryData([]);
      setMonthlyData([]);
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

  const processData = (expensesList) => {
    if (!expensesList || expensesList.length === 0) {
      setCategoryData([]);
      setMonthlyData([]);
      return;
    }

    // 1. Group by category
    const catMap = {};
    expensesList.forEach((e) => {
      const name = e.category?.categoryName || "Uncategorized";
      catMap[name] = (catMap[name] || 0) + (e.amount || 0);
    });

    const categories = Object.keys(catMap).map((key) => ({
      name: key,
      value: parseFloat(catMap[key].toFixed(2)),
    }));
    setCategoryData(categories);

    // 2. Group by month
    const monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthMap = {};
    
    // Initialize current and previous 5 months to ensure chart looks populated even with low data
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${monthsName[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
      monthMap[label] = { sortKey: d.getTime(), amount: 0, label };
    }

    expensesList.forEach((e) => {
      if (!e.expenseDate) return;
      const d = new Date(e.expenseDate);
      const label = `${monthsName[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
      
      if (monthMap[label]) {
        monthMap[label].amount += e.amount;
      } else {
        monthMap[label] = {
          sortKey: new Date(d.getFullYear(), d.getMonth(), 1).getTime(),
          amount: e.amount,
          label
        };
      }
    });

    const sortedMonths = Object.values(monthMap)
      .sort((a, b) => a.sortKey - b.sortKey)
      .map((m) => ({
        month: m.label,
        amount: parseFloat(m.amount.toFixed(2)),
      }));

    setMonthlyData(sortedMonths);
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
            <h1>Expense Analytics</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
              Deep dive into your expense breakdowns and historical spending trends.
            </p>
          </div>

          {loading ? (
            <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>
              Loading analytics report...
            </div>
          ) : (
            <div className="analytics-grid">
              
              {/* Category Breakdown (Pie) */}
              <div className="glass-card chart-card">
                <h2>Spending by Category</h2>
                <div style={{ width: "100%", height: 350, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {categoryData.map((entry, index) => (
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
                      No category records to analyze.
                    </div>
                  )}
                </div>
              </div>

              {/* Monthly Spending Trend (Bar) */}
              <div className="glass-card chart-card">
                <h2>Monthly Spending Trend</h2>
                <div style={{ width: "100%", height: 350 }}>
                  {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={monthlyData}
                        margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                      >
                        {/* Define gradients for the bars */}
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
                          </linearGradient>
                        </defs>
                        
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                        
                        <XAxis 
                          dataKey="month" 
                          stroke="var(--text-muted)" 
                          fontSize={12}
                          tickLine={false}
                        />
                        
                        <YAxis 
                          stroke="var(--text-muted)" 
                          fontSize={12}
                          tickLine={false}
                          tickFormatter={(val) => `₹${val}`}
                        />
                        
                        <Tooltip 
                          contentStyle={{ 
                            background: "rgba(15, 23, 42, 0.95)", 
                            border: "1px solid var(--border-glow)", 
                            borderRadius: "8px",
                            color: "white" 
                          }}
                          formatter={(value) => formatCurrency(value)}
                          labelStyle={{ fontWeight: "600" }}
                        />
                        
                        <Bar 
                          dataKey="amount" 
                          fill="url(#barGradient)" 
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ color: "var(--text-dim)", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                      No transaction history to plot trends.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Analytics;