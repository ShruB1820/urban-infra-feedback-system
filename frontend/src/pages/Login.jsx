import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/BC_logo.png";
import LoginHero from "../assets/citizens.png";

function Field({ label, id, type = "text", value, onChange, placeholder, error, rightSlot, autoComplete }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-800">{label}</label>
      <div className={`relative rounded-xl border bg-white/70 backdrop-blur-sm
        ${error ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 focus-within:ring-2 focus-within:ring-indigo-100"}`}>
        <input
          id={id} name={id} type={type} value={value} onChange={onChange}
          placeholder={placeholder} autoComplete={autoComplete}
          aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
          className="w-full rounded-xl bg-transparent px-3 py-3 pr-10 text-gray-900 placeholder-gray-400 outline-none"
        />
        {rightSlot && <div className="absolute inset-y-0 right-0 flex items-center pr-2">{rightSlot}</div>}
      </div>
      {error && <p id={`${id}-error`} className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "", role: "citizen", showPw: false });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const emailError = useMemo(() => {
    if (!form.email) return "Email is required";
    return /\S+@\S+\.\S+/.test(form.email) ? "" : "Enter a valid email address";
  }, [form.email]);

  const pwError = useMemo(() => (form.password ? "" : "Password is required"), [form.password]);
  const isValid = !emailError && !pwError;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true); setErr("");
    try {
      const res = await API.post("/auth/login", { email: form.email, password: form.password });
      const data = res?.data || {};
      const token = data.token;
      const userObj = data.user || {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,        
      };
      if (!token) throw new Error("No token received from server.");
      setAuthToken(token);
      login({ ...userObj, token });

      navigate(userObj?.role === "admin" ? "/admin" : "/home", { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { document.getElementById("email")?.focus(); }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-sky-50
      [background-image:radial-gradient(40rem_20rem_at_-10%_-10%,rgba(79,70,229,0.08),transparent),
                        radial-gradient(35rem_18rem_at_110%_10%,rgba(14,165,233,0.08),transparent)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Brisbane Connect" className="h-12 w-auto object-contain scale-[1.2] origin-left -ml-1" />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-5 items-stretch">
          {/* Left hero */}
          <section className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <img src={LoginHero} alt="City infrastructure improvements" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent" />
              <div className="absolute left-0 right-0 bottom-0 p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow">Report. Track. Improve.</h1>
                <p className="mt-2 max-w-2xl text-white/90">A transparent platform connecting citizens with municipal authorities to resolve issues faster.</p>
              </div>
            </div>
          </section>

          {/* Right card */}
          <section className="lg:col-span-2">
            <div className="rounded-3xl border border-white/30 bg-white/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md ring-1 ring-black/5">
              <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
              <p className="mt-1 text-sm text-gray-600">Log in to report issues and track progress.</p>


              <form onSubmit={onSubmit} noValidate className="mt-5 space-y-5">
                <Field
                  label="Email" id="email" type="email" value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  placeholder="you@example.com" error={emailError} autoComplete="email"
                />
                <Field
                  label="Password" id="password" type={form.showPw ? "text" : "password"} value={form.password}
                  onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                  placeholder="••••••••" error={pwError} autoComplete="current-password"
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setForm((s) => ({ ...s, showPw: !s.showPw }))}
                      className="rounded-md px-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      aria-label={form.showPw ? "Hide password" : "Show password"}
                    >
                      {form.showPw ? "🙈" : "👁️"}
                    </button>
                  }
                />

                {err && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2 text-gray-700">
                    <input type="checkbox" className="h-4 w-4 accent-indigo-600" /> Remember me
                  </label>
                  <Link to="#" className="text-indigo-700 hover:text-indigo-900">Forgot password?</Link>
                </div>

                <button
                  type="submit" disabled={!isValid || loading}
                  className="mt-1 inline-flex w-full items-center justify-center rounded-xl
                    bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-white
                    font-semibold shadow-md transition
                    hover:from-indigo-700 hover:to-violet-700
                    focus:outline-none focus:ring-2 focus:ring-indigo-300
                    disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Logging in…" : "Log in"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-700">
                New here?{" "}
                <Link to="/register" className="font-medium text-indigo-700 hover:text-indigo-900">
                  Create an account
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
