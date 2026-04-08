import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", campus: "", year: "", role: "user" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ name: "", email: "", password: "", campus: "", year: "" });

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        if (/[0-9]/.test(value)) return "Name cannot contain numbers.";
        if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return "Name can only contain letters, spaces, apostrophes, and hyphens.";
        return "";
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!validateEmail(value)) return "Please enter a valid email address.";
        return "";
      case "password":
        if (!value.trim()) return "Password is required.";
        if (value.trim().length < 6) return "Password must be at least 6 characters.";
        if (!/[0-9]/.test(value) || !/[A-Za-z]/.test(value)) return "Password must contain letters and numbers.";
        return "";
      case "campus":
        if (!value.trim()) return "Campus is required.";
        return "";
      case "year":
        if (!value) return "Year is required.";
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

    const nameError = validateField("name", form.name);
    const emailError = validateField("email", form.email);
    const passwordError = validateField("password", form.password);
    const campusError = validateField("campus", form.campus);
    const yearError = validateField("year", form.year);

    setFieldErrors({ name: nameError, email: emailError, password: passwordError, campus: campusError, year: yearError });

    if (nameError || emailError || passwordError || campusError || yearError) {
      setError("Please resolve the form errors before signing up.");
      return;
    }

    setError("");

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
        <div style={{ background: "linear-gradient(130deg, #a855f7 0%, #ec4899 100%)", color: "#fff", padding: "46px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
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
                name="name"
                type="text"
                value={form.name}
                onChange={handleFieldChange}
                style={{ width: "100%", padding: "10px 12px", border: fieldErrors.name ? "1px solid #f87171" : "1px solid #475569", borderRadius: "8px", background: "#1f2937", color: "#e2e8f0", fontSize: "14px" }}
                required
              />
              {fieldErrors.name && <p style={{ color: "#fecdd3", fontSize: "12px", marginTop: "6px" }}>{fieldErrors.name}</p>}
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#cbd5e1" }}>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleFieldChange}
                style={{ width: "100%", padding: "10px 12px", border: fieldErrors.email ? "1px solid #f87171" : "1px solid #475569", borderRadius: "8px", background: "#1f2937", color: "#e2e8f0", fontSize: "14px" }}
                required
              />
              {fieldErrors.email && <p style={{ color: "#fecdd3", fontSize: "12px", marginTop: "6px" }}>{fieldErrors.email}</p>}
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#cbd5e1" }}>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleFieldChange}
                style={{ width: "100%", padding: "10px 12px", border: fieldErrors.password ? "1px solid #f87171" : "1px solid #475569", borderRadius: "8px", background: "#1f2937", color: "#e2e8f0", fontSize: "14px" }}
                required
              />
              {fieldErrors.password && <p style={{ color: "#fecdd3", fontSize: "12px", marginTop: "6px" }}>{fieldErrors.password}</p>}
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#cbd5e1" }}>Campus</label>
              <input
                name="campus"
                type="text"
                value={form.campus}
                onChange={handleFieldChange}
                style={{ width: "100%", padding: "10px 12px", border: fieldErrors.campus ? "1px solid #f87171" : "1px solid #475569", borderRadius: "8px", background: "#1f2937", color: "#e2e8f0", fontSize: "14px" }}
                required
              />
              {fieldErrors.campus && <p style={{ color: "#fecdd3", fontSize: "12px", marginTop: "6px" }}>{fieldErrors.campus}</p>}
            </div>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#cbd5e1" }}>Year</label>
              <select
                name="year"
                value={form.year}
                onChange={handleFieldChange}
                style={{ width: "100%", padding: "10px 12px", border: fieldErrors.year ? "1px solid #f87171" : "1px solid #475569", borderRadius: "8px", background: "#1f2937", color: "#e2e8f0", fontSize: "14px" }}
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
            <button type="submit" style={{ width: "100%", background: "#a855f7", color: "#fff", border: "none", padding: "14px", borderRadius: "32px", cursor: "pointer", fontWeight: 700, fontSize: "16px" }}>
              SIGN UP
            </button>
          </form>

          <p style={{ marginTop: "18px", color: "#94a3b8", textAlign: "center" }}>
            Already have an account? <Link to="/login" style={{ color: "#a855f7", fontWeight: 700 }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
