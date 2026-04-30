import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <span className="brand-mark">H</span>
          <div>
            <div className="brand-title">Hierarchy Manager</div>
            <div className="brand-sub">Role-based organization control</div>
          </div>
        </div>
        {user && (
          <div className="navbar-right">
            <div className="user-chip">
              <div className="user-name">{user.name}</div>
              <div className={`role-badge role-${user.role?.toLowerCase()}`}>{user.role}</div>
            </div>
            <button className="btn btn-ghost" onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
