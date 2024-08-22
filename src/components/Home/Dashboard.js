import React from 'react';
import { Metrics } from './Metrics';
import { Applications } from './Applications';

export const Dashboard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-4 max-w-sm mx-auto">
      <div className="flex justify-between items-center pb-2 ">
        <div className="flex items-center">
          <i className="bi bi-person text-2xl mr-2"></i>
          <p className="text-lg font-medium">Welcome! James</p>
        </div>
        <i className="bi bi-bell text-2xl"></i>
      </div>

      <div className="border border-gray-200 rounded-lg ps-3">
        <div className="p-4 ps-2 space-y-4">
          <div>
            <Metrics type="matched" title="Matched scholarships" count={0} />
          </div>
          <div className="border-t border-gray-200"></div> {/* Divider */}
          <div>
            <Metrics type="deadline" title="Upcoming deadlines" count={0} />
          </div>
          <div className="border-t border-gray-200"></div> {/* Divider */}
          <div>
            <Metrics type="saved" title="Saved scholarships" count={0} />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-lg font-medium">Application progress</h3>
        <Applications />
      </div>
    </div>
  );
};








