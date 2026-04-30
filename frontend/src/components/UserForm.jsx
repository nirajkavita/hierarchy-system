import { useEffect, useMemo, useState } from "react";

const ROLE_OPTIONS_BY_CREATOR = {
  ADMIN: ["COMPANY", "BRANCH", "SUPERVISOR", "EMPLOYEE"],
  COMPANY: ["BRANCH", "SUPERVISOR", "EMPLOYEE"],
  BRANCH: ["SUPERVISOR", "EMPLOYEE"],
  SUPERVISOR: ["EMPLOYEE"],
};

export default function UserForm({ currentUser, users, onSubmit, onCancel, editing }) {
  const allowedRoles = ROLE_OPTIONS_BY_CREATOR[currentUser.role] || [];
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: allowedRoles[0] || "",
    company: "",
    branch: "",
    supervisor: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        email: editing.email || "",
        password: "",
        role: editing.role,
        company: editing.company?._id || editing.company || "",
        branch: editing.branch?._id || editing.branch || "",
        supervisor: editing.supervisor?._id || editing.supervisor || "",
      });
    }
  }, [editing]);

  const companies = useMemo(() => users.filter((u) => u.role === "COMPANY"), [users]);
  const branches = useMemo(
    () => users.filter((u) => u.role === "BRANCH" && (!form.company || (u.company?._id || u.company) === form.company)),
    [users, form.company]
  );
  const supervisors = useMemo(
    () => users.filter((u) => u.role === "SUPERVISOR" && (!form.branch || (u.branch?._id || u.branch) === form.branch)),
    [users, form.branch]
  );

  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (editing && !payload.password) delete payload.password;
    if (payload.role === "COMPANY") { payload.company = ""; payload.branch = ""; payload.supervisor = ""; }
    if (payload.role === "BRANCH") { payload.branch = ""; payload.supervisor = ""; }
    if (payload.role === "SUPERVISOR") { payload.supervisor = ""; }
    onSubmit(payload);
  };

  return (
    <form className="card form-card" onSubmit={submit}>
      <div className="card-header">
        <h3>{editing ? "Edit User" : "Add New User"}</h3>
        <p className="muted">Fill in the details below to {editing ? "update" : "create"} a user under your hierarchy.</p>
      </div>

      <div className="grid-2">
        <div className="field">
          <label>Full name</label>
          <input value={form.name} onChange={(e) => change("name", e.target.value)} required />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => change("email", e.target.value)} required />
        </div>
        <div className="field">
          <label>Password {editing && <span className="muted">(leave blank to keep)</span>}</label>
          <input type="password" value={form.password} onChange={(e) => change("password", e.target.value)} {...(!editing && { required: true })} />
        </div>
        <div className="field">
          <label>Role</label>
          <select value={form.role} onChange={(e) => change("role", e.target.value)} required>
            {allowedRoles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {(form.role === "BRANCH" || form.role === "SUPERVISOR" || form.role === "EMPLOYEE") && currentUser.role === "ADMIN" && (
          <div className="field">
            <label>Company <span className="muted">(optional)</span></label>
            <select value={form.company} onChange={(e) => change("company", e.target.value)}>
              <option value="">— None —</option>
              {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
        )}

        {(form.role === "SUPERVISOR" || form.role === "EMPLOYEE") && currentUser.role !== "SUPERVISOR" && (
          <div className="field">
            <label>Branch <span className="muted">(optional)</span></label>
            <select value={form.branch} onChange={(e) => change("branch", e.target.value)}>
              <option value="">— None —</option>
              {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
        )}

        {form.role === "EMPLOYEE" && (
          <div className="field">
            <label>Supervisor <span className="muted">(optional)</span></label>
            <select value={form.supervisor} onChange={(e) => change("supervisor", e.target.value)}>
              <option value="">— None —</option>
              {supervisors.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="form-actions">

        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{editing ? "Update User" : "Create User"}</button>
      </div>
    </form>
  );
}
