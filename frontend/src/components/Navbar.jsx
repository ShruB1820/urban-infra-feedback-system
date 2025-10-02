import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/BC_logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/home";
  const solid = !isHome; 

  const brandText =
    (solid ? "text-white" : "text-gray-900") +
    " hidden sm:block text-lg md:text-xl font-semibold";

  const outlineBtn =
    (solid
      ? "border-white/30 text-white/90 hover:bg-white/10"
      : "border-gray-300 text-gray-700 hover:bg-gray-100") +
    " rounded-lg border px-4 py-2 font-medium transition";

  const primaryBtn =
    "rounded-lg px-4 py-2 font-semibold text-white shadow transition bg-indigo-600 hover:bg-indigo-700";

  return (
    <nav className={(solid ? "bg-indigo-600 text-white" : "bg-transparent") + " relative z-50"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to={user ? "/home" : "/"} className="flex items-center gap-3" aria-label="Brisbane Connect">
            <img src={Logo} alt="Brisbane Connect" className="h-10 md:h-12 w-auto object-contain" />
          </Link>

          {/* Right */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/report" className={outlineBtn}>Report Now</Link>
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="rounded-lg px-4 py-2 font-semibold text-white shadow transition bg-rose-500 hover:bg-rose-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className={outlineBtn}>Log in</Link>
              <Link to="/register" className={primaryBtn}>Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
