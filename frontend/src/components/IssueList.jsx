import { useEffect, useState } from 'react';
import { getIssues, updateStatus, deleteIssue } from '../api/issueApi';
import IssueItem from './IssueItem.jsx';
import { toast } from 'react-toastify';

export default function IssueList() {
  const [issues, setIssues] = useState([]);

  const fetchData = async () => {
    try {
      const res = await getIssues();
      setIssues(res.data);
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatus = async (id, status) => {
    try { await updateStatus(id, status); toast.success('Status updated'); fetchData(); }
    catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this issue?')) return;
    try { await deleteIssue(id); toast.success('Deleted'); fetchData(); }
    catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  return (
    <div className="space-y-4">
      {issues.map(issue => (
        <IssueItem key={issue._id} issue={issue} onStatusChange={handleStatus} onDelete={handleDelete} />
      ))}
    </div>
  );
}