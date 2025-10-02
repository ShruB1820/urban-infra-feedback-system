import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axiosConfig";

const CATEGORIES = [
  "Pothole",
  "Broken streetlight",
  "Damaged sidewalk",
  "Waste / Garbage",
  "Water leak",
  "Graffiti",
  "Road sign",
  "Other",
];

export default function ReportIssue() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    category: "",
    priority: 3,            // 1–5
    description: "",
    address: "",
    lat: "",
    lng: "",
    anonymous: false,
    agree: false,
  });

  const [images, setImages] = useState([]); // File[]
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValid = useMemo(() => {
    return (
      form.category &&
      form.description.trim().length >= 10 &&
      form.agree
    );
  }, [form]);

  const pickLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((s) => ({
          ...s,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        }));
      },
      (err) => setError(err.message || "Could not get your location.")
    );
  };

  const onFiles = (files) => {
    const arr = Array.from(files || []);
    if (!arr.length) return;
    // limit: 4 photos, jpeg/png only, < 8MB each
    const filtered = arr
      .slice(0, 4 - images.length)
      .filter((f) => /image\/(jpeg|png)/.test(f.type) && f.size <= 8 * 1024 * 1024);
    setImages((prev) => [...prev, ...filtered]);
  };

  const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const fd = new FormData();
      fd.append("title", form.title || form.category); // fall back to category
      fd.append("category", form.category);
      fd.append("priority", String(form.priority));
      fd.append("description", form.description);
      fd.append("address", form.address);
      if (form.lat) fd.append("lat", form.lat);
      if (form.lng) fd.append("lng", form.lng);
      fd.append("anonymous", String(form.anonymous));

      images.forEach((file, i) => fd.append("photos", file, file.name || `photo-${i}.jpg`));

      // 🔗 adjust endpoint name to your backend:
      // e.g. "/issues" or "/reports" or "/tasks"
      const res = await API.post("/issues", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Issue submitted successfully.");
      // Optional: use returned id
      // const created = res.data;

      // small pause then redirect
      setTimeout(() => navigate("/profile"), 600);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // focus the first field
    document.getElementById("category")?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Report an Issue</h1>
        <p className="text-gray-600 mt-1">Provide details to help the city resolve it quickly.</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* LEFT: form */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-800" htmlFor="category">
                Category *
              </label>
              <select
                id="category"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                value={form.category}
                onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800" htmlFor="title">
                Title (optional)
              </label>
              <input
                id="title"
                type="text"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Short summary (e.g., Large pothole on Queen St)"
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-800" htmlFor="description">
                  Description *
                </label>
                <span className="text-xs text-gray-500">{Math.max(0, 500 - form.description.length)} left</span>
              </div>
              <textarea
                id="description"
                rows={5}
                maxLength={500}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Add details: size, exact location, hazards, when you noticed it, etc."
                value={form.description}
                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                required
              />
              {form.description && form.description.length < 10 && (
                <p className="mt-1 text-xs text-red-600">Please provide at least 10 characters.</p>
              )}
            </div>

            {/* photos */}
            <div>
              <label className="block text-sm font-medium text-gray-800">Photos (up to 4)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 grid gap-3 sm:grid-cols-4 rounded-xl border border-dashed border-gray-300 bg-white p-4 cursor-pointer hover:border-indigo-300"
              >
                {images.map((f, i) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-lg border">
                    <img src={URL.createObjectURL(f)} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <div className="flex aspect-[4/3] items-center justify-center rounded-lg text-gray-500">
                    + Add photo
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                multiple
                hidden
                onChange={(e) => onFiles(e.target.files)}
              />
              <p className="mt-1 text-xs text-gray-500">.jpg/.png, up to 8MB each.</p>
            </div>
          </div>

          {/* RIGHT: location & meta */}
          <aside className="lg:col-span-1 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-800" htmlFor="address">
                Address / Landmark
              </label>
              <input
                id="address"
                type="text"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="e.g., 123 Queen St, near bus stop"
                value={form.address}
                onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-800" htmlFor="lat">
                  Latitude
                </label>
                <input
                  id="lat"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="-27.470125"
                  value={form.lat}
                  onChange={(e) => setForm((s) => ({ ...s, lat: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800" htmlFor="lng">
                  Longitude
                </label>
                <input
                  id="lng"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="153.021072"
                  value={form.lng}
                  onChange={(e) => setForm((s) => ({ ...s, lng: e.target.value }))}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={pickLocation}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Use my current location
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-800">
                Priority: <span className="font-semibold">{form.priority}</span>
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={form.priority}
                onChange={(e) => setForm((s) => ({ ...s, priority: Number(e.target.value) }))}
                className="mt-2 w-full"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Low</span><span>Med</span><span>High</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.anonymous}
                  onChange={(e) => setForm((s) => ({ ...s, anonymous: e.target.checked }))}
                  className="h-4 w-4 accent-indigo-600"
                />
                Submit anonymously
              </label>

              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => setForm((s) => ({ ...s, agree: e.target.checked }))}
                  className="h-4 w-4 accent-indigo-600"
                  required
                />
                I confirm the information is accurate. *
              </label>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            {success && <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div>}

            <button
              type="submit"
              disabled={!isValid || submitting}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold shadow hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit Issue"}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}
