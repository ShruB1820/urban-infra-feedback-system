import React from 'react';

const IssueItem = ({ issue, onStatusChange, onDelete }) => {
  return (
    <div
      className="
        p-4 
        bg-white 
        border border-gray-300 
        rounded-xl 
        shadow-[0_3px_8px_0_#0099E850] 
        hover:shadow-[0_6px_12px_0_#0099E870] 
        transition
        flex flex-col md:flex-row justify-between md:items-center gap-4
      "
    >
      {/* Left Section */}
      <div className="flex-1 space-y-1">
        <h3 className="font-semibold text-lg text-gray-800">{issue.title}</h3>
        <p className="text-gray-700">{issue.description}</p>
        <p className="text-sm text-gray-500">{issue.address}</p>
        <p className="text-sm font-medium text-[#0099E8]">Status: {issue.status}</p>
      </div>

      {/* Right Section */}
      <div className="flex space-x-2 self-end md:self-center">
        <button
          className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium shadow"
          onClick={() =>
            onStatusChange(issue._id, issue.status === 'OPEN' ? 'CLOSED' : 'OPEN')
          }
        >
          {issue.status === 'OPEN' ? 'Mark Closed' : 'Reopen'}
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow"
          onClick={() => onDelete(issue._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default IssueItem;