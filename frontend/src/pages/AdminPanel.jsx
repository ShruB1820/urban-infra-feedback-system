import { useEffect, useMemo, useState } from "react";
import API from "../axiosConfig";

const STATUS = [
  { value: "OPEN",        label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED",    label: "Resolved" },
  { value: "CLOSED",      label: "Closed" },
];

const TYPES = { POTHOLE: "Pothole", STREETLIGHT: "Street Lights", OTHER: "Other" };

function timeAgo(iso) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const dd = Math.floor(diff / 86400000);
  if (dd > 0) return `${dd}d ago`;
  const hh = Math.floor(diff / 3600000);
  if (hh > 0) return `${hh}h ago`;
  const mm = Math.floor(diff / 60000);
  if (mm > 0) return `${mm}m ago`;
  return "just now";
}

export default function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true); setErr("");
    try {
      const res = await API.get("/admin/issues1");
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);

      const list = data
        .map((it) => ({
          _id: it._id || it.id,
          title: it.title || TYPES[it.type] || "Issue",
          type: it.type || "OTHER",
          status: it.status || "OPEN",
          address: it.address || "",
          description: it.description || it.details || it.desc || "", 
          createdAt: it.createdAt || it.created_at || it.date,
        }))
        .filter((x) => x._id);

      setItems(list);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load issues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) =>
      (it.title || "").toLowerCase().includes(s) ||
      (TYPES[it.type] || "").toLowerCase().includes(s) ||
      (it.status || "").toLowerCase().includes(s) ||
      (it.address || "").toLowerCase().includes(s) ||
      (it.description || "").toLowerCase().includes(s) 
    );
  }, [items, q]);

  const saveStatus = async (it) => {
    setSavingId(it._id);
    setErr("");
    try {
      await API.patch(`/admin/issues1/${it._id}/status`, { status: it.status });
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Update failed.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Admin • Issues</h1>
          <div className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, description, address, status…"
              className="w-72 max-w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <button onClick={load} className="rounded-lg bg-white px-3 py-2 border border-gray-300 text-sm hover:bg-gray-50">
              Refresh
            </button>
          </div>
        </div>

        {err && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">{err}</div>}

        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Issue</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Address</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Reported</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td className="px-4 py-6" colSpan={6}>Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td className="px-4 py-6 text-gray-600" colSpan={6}>No issues found.</td></tr>
              ) : (
                filtered.map((it) => (
                  <tr key={it._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{it.title}</div>
                      <div className="text-xs text-gray-500">#{String(it._id).slice(-6)}</div>

                      {it.description && (
                        <div className="mt-1 text-sm text-gray-600 max-w-md truncate">
                          {it.description}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">{TYPES[it.type] || "Other"}</td>
                    <td className="px-4 py-3">{it.address || "—"}</td>

                    <td className="px-4 py-3">
                      <select
                        className="rounded-md border border-gray-300 px-2 py-1"
                        value={it.status}
                        onChange={(e) =>
                          setItems((arr) =>
                            arr.map((row) =>
                              row._id === it._id ? { ...row, status: e.target.value } : row
                            )
                          )
                        }
                      >
                        {STATUS.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {it.createdAt ? timeAgo(it.createdAt) : "—"}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => saveStatus(it)}
                        disabled={savingId === it._id}
                        className="rounded-md bg-indigo-600 px-3 py-1.5 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
                      >
                        {savingId === it._id ? "Saving…" : "Save"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
