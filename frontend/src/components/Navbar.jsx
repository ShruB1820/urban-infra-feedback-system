import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/BC_logo.png";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Make Home look like the Login header
  const isHome = location.pathname === "/home";
  const solid = !isHome; // solid on other pages

  const brandText =
    (solid ? "text-white" : "text-gray-900") + " hidden sm:block text-lg md:text-xl font-semibold";

  const reportBtn =
    (solid
      ? "border-white/30 text-white/90 hover:bg-white/10"
      : "border-gray-300 text-gray-700 hover:bg-gray-100") +
    " hidden sm:inline-block rounded-lg border px-4 py-2 font-medium transition";

  const logoutBtn =
    "rounded-lg px-4 py-2 font-semibold text-white shadow transition bg-rose-500 hover:bg-rose-600";

  return (
    <nav className={(solid ? "bg-indigo-600 text-white" : "bg-transparent") + " relative z-50"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to={user ? "/home" : "/"} className="flex items-center gap-3" aria-label="Brisbane Connect">
            <img
              src={Logo}
              alt="Brisbane Connect"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* Right side */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/tasks" className={reportBtn}>Report Now</Link>
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className={logoutBtn}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className={reportBtn.replace("hidden sm:inline-block ", "")}>Log in</Link>
              <Link to="/register" className={logoutBtn.replace("bg-rose-500 hover:bg-rose-600","bg-indigo-600 hover:bg-indigo-700")}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
