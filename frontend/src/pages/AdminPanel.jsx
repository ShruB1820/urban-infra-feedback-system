import { useEffect, useState } from 'react';
import { getIssues, updateStatus } from '../api/issueApi';
import { toast } from 'react-toastify';

const statuses = ['UNCHECKED', 'IN_PROGRESS', 'DONE'];

export default function AdminPanel() {
  const [issues, setIssues] = useState([]);

  const fetchIssues = async () => {
    try {
      const res = await getIssues();
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
      await updateStatus(id, status);
      toast.success('Status updated!');
      fetchIssues();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {statuses.map((status) => (
          <div key={status} className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold mb-2">{status.replace('_', ' ')}</h2>
            {issues
              .filter(issue => issue.status === status)
              .map(issue => (
                <div key={issue._id} className="border p-2 rounded mb-2">
                  <p><strong>Title:</strong> {issue.title}</p>
                  <p><strong>Address:</strong> {issue.address}</p>
                  <div className="mt-2 flex gap-2">
                    {statuses.filter(s => s !== status).map(s => (
                      <button
                        key={s}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                        onClick={() => handleStatusChange(issue._id, s)}
                      >
                        Move to {s.replace('_', ' ')}
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