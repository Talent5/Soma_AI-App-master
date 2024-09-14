import React, { useState } from 'react';

const ExtracurricularActivities = () => {
    const [activities, setActivities] = useState({
        sports: '',
        clubs: '',
        volunteerExperience: '',
        leadershipRoles: '',
        awards: '',
    });

    // Handle input changes
    const handleInputChange = (field, value) => {
        setActivities(prevState => ({ ...prevState, [field]: value }));
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Extracurricular Activities</h2>
            <form className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                {/* Sports */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Sports (Optional)</label>
                    <input
                        type="text"
                        value={activities.sports}
                        onChange={(e) => handleInputChange('sports', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter any sports activities"
                    />
                </div>

                {/* Clubs */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Clubs (Optional)</label>
                    <input
                        type="text"
                        value={activities.clubs}
                        onChange={(e) => handleInputChange('clubs', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter any club memberships"
                    />
                </div>

                {/* Volunteer Experience */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Volunteer Experience (Optional)</label>
                    <input
                        type="text"
                        value={activities.volunteerExperience}
                        onChange={(e) => handleInputChange('volunteerExperience', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe any volunteer experience"
                    />
                </div>

                {/* Leadership Roles */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Leadership Roles (Optional)</label>
                    <input
                        type="text"
                        value={activities.leadershipRoles}
                        onChange={(e) => handleInputChange('leadershipRoles', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="List any leadership roles"
                    />
                </div>

                {/* Awards */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Awards (Optional)</label>
                    <input
                        type="text"
                        value={activities.awards}
                        onChange={(e) => handleInputChange('awards', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter any awards received"
                    />
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExtracurricularActivities;
