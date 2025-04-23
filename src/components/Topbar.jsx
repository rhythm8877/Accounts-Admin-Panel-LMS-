"use client"

import "../styles/TopBar.css"

const TopBar = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="topbar">
      <div className="user-info">
        <span className="user-role">Super Admin</span>
      </div>

      <div className="topbar-actions">
        <div className="theme-toggle">
          <input
            type="checkbox"
            id="theme-switch"
            className="theme-switch"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          <label htmlFor="theme-switch" className="theme-switch-label">
            <span className="theme-switch-inner"></span>
            <span className="theme-switch-switch"></span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default TopBar
