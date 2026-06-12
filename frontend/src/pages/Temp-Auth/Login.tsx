import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbMessage2 } from "react-icons/tb";
import AuthLayout from "./AuthLayout";
import styles from "./Auth.module.css";
import Loader from "../../components/Loader";
import { loginService } from "../../services/auth.service";
import { useUser } from "../../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    if (!formData.password) {
      setError("Password is required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await loginService(formData);
      setUser(res.user);
      navigate("/app");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
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
        <h2>Welcome back</h2>
        <p className={styles.subtitle}>Sign in to your account</p>
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label>Phone Number</label>
            <input type="tel" name="phoneNumber" placeholder="10-digit number" value={formData.phoneNumber} onChange={handleChange} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
          </div>
          <button className={styles.primaryBtn} type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className={styles.switch}>
          New to ChatMe? <span onClick={() => navigate("/signup")}>Create account</span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
