// src/components/Onboarding/ReviewAndEdit.js
import React, { useContext, useState } from 'react';
import { FormDataContext } from './FormDataContext';
import { useNavigate } from 'react-router-dom';

export const ReviewAndEdit = () => {
  const { formData, updateFormData } = useContext(FormDataContext);
  const navigate = useNavigate();
  const [editableData, setEditableData] = useState(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateFormData(editableData);
    navigate('/onboarding25'); // Adjust the route to your actual onboarding page
  };

  return (
    <div className="review-edit-container">
      <h2>Review and Edit Your Information</h2>
      <form>
        {Object.keys(editableData).map((key) => (
          key !== 'currentStep' && ( // Exclude fields like currentStep if not needed
            <div key={key} className="form-group">
              <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
              <input
                type="text"
                id={key}
                name={key}
                value={editableData[key] || ''}
                onChange={handleChange}
              />
            </div>
          )
        ))}
        <button type="button" onClick={handleSave}>Save Changes</button>
        <button type="button" onClick={() => navigate('/onboarding25')}>Cancel</button>
      </form>
    </div>
  );
};
