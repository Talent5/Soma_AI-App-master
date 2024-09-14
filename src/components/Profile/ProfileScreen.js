// src/components/ProfileScreen.js
import React from 'react';
import List from './List';

const ProfileScreen = () => {
    const menuItems = [
        { label: 'Personal Information', path: '/personal-information' },
        { label: 'Educational Information', path: '/educational-information' },
        { label: 'Field of Study', path: '/field-of-study' },
        { label: 'Extracurricular Activities', path: '/extracurricular-activities' },
        { label: 'Financial Information', path: '/financial-information' },
    ];

    return (
        <div className="p-4 bg-slate-50 rounded-lg gap-1">
            <List items={menuItems} />
        </div>
    );
};

export default ProfileScreen;
