// src/components/ListItem.js
import React from 'react';
import { Link } from 'react-router-dom';

const ListItem = ({ label, path }) => {
    return (
        <Link to={path} className="block">
            <div className="flex justify-between items-center p-4 border-b border-gray-300 hover:bg-gray-100">
                <span className="text-lg font-medium">{label}</span>
                <span className="text-gray-400">&#x2192;</span> {/* Right arrow symbol */}
            </div>
        </Link>
    );
};

export default ListItem;
