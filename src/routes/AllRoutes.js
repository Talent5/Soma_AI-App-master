// src/router/AllRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfileScreen from '../components/Profile/ProfileScreen';
import PersonalInfo from '../components/Profile/PersonalInfo';
import EducationalInfo from '../components/Profile/EducationalInfo';
import FieldOfStudy from '../components/Profile/FieldOfStudy';
import ExtracurricularActivities from '../components/Profile/ExtracurricularActivities';
import FinancialInfo from '../components/Profile/FinancialInfo';

const AllRoutes = () => {
    return (
        <Routes>
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/personal-information" element={<PersonalInfo />} />
            <Route path="/educational-information" element={<EducationalInfo />} />
            <Route path="/field-of-study" element={<FieldOfStudy />} />
            <Route path="/extracurricular-activities" element={<ExtracurricularActivities />} />
            <Route path="/financial-information" element={<FinancialInfo />} />
        </Routes>
    );
};

export default AllRoutes;
