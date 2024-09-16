// components/BackButton.js
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button 
            className="absolute top-4 left-4 z-50 text-blue-600"
            onClick={() => navigate(-1)}
            aria-label="Go back"
        >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </button>
    );
};

export default BackButton;