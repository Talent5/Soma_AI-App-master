import React from 'react';

const InputField = ({ label, value, onChange, type = 'text', readOnly = false }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-normal mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>
);

export const InputFields = ({ userData, onInputChange }) => (
  <>
    <InputField
      label="First name"
      value={userData.firstName}
      onChange={(value) => onInputChange('firstName', value)}
    />
    <InputField
      label="Middle name (optional)"
      value={userData.middleName}
      onChange={(value) => onInputChange('middleName', value)}
    />
    <InputField
      label="Last name"
      value={userData.lastName}
      onChange={(value) => onInputChange('lastName', value)}
    />
    <InputField
      label="Date of birth"
      value={userData.dateOfBirth}
      onChange={(value) => onInputChange('dateOfBirth', value)}
      type="date"
    />
    <InputField
      label="Email address"
      value={userData.email}
      onChange={(value) => onInputChange('email', value)}
      type="email"
      readOnly
    />
    <InputField
      label="Phone number (include country code)"
      value={userData.phoneNumber}
      onChange={(value) => onInputChange('phoneNumber', value)}
    />
    <InputField
      label="Nationality"
      value={userData.nationality}
      onChange={(value) => onInputChange('nationality', value)}
    />
  </>
);

// Add this line at the end of the file
export default InputFields;

