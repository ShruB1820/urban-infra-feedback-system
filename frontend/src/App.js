// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

// pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import Profile from "./pages/Profile";
import MyReports from "./pages/MyReports";

export default function App() {
  const { user } = useAuth();
  const isAdmin = !!user && String(user.role).toLowerCase() === "admin";

  return (
    <Router>
      {user && <Navbar />}

      <Routes>
        {/* root -> go by role */}
        <Route
          path="/"
          element={
            user
              ? <Navigate to={isAdmin ? "/admin" : "/home"} replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* admin route (guarded) */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminPanel /> : <Navigate to="/home" replace />}
        />

        {/* auth routes */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to={isAdmin ? "/admin" : "/home"} replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to={isAdmin ? "/admin" : "/home"} replace />}
        />

        {/* app routes */}
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/report" element={user ? <ReportIssue /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="/reports" element={user ? <MyReports /> : <Navigate to="/login" replace />} />

        {/* legacy alias */}
        <Route path="/tasks" element={<Navigate to="/report" replace />} />
      </Routes>
    </Router>
  );
}
