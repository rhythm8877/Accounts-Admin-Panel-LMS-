"use client"

import React, { useState } from "react"
import "../styles/Dashboard.css"
import StudentFeeDetails from "./Fees"
import StudentRegistrationForm from "./SchoolRegistrationForm/StudentRegistrationform"
import Sidebar from "./Sidebar"

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("Fees")

  const renderSection = () => {
    switch (activeSection) {
      case "Fees":
        return <StudentFeeDetails />
      case "Registration Form":
        return <StudentRegistrationForm />
      case "Project Form":
        return <ProjectForm />
      case "Cumulative1":
        return <Cumulative1 />
      default:
        return <StudentFeeDetails />
    }
  }

  return (
    <div className="dashboard-grid">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="main-content">
        {renderSection()}
      </main>
    </div>
  )
}

export default Dashboard