import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";
import { useNavigate } from "react-router-dom";

function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch {
      setError("Failed to load expenses from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Basic session guard
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    fetchExpenses();
  }, [navigate]);

  const handleExpenseAdded = () => {
    // Refresh list from server to get accurate database entries (and category relations)
    fetchExpenses();
  };

  const handleExpenseDeleted = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }
    try {
      await API.delete(`/expenses/${id}`);
      // Remove from local state immediately
      setExpenses(expenses.filter((e) => e.id !== id));
    } catch {
      alert("Failed to delete expense. Try again.");
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        
        <main className="main-content">
          <div>
            <h1>Manage Expenses</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
              Log, review, and filter your tracked budget items below
            </p>
          </div>

          {error && (
            <div style={{ color: "#ef4444", padding: "12px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)" }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>
              Loading your expenses...
            </div>
          ) : (
            <>
              <ExpenseForm onExpenseAdded={handleExpenseAdded} />
              <ExpenseTable 
                expenses={expenses} 
                onExpenseDeleted={handleExpenseDeleted} 
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Expenses;