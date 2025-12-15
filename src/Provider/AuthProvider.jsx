/* AuthProvider.jsx */
import { createContext, useContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import Swal from "sweetalert2";

const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/* ---------- helper: small toast ---------- */
const toast = (icon, title) =>
  Swal.fire({
    icon,
    title,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
  });

/* ---------- helper: fetch user from MongoDB ---------- */
const fetchUserFromDB = async (email) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${email}`);
    if (!res.ok) throw new Error("Failed to fetch user data from DB");
    const dbUser = await res.json();
    return dbUser; // Expected: { email, role, ... }
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- sync to localStorage ---------- */
  const persistUser = (u) =>
    u
      ? localStorage.setItem("userData", JSON.stringify(u))
      : localStorage.removeItem("userData");

  /* ---------- on mount: hydrate + watch auth ---------- */
  useEffect(() => {
    const raw = localStorage.getItem("userData");
    if (raw) setUser(JSON.parse(raw));

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const token = await fbUser.getIdToken();
        const dbUser = await fetchUserFromDB(fbUser.email);

        const profile = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          role: dbUser?.role || "borrower", // fallback role
          token,
        };
        setUser(profile);
        persistUser(profile);
      } else {
        setUser(null);
        persistUser(null);
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  /* ---------- actions ---------- */
  const signUp = async (email, password, name, photoURL) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name, photoURL });

      // Fetch user from DB to get role
      const dbUser = await fetchUserFromDB(email);

      const token = await cred.user.getIdToken();
      const profile = {
        uid: cred.user.uid,
        email,
        displayName: name,
        photoURL,
        role: dbUser?.role || "borrower",
        token,
      };
      setUser(profile);
      persistUser(profile);
      toast("success", "Account created!");
      return cred.user;
    } catch (err) {
      toast("error", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();

      const dbUser = await fetchUserFromDB(email);

      const profile = {
        uid: cred.user.uid,
        email,
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL,
        role: dbUser?.role || "borrower",
        token,
      };
      setUser(profile);
      persistUser(profile);
      toast("success", "Welcome back!");
      return cred.user;
    } catch (err) {
      toast("error", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const token = await cred.user.getIdToken();

      const dbUser = await fetchUserFromDB(cred.user.email);

      const profile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL,
        role: dbUser?.role || "borrower",
        token,
      };
      setUser(profile);
      persistUser(profile);
      toast("success", "Signed in with Google!");
      return cred.user;
    } catch (err) {
      toast("error", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    persistUser(null);
    setLoading(false);
  };

  const updateProfileData = async (name, photoURL) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: name, photoURL });
    const updated = { ...user, displayName: name, photoURL };
    setUser(updated);
    persistUser(updated);
    toast("success", "Profile updated");
  };

  const getIdToken = () => auth.currentUser?.getIdToken() || null;

  const value = {
    user,
    loading,
    signUp,
    login,
    signInWithGoogle,
    logOut,
    updateProfileData,
    setUser,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ------------- hook ------------- */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
