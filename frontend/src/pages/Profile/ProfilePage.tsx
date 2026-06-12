import { useRef, useState } from "react";
import { MdArrowBack, MdCameraAlt, MdEdit, MdLogout } from "react-icons/md";
import Loader from "../../components/Loader";
import styles from "./ProfilePage.module.css";
import { useUser } from "../../context/UserContext";
import { updateAbout, updateName, updateProfilePhoto } from "../../services/user.service";
import { logoutService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { disconnectSocket } from "../../socket/socket";

const ProfilePage = ({ onBack }: any) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<"name" | "about" | null>(null);
  const [tempName, setTempName] = useState("");
  const [tempAbout, setTempAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return <Loader show={true} />;

  const name = user.name || user.phoneNumber || "User";
  const initial = name.charAt(0).toUpperCase();

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await updateProfilePhoto(file) as { profilePhoto: string };
      setUser({ ...user, profilePhoto: res.profilePhoto });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const saveName = async () => {
    try {
      await updateName(tempName);
      setUser({ ...user, name: tempName });
      setEditing(null);
    } catch (err: any) { alert(err.message); }
  };

  const saveAbout = async () => {
    try {
      await updateAbout(tempAbout);
      setUser({ ...user, about: tempAbout });
      setEditing(null);
    } catch (err: any) { alert(err.message); }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logoutService();
      disconnectSocket();
      setUser(null);
      navigate("/login");
    } catch (err: any) {
      alert(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Loader show={loading} />
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack}><MdArrowBack size={19} /></button>
        )}
        <span className={styles.headerTitle}>Profile</span>
      </div>

      <div className={styles.photoSection}>
        <div className={styles.avatarWrap} onClick={() => fileRef.current?.click()}>
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt={name} className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback}>{initial}</div>
          )}
          <div className={styles.cameraOverlay}><MdCameraAlt size={20} /></div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
        <div className={styles.userName}>{name}</div>
        <div className={styles.userPhone}>{user.phoneNumber}</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Account</div>

        {editing === "name" ? (
          <div className={styles.editRow}>
            <input className={styles.editInput} value={tempName} onChange={(e) => setTempName(e.target.value)} autoFocus />
            <button className={styles.saveBtn} onClick={saveName}>Save</button>
            <button className={styles.cancelBtn} onClick={() => setEditing(null)}>Cancel</button>
          </div>
        ) : (
          <div className={styles.field} onClick={() => { setTempName(user.name || ""); setEditing("name"); }}>
            <div>
              <div className={styles.fieldLabel}>Name</div>
              <div className={styles.fieldValue}>{user.name || "Add your name"}</div>
            </div>
            <span className={styles.editIcon}><MdEdit size={16} /></span>
          </div>
        )}

        {editing === "about" ? (
          <div className={styles.editRow}>
            <input className={styles.editInput} value={tempAbout} onChange={(e) => setTempAbout(e.target.value)} autoFocus />
            <button className={styles.saveBtn} onClick={saveAbout}>Save</button>
            <button className={styles.cancelBtn} onClick={() => setEditing(null)}>Cancel</button>
          </div>
        ) : (
          <div className={styles.field} onClick={() => { setTempAbout(user.about || ""); setEditing("about"); }}>
            <div>
              <div className={styles.fieldLabel}>About</div>
              <div className={styles.fieldValue}>{user.about || "Add something about you"}</div>
            </div>
            <span className={styles.editIcon}><MdEdit size={16} /></span>
          </div>
        )}

        <div className={styles.field} style={{ cursor: "default" }}>
          <div>
            <div className={styles.fieldLabel}>Phone</div>
            <div className={styles.fieldValue}>{user.phoneNumber}</div>
          </div>
        </div>
      </div>

      <div className={styles.logoutSection}>
        <button className={styles.logoutBtn} onClick={handleLogout}><MdLogout size={18} /> Sign out</button>
      </div>
    </div>
  );
};

export default ProfilePage;
