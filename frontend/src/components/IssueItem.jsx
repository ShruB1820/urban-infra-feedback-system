export default function IssueItem({ issue, onStatusChange, onDelete }) {
  return (
    <div className="p-4 bg-gray-50 shadow rounded flex justify-between items-center">
      <div>
        <h3 className="font-bold">{issue.title}</h3>
        <p>{issue.description}</p>
        <p className="text-sm text-gray-500">{issue.address}</p>
        <p className="text-sm">Status: {issue.status}</p>
      </div>
      <div className="space-x-2">
        <select value={issue.status} onChange={e => onStatusChange(issue._id, e.target.value)} className="input">
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
        <button onClick={() => onDelete(issue._id)} className="btn btn-red">Delete</button>
      </div>
    </div>
  );
}