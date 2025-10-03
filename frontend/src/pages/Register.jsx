import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/BC_logo.png";
import RegisterHero from "../assets/register.png"

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

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm: "", role: "user",
    showPw: false, showPw2: false,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const nameErr  = useMemo(() => (form.name.trim().length >= 2 ? "" : "Name must be at least 2 characters"), [form.name]);
  const emailErr = useMemo(() => !form.email ? "Email is required" : (/\S+@\S+\.\S+/.test(form.email) ? "" : "Enter a valid email"), [form.email]);
  const pwErr    = useMemo(() => (form.password.length >= 6 ? "" : "Minimum 6 characters"), [form.password]);
  const matchErr = useMemo(() => (form.confirm === form.password ? "" : "Passwords do not match"), [form.confirm, form.password]);

  const isValid = !nameErr && !emailErr && !pwErr && !matchErr;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true); setErr("");
    try {
      const res = await API.post("/auth/register", {
        name: form.name.trim(), email: form.email.trim(), password: form.password, role: form.role,
      });
      const data = res?.data || {};
      const token = data.token;
      const user  = data.user || (token ? { id: data.id, name: data.name, email: data.email, role: data.role || "user" } : null);
      if (token && user) {
        setAuthToken(token);
        login({ ...user, token });
        navigate("/home", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { document.getElementById("name")?.focus(); }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-sky-50
      [background-image:radial-gradient(40rem_20rem_at_-10%_-10%,rgba(79,70,229,0.08),transparent),
                        radial-gradient(35rem_18rem_at_110%_10%,rgba(14,165,233,0.08),transparent)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* brand header */}
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Brisbane Connect" className="h-12 w-auto object-contain scale-[1.2] origin-left -ml-1" />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-5 items-stretch">
          {/* Left hero */}
          <section className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <img src={RegisterHero} alt="Community improving city infrastructure" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent" />
              <div className="absolute left-0 right-0 bottom-0 p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow">Join Brisbane Connect</h1>
                <p className="mt-2 max-w-2xl text-white/90">Create an account to report and track local infrastructure issues.</p>
              </div>
            </div>
          </section>

          {/* Right card */}
          <section className="lg:col-span-2">
            <div className="rounded-3xl border border-white/30 bg-white/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md ring-1 ring-black/5">
              <h2 className="text-2xl font-semibold text-gray-900">Create your account</h2>
              <p className="mt-1 text-sm text-gray-600">It takes less than a minute.</p>

              <form onSubmit={onSubmit} noValidate className="mt-5 space-y-5">
                <Field label="Full name" id="name" value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Alex Citizen" error={nameErr} autoComplete="name" />
                <Field label="Email" id="email" type="email" value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} placeholder="you@example.com" error={emailErr} autoComplete="email" />
                <Field label="Password" id="password" type={form.showPw ? "text" : "password"} value={form.password}
                  onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} placeholder="At least 6 characters" error={pwErr} autoComplete="new-password"
                  rightSlot={
                    <button type="button" onClick={() => setForm((s) => ({ ...s, showPw: !s.showPw }))}
                      className="rounded-md px-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      aria-label={form.showPw ? "Hide password" : "Show password"}>{form.showPw ? "🙈" : "👁️"}</button>
                  } />

                <Field label="Confirm password" id="confirm" type={form.showPw2 ? "text" : "password"} value={form.confirm}
                  onChange={(e) => setForm((s) => ({ ...s, confirm: e.target.value }))} placeholder="Repeat your password" error={matchErr} autoComplete="new-password"
                  rightSlot={
                    <button type="button" onClick={() => setForm((s) => ({ ...s, showPw2: !s.showPw2 }))}
                      className="rounded-md px-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      aria-label={form.showPw2 ? "Hide password" : "Show password"}>{form.showPw2 ? "🙈" : "👁️"}</button>
                  } />

                {err && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

                <button type="submit" disabled={!isValid || loading}
                  className="mt-1 inline-flex w-full items-center justify-center rounded-xl
                    bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-white
                    font-semibold shadow-md transition
                    hover:from-indigo-700 hover:to-violet-700
                    focus:outline-none focus:ring-2 focus:ring-indigo-300
                    disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? "Creating account…" : "Create account"}
                </button>

                <p className="text-sm text-gray-700 text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-indigo-700 hover:text-indigo-900">Log in</Link>
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
