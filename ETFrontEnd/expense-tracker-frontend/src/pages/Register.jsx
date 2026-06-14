import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glow-orb-1"></div>
      <div className="glow-orb-2"></div>
      
      <div className="auth-container">
        <div className="auth-header">
          <h1>Join Us</h1>
          <p>Create an account to start tracking your expenses</p>
        </div>

        <div className="glass-card">
          {success ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ color: "#10b981", fontSize: "18px", fontWeight: "600", marginBottom: "10px" }}>
                ✓ Registration Successful!
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Redirecting you to the login page...
              </p>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              {error && (
                <div style={{ color: "#ef4444", fontSize: "14px", textAlign: "center", marginBottom: "10px" }}>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Assign Role</label>
                <select
                  id="role"
                  className="form-input"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                  required
                  style={{
                    background: "rgba(15, 23, 42, 0.4)",
                    color: "var(--text-main)",
                    cursor: "pointer",
                    appearance: "auto"
                  }}
                >
                  <option value="USER" style={{ background: "#0f172a", color: "#f8fafc" }}>User</option>
                  <option value="ADMIN" style={{ background: "#0f172a", color: "#f8fafc" }}>Admin</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px" }} disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          )}

          {!success && (
            <div className="auth-footer">
              Already have an account? <Link to="/">Login here</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;