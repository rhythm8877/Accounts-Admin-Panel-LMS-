"use client"

import React, { useState } from "react"
import "../styles/Dashboard.css"
import AttendanceManagement from "./AttendanceManagementSystem/AttendanceManagement"
import StudentFeeDetails from "./Fees"
import IDCardGenerator from "./IDCardGenerator"
import ResultsManagement from "./Results/ResultsManagement"
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
      case "ID Card Generator":
        return <IDCardGenerator />
      case "Attendance":
        return <AttendanceManagement />
      case "Results":
        return <ResultsManagement />
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