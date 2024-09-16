// components/BackButton.js
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button 
            className=" text-blue-600"
            onClick={() => navigate(-1)}
            aria-label="Go back"
        >
            <ArrowLeft className="" /> Back
        </button>
    );
};

export default BackButton;