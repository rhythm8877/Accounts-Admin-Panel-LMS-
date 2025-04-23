"use client"

import { useEffect } from "react"
import "../../styles/SuccessAnimation.css"

const SuccessAnimation = () => {
  useEffect(() => {
    // Animation starts automatically with CSS
  }, [])

  return (
    <div className="success-container">
      <div className="success-checkmark">
        <div className="check-icon">
          <span className="icon-line line-tip"></span>
          <span className="icon-line line-long"></span>
          <div className="icon-circle"></div>
          <div className="icon-fix"></div>
        </div>
      </div>
      <h2 className="success-message">Submitted Successfully</h2>
    </div>
  )
}

export default SuccessAnimation
