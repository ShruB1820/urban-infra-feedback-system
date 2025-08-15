import { useEffect, useState } from 'react';
import { getAllIssues1, updateIssueStatusAdmin } from '../api/issueApi';
import { toast } from 'react-toastify';

const statuses = [
  { key: 'OPEN', label: 'Open' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'CLOSED', label: 'Done' },
];

export default function AdminPanel() {
  const [issues, setIssues] = useState([]);

  const fetchIssues = async () => {
    try {
      const res = await getAllIssues1();
      setIssues(res.data);
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateIssueStatusAdmin(id, status);
      toast.success('Status updated!');
      fetchIssues();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statuses.map(({ key, label }) => (
          <div key={key} className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold mb-2">{label}</h2>
            {issues
              .filter(issue => issue.status === key)
              .map(issue => (
                <div key={issue._id} className="border p-2 rounded mb-2">
                  <p><strong>Title:</strong> {issue.title}</p>
                  <p><strong>Address:</strong> {issue.address}</p>
                  {issue.photoUrl && (
                    <img
                      src={`http://localhost:5001${issue.photoUrl}`}
                      alt={issue.title}
                      className="w-full h-32 object-cover rounded mt-2"
                    />
                  )}
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {statuses.filter(s => s.key !== key).map(s => (
                      <button
                        key={s.key}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                        onClick={() => handleStatusChange(issue._id, s.key)}
                      >
                        Move to {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}