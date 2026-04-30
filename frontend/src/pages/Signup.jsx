import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await signup({ ...form, role: "ADMIN" });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark">H</span>
          <h1>Create Admin Account</h1>
          <p className="muted">Top-level administrator for your organization</p>
        </div>
        <form onSubmit={submit}>
          <div className="field"><label>Full name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label>Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="field"><label>Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          {error && <div className="alert-error">{error}</div>}
          <button className="btn btn-primary btn-block" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
        </form>
        <div className="auth-foot">Already have an account? <Link to="/">Sign in</Link></div>
      </div>
    </div>
  );
}
