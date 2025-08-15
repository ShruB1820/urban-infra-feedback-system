import React from 'react';

const IssueItem = ({ issue, onStatusChange, onDelete }) => {
  return (
    <div className="p-4 bg-gray-100 rounded shadow flex justify-between items-center">
      <div>
        <h3 className="font-bold">{issue.title}</h3>
        <p>{issue.description}</p>
        <p className="text-sm text-gray-500">{issue.address}</p>
        <p className="text-sm text-gray-500">Status: {issue.status}</p>
      </div>
      <div className="flex space-x-2">
        <button
          className="btn bg-green-500 text-white"
          onClick={() => onStatusChange(issue._id, issue.status === 'OPEN' ? 'CLOSED' : 'OPEN')}
        >
          Toggle Status
        </button>
        <button
          className="btn bg-red-500 text-white"
          onClick={() => onDelete(issue._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default IssueItem;