import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbMessage2 } from "react-icons/tb";
import AuthLayout from "./AuthLayout";
import Loader from "../../components/Loader";
import styles from "./Auth.module.css";
import { signupService } from "../../services/auth.service";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", phoneNumber: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { setError("Name is required"); return; }
    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) { setError("Enter a valid 10-digit phone number"); return; }
    if (formData.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    try {
      setLoading(true);
      setError("");
      await signupService(formData);
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Loader show={loading} />
      <div className={styles.card}>
        <div className={styles.brandRow}>
          <div className={styles.brandIcon}><TbMessage2 size={19} strokeWidth={2.3} /></div>
          <span className={styles.brandName}>ChatMe</span>
        </div>
        <h2>Create account</h2>
        <p className={styles.subtitle}>Join ChatMe today</p>
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label>Full Name</label>
            <input type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label>Phone Number</label>
            <input type="tel" name="phoneNumber" placeholder="10-digit number" value={formData.phoneNumber} onChange={handleChange} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" placeholder="At least 6 characters" value={formData.password} onChange={handleChange} />
          </div>
          <button className={styles.primaryBtn} type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className={styles.switch}>
          Already have an account? <span onClick={() => navigate("/login")}>Sign in</span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
