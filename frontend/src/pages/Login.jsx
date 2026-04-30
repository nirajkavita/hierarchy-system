import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark">H</span>
          <h1>Hierarchy Manager</h1>
          <p className="muted">Sign in to manage your organization</p>
        </div>
        <form onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          {error && <div className="alert-error">{error}</div>}
          <button className="btn btn-primary btn-block" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <div className="auth-foot">
          New here? <Link to="/signup">Create an admin account</Link>
        </div>
      </div>
    </div>
  );
}
