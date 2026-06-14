import { NavLink } from "react-router-dom";

function Sidebar() {
  const userRole = localStorage.getItem("userRole") || "USER";

  return (
    <div className="sidebar">
      <div className="sidebar-brand">Expense Tracker</div>
      
      <ul className="sidebar-menu">
        <li>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <span style={{ fontSize: "18px" }}>📊</span> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/expenses" 
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <span style={{ fontSize: "18px" }}>💸</span> Expenses
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/analytics" 
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <span style={{ fontSize: "18px" }}>📈</span> Analytics
          </NavLink>
        </li>
        {userRole === "ADMIN" && (
          <li>
            <NavLink 
              to="/users" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <span style={{ fontSize: "18px" }}>👥</span> User Data
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;