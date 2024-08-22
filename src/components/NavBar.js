import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

import "./NavBar.css";

export const NavBar = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  return (
    <div className={`navbar bg-slate-50 ${className}`}>
      <div 
        className={`navitem ${location.pathname === '/' ? 'active' : ''}`} 
        onClick={() => handleNavClick('/home')}
        aria-label="Home"
      >
        <i className="bi bi-house-door"></i> {/* Home icon */}
      </div>
      <div 
        className={`navitem ${location.pathname === '/scholarships' ? 'active' : ''}`} 
        onClick={() => handleNavClick('/scholarships')}
        aria-label="Scholarships"
      >
        <i className="bi bi-search"></i> {/* Search icon */}
      </div>
      <div 
        className={`navitem ${location.pathname === '/applications' ? 'active' : ''}`} 
        onClick={() => handleNavClick('/applications')}
        aria-label="Applications"
      >
        <i className="bi bi-file-earmark-text"></i> {/* Applications icon */}
      </div>
      <div 
        className={`navitem ${location.pathname === '/documents' ? 'active' : ''}`} 
        onClick={() => handleNavClick('/documents')}
        aria-label="Documents"
      >
        <i className="bi bi-file-earmark"></i> {/* Documents icon */}
      </div>
    </div>
  );
};

NavBar.propTypes = {
  className: PropTypes.string,
};
