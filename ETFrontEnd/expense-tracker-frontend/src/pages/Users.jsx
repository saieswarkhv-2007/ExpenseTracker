import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        navigate("/");
        return;
      }
      
      const res = await API.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      
      // Provide specific error messages based on the error type
      if (err.response?.status === 401) {
        setError("Unauthorized: Your session has expired or you don't have admin privileges. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
      } else if (err.response?.status === 403) {
        setError("Forbidden: You don't have permission to access user data.");
      } else if (err.response?.status === 0 || err.message === "Network Error") {
        setError("Network error: Unable to connect to the server. Ensure the server is running on port 2000.");
      } else {
        setError("Failed to load user data from server. Ensure you have administrator rights.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    
    if (!token) {
      navigate("/");
      return;
    }
    
    if (role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }
    
    fetchUsers();
  }, [navigate]);

  return (
    <div className="app-container">
      <Sidebar />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        
        <main className="main-content">
          <div>
            <h1>User Database</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
              Administrator view of all registered application users
            </p>
          </div>

          {error && (
            <div style={{ color: "#ef4444", padding: "12px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.25)" }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>
              Loading user registry...
            </div>
          ) : (
            <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-glow)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "18px" }}>All Registered Users ({users.length})</h2>
                <button className="btn-primary" onClick={fetchUsers} style={{ padding: "8px 16px", fontSize: "13px" }}>
                  🔄 Refresh List
                </button>
              </div>
              <div className="table-container" style={{ border: "none", borderRadius: "0" }}>
                <table className="expense-table" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Assigned Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td style={{ color: "var(--text-muted)", fontWeight: "500" }}>#{user.id}</td>
                          <td style={{ fontWeight: "600" }}>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span 
                              className="category-badge"
                              style={
                                user.role?.name === "ADMIN" 
                                  ? { 
                                      background: "rgba(168, 85, 247, 0.15)", 
                                      color: "#c084fc", 
                                      borderColor: "rgba(168, 85, 247, 0.25)" 
                                    } 
                                  : {
                                      background: "rgba(99, 102, 241, 0.15)",
                                      color: "#a5b4fc",
                                      borderColor: "rgba(99, 102, 241, 0.25)"
                                    }
                              }
                            >
                              {user.role?.name || "USER"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center", color: "var(--text-dim)", padding: "40px" }}>
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Users;
