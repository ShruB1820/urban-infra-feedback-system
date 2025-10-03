import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/BC_logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const isAdmin = !!user && String(user.role).toLowerCase() === "admin";

  return (
    <header className="sticky top-0 z-40 bg-indigo-600 text-white shadow">
      <div className="mx-auto max-w-7xl h-14 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2" aria-label="Home">
          <img src={Logo} alt="Brisbane Connect" className="h-10 md:h-12 w-auto object-contain" />
        </Link>

        <nav className="flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center rounded-lg bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20"
            >
              Dashboard
            </Link>
          )}

          <Link
            to="/report"
            className="hidden sm:inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
          >
            Report Now
          </Link>

          <button
            onClick={logout}
            className="inline-flex items-center rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold hover:bg-rose-700"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
