import React from 'react';
import { ApplicationItem } from './ApplicationItem';
import useApplicationCounts from './useApplicationCounts'; // Update with your actual path

export const Applications = () => {
  const userId = localStorage.getItem('userId');
  const { counts, loading } = useApplicationCounts(userId);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="border rounded-lg">
      <div className="p-4 space-y-2">
        <div className="pb-2">
          <ApplicationItem title="Applications in progress" count={counts.inProgress} />
        </div>
        <div className="border-t border-gray-200"></div> {/* Divider */}
        <div className="pb-2">
          <ApplicationItem title="Applications completed" count={counts.completed} />
        </div>
      </div>
    </div>
  );
};








