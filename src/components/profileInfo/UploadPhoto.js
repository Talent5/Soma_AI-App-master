import React, { useState } from 'react';
import './profile.css'

const UploadPhoto = () => {
    const [photoURL, setPhotoURL] = useState('/default-avatar.png'); // Default avatar

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPhotoURL(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="upload-photo">
            <img src={photoURL} alt="Profile" className="profile-photo" />
            <input type="file" id="photo" style={{ display: 'none' }} onChange={handlePhotoChange} />
            <label htmlFor="photo" className="upload-button">Upload photo</label>
        </div>
    );
};

export default UploadPhoto;
