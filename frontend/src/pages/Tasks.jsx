import { useState } from 'react';
import IssueForm from '../components/IssueForm.jsx';
import IssueList from '../components/IssueList.jsx';

const Tasks = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Issue Reporting</h1>
      <IssueForm onSuccess={() => setRefresh(r => !r)} />
      <IssueList key={refresh} />
    </div>
  );
};

export default Tasks;