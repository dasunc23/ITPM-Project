import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", campus: "", year: "", role: "user" });
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.campus || !form.year) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!/[0-9]/.test(form.password) || !/[A-Za-z]/.test(form.password)) {
      setError("Password must contain letters and numbers.");
      return;
    }

    try {
      const userData = { ...form, role: "user" };
      await axios.post("http://localhost:5000/api/users", userData);
      setError("");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Unable to sign up; please try again");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#0a1a38", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "920px", display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: "20px", overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,0.5)" }}>
        <div style={{ background: "linear-gradient(130deg, #00a76f 0%, #01673a 100%)", color: "#fff", padding: "46px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ margin: 0, fontSize: "34px", letterSpacing: "1px" }}>Welcome Back!</h1>
          <p style={{ margin: "12px 0 24px", fontSize: "16px", opacity: 0.9 }}>To stay connected with us, please login with your personal info.</p>
          
        </div>

        <div style={{ background: "#0f172a", color: "#e2e8f0", padding: "46px 38px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2 style={{ margin: 0, color: "#94a3b8", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px" }}>Sign up</h2>
          <p style={{ margin: "8px 0 26px", fontSize: "26px", color: "#fff", lineHeight: 1.2 }}>Create your student account</p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#cbd5e1" }}>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #475569", borderRadius: "8px", background: "#1f2937", color: "#e2e8f0", fontSize: "14px" }}
                required
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#cbd5e1" }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #475569", borderRadius: "8px", background: "#1f2937", color: "#e2e8f0", fontSize: "14px" }}
                required
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#cbd5e1" }}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #475569", borderRadius: "8px", background: "#1f2937", color: "#e2e8f0", fontSize: "14px" }}
                required
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#cbd5e1" }}>Campus</label>
              <input
                type="text"
                value={form.campus}
                onChange={(e) => setForm({ ...form, campus: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #475569", borderRadius: "8px", background: "#1f2937", color: "#e2e8f0", fontSize: "14px" }}
                required
              />
            </div>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#cbd5e1" }}>Year</label>
              <select
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #475569", borderRadius: "8px", background: "#1f2937", color: "#e2e8f0", fontSize: "14px" }}
                required
              >
                <option value="">Select year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            {error && <p style={{ color: "#fecdd3", marginBottom: "12px", textAlign: "center" }}>{error}</p>}
            <button type="submit" style={{ width: "100%", background: "#10b981", color: "#fff", border: "none", padding: "14px", borderRadius: "32px", cursor: "pointer", fontWeight: 700, fontSize: "16px" }}>
              SIGN UP
            </button>
          </form>

          <p style={{ marginTop: "18px", color: "#94a3b8", textAlign: "center" }}>
            Already have an account? <Link to="/login" style={{ color: "#10b981", fontWeight: 700 }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
