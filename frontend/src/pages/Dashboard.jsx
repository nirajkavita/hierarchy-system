import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import HierarchyTree from "../components/HierarchyTree";
import { getUsers, createUser, updateUser, deleteUser } from "../services/user";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("table");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setUsers(await getUsers()); }
    catch (e) { setError(e.response?.data?.message || "Failed to load users"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => ({
    company: users.filter((u) => u.role === "COMPANY").length,
    branch: users.filter((u) => u.role === "BRANCH").length,
    supervisor: users.filter((u) => u.role === "SUPERVISOR").length,
    employee: users.filter((u) => u.role === "EMPLOYEE").length,
  }), [users]);

  const submit = async (data) => {
    try {
      if (editing) await updateUser(editing._id, data);
      else await createUser(data);
      setShowForm(false); setEditing(null); load();
    } catch (e) { alert(e.response?.data?.message || "Save failed"); }
  };

  const remove = async (u) => {
    if (!confirm(`Delete ${u.name}?`)) return;
    try { await deleteUser(u._id); load(); }
    catch (e) { alert(e.response?.data?.message || "Delete failed"); }
  };

  const canCreate = user?.role !== "EMPLOYEE";

  return (
    <div className="app-shell">
      <Navbar />
      <main className="container">
        <section className="hero">
          <div>
            <h2>Welcome back, {user?.name}</h2>
            <p className="muted">Manage your organization's users and hierarchy.</p>
          </div>
          {canCreate && (
            <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
              + Add User
            </button>
          )}
        </section>

        <section className="stats">
          <div className="stat"><div className="stat-label">Companies</div><div className="stat-value">{stats.company}</div></div>
          <div className="stat"><div className="stat-label">Branches</div><div className="stat-value">{stats.branch}</div></div>
          <div className="stat"><div className="stat-label">Supervisors</div><div className="stat-value">{stats.supervisor}</div></div>
          <div className="stat"><div className="stat-label">Employees</div><div className="stat-value">{stats.employee}</div></div>
        </section>

        {showForm && (
          <UserForm
            currentUser={user}
            users={users}
            editing={editing}
            onSubmit={submit}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        )}

        <section className="card">
          <div className="card-header tabs">
            <div>
              <h3>Users</h3>
              <p className="muted">Browse and manage everyone in your hierarchy.</p>
            </div>
            <div className="tab-group">
              <button className={`tab ${view === "table" ? "active" : ""}`} onClick={() => setView("table")}>Table</button>
              <button className={`tab ${view === "tree" ? "active" : ""}`} onClick={() => setView("tree")}>Tree</button>
            </div>
          </div>

          {error && <div className="alert-error">{error}</div>}
          {loading ? <div className="empty">Loading...</div> : view === "table"
            ? <UserTable users={users} onEdit={(u) => { setEditing(u); setShowForm(true); }} onDelete={remove} />
            : <HierarchyTree users={users} />
          }
        </section>
      </main>
    </div>
  );
}
