import React from 'react';
import { ApplicationItem } from './ApplicationItem';

export const Applications = () => {
  return (
    <div className="border rounded-lg">
      <div className="p-4 space-y-2">
        <div className="pb-2">
          <ApplicationItem title="Applications in progress" count={0} />
        </div>
        <div className="border-t border-gray-200"></div> {/* Divider */}
        <div className="pb-2">
          <ApplicationItem title="Applications completed" count={0} />
        </div>
      </div>
    </div>
  );
};






