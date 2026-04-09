import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!validateEmail(value)) return "Please enter a valid email address.";
        return "";
      case "password":
        if (!value.trim()) return "Password is required.";
        if (value.trim().length < 6) return "Password must have at least 6 characters.";
        return "";
      default:
        return "";
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateField("email", form.email);
    const passwordError = validateField("password", form.password);
    setFieldErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      setError("Please fix the highlighted fields before submitting.");
      return;
    }

    setError("");

    // allow existing DB legacy passwords as-is; if you want stricter rules, enforce on signup only

    try {
      const email = form.email.trim().toLowerCase();
      const password = form.password.trim();

      const res = await axios.get("http://localhost:5000/api/users");
      const user = res.data.find((u) => (u.email || "").trim().toLowerCase() === email && (u.password || "").trim() === password);
      if (!user) {
        setError("Invalid email or password");
      } else {
        setError("");
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        if (user.role && user.role.toLowerCase() === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Login failed; please try again");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#0a1a38", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "920px", display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: "20px", overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,0.5)" }}>
        <div style={{ background: "linear-gradient(130deg, #a855f7 0%, #ec4899 100%)", color: "#fff", padding: "46px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ margin: 0, fontSize: "34px", letterSpacing: "1px" }}>Welcome Back!</h1>
          <p style={{ margin: "12px 0 24px", fontSize: "16px", opacity: 0.9 }}>To stay connected with us, please login with your personal info.</p>
          
        </div>

        <div style={{ background: "#0f172a", color: "#e2e8f0", padding: "46px 38px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2 style={{ margin: 0, color: "#94a3b8", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px" }}>Welcome</h2>
          <p style={{ margin: "8px 0 26px", fontSize: "26px", color: "#fff", lineHeight: 1.2 }}>Login in to your account to continue</p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleFieldChange}
                placeholder="Email"
                style={{ width: "100%", padding: "14px 14px", borderRadius: "32px", border: fieldErrors.email ? "1px solid #f87171" : "1px solid #334155", background: "#1f2937", color: "#e2e8f0", fontSize: "14px" }}
                required
              />
              {fieldErrors.email && <p style={{ color: "#fecdd3", fontSize: "12px", marginTop: "6px" }}>{fieldErrors.email}</p>}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleFieldChange}
                placeholder="Password"
                style={{ width: "100%", padding: "14px 14px", borderRadius: "32px", border: fieldErrors.password ? "1px solid #f87171" : "1px solid #334155", background: "#1f2937", color: "#e2e8f0", fontSize: "14px" }}
                required
              />
              {fieldErrors.password && <p style={{ color: "#fecdd3", fontSize: "12px", marginTop: "6px" }}>{fieldErrors.password}</p>}
            </div>
            <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ color: "#94a3b8", fontSize: "13px" }}>
                <input type="checkbox" style={{ marginRight: "6px" }} /> Remember me
              </label>
              <a href="#" style={{ color: "#a855f7", textDecoration: "none", fontSize: "13px" }}>Forgot Password?</a>
            </div>
            {error && <p style={{ color: "#fecdd3", marginBottom: "12px", textAlign: "center" }}>{error}</p>}
            <button type="submit" style={{ width: "100%", padding: "14px", borderRadius: "32px", border: "none", background: "#a855f7", color: "#fff", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>LOG IN</button>
          </form>
          <p style={{ marginTop: "22px", color: "#94a3b8", textAlign: "center" }}>Don’t have an account? <Link to="/signup" style={{ color: "#a855f7", fontWeight: 700 }}>Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
