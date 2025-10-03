import { useEffect, useMemo, useState } from "react";
import API from "../axiosConfig";
import { Link } from "react-router-dom";

const TYPE_LABEL = {
  POTHOLE: "Pothole",
  STREETLIGHT: "Street Lights",
  OTHER: "Other",
};

const STATUS_STYLES = {
  OPEN:        { label: "Open",        wrap: "bg-blue-50 text-blue-700",        dot: "bg-blue-500" },
  IN_PROGRESS: { label: "In Progress", wrap: "bg-green-50 text-green-700",      dot: "bg-green-500" },
  RESOLVED:    { label: "Resolved",    wrap: "bg-emerald-50 text-emerald-700",  dot: "bg-emerald-500" },
  CLOSED:      { label: "Closed",      wrap: "bg-gray-100 text-gray-700",       dot: "bg-gray-500" },
};

const CLOSED_SET = new Set(["RESOLVED", "CLOSED"]);

function timeAgo(iso) {
  const d = new Date(iso);
  const ms = Date.now() - d.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const mins = Math.floor(ms / (1000 * 60));
  if (mins > 0) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  return "just now";
}

export default function MyReports() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("all");       
  const [sort, setSort] = useState("new");       

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setErr("");
        const res = await API.get("/issues");
        setItems(Array.isArray(res.data) ? res.data : (res.data?.data || []));
      } catch (e) {
        setErr(e?.response?.data?.message || e.message || "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const shown = useMemo(() => {
    let arr = items.slice();
    if (tab === "closed") arr = arr.filter(it => CLOSED_SET.has(it.status));
    arr.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === "new" ? db - da : da - db;
    });
    return arr;
  }, [items, tab, sort]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Reported Issues</h1>

          {/* Sort */}
          <div className="text-sm text-gray-700">
            <label className="mr-2">Sort by</label>
            <select
              className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="new">New to Old</option>
              <option value="old">Old to New</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex items-center gap-3 text-sm">
          <button
            onClick={() => setTab("all")}
            className={`rounded-md px-3 py-1.5 ${tab === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
          >
            All
          </button>
          <button
            onClick={() => setTab("closed")}
            className={`rounded-md px-3 py-1.5 ${tab === "closed" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
          >
            Closed
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-4">
          {loading && (
            <div className="rounded-xl border border-gray-200 p-5">
              <div className="animate-pulse h-5 w-48 bg-gray-200 rounded" />
              <div className="mt-3 grid gap-2">
                <div className="h-4 w-80 bg-gray-100 rounded" />
                <div className="h-4 w-56 bg-gray-100 rounded" />
              </div>
            </div>
          )}

          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{err}</div>
          )}

          {!loading && !err && shown.length === 0 && (
            <div className="rounded-xl border border-gray-200 p-6 text-center text-gray-600">
              No reports yet.{" "}
              <Link to="/report" className="text-indigo-600 hover:text-indigo-800 font-medium">Report your first issue</Link>.
            </div>
          )}

          {shown.map((it) => {
            const status = STATUS_STYLES[it.status] || STATUS_STYLES.OPEN;
            const idShort = it._id ? `#${it._id.slice(-6)}` : "";
            const category = TYPE_LABEL[it.type] || "Other";
            const address = it.address || (it.location?.coordinates ? `${it.location.coordinates[1]}, ${it.location.coordinates[0]}` : "—");
            const reported = it.createdAt ? timeAgo(it.createdAt) : "";

            return (
              <div key={it._id} className="rounded-xl border border-gray-300 bg-gray-100/60 p-4 sm:p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{it.title || category}</h3>
                      <span className="text-sm text-gray-600">{idShort}</span>
                    </div>

                    <div className="grid sm:grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm text-gray-700">
                      <div>Issue Category</div><div>: {category}</div>
                      <div>Authority</div><div>: {it.authority || "Brisbane City Council"}</div>
                      <div>Location</div><div>: {address}</div>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${status.wrap}`}>
                    <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>

                {reported && (
                  <div className="mt-3 text-right text-xs text-gray-600">
                    Reported: {reported}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
