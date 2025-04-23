"use client"

import { useEffect, useRef, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../styles/StudentRegistrationForm.css"
import SuccessAnimation from "./SuccessAnimation"

function StudentRegistrationForm() {
  const [formData, setFormData] = useState({
    studentName: "",
    dob: "",
    grade: "",
    fatherName: "",
    motherName: "",
    parentMobile: "",
    studentMobile: "",
    email: "",
    address: "",
    religion: "",
    tribe: "",
    category: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const addressRef = useRef(null)

  const religions = [
    "Hinduism",
    "Islam",
    "Christianity",
    "Sikhism",
    "Buddhism",
    "Jainism",
    "Zoroastrianism",
    "Judaism",
    "Bahá'í Faith",
    "Other"
  ]

  const grades = [
    "1st", "2nd", "3rd", "4th", "5th", "6th", 
    "7th", "8th", "9th", "10th", "11th", "12th"
  ]

  const categories = ["General", "SC", "ST", "OBC", "Minority", "EWS"]

  // Auto-resize address textarea based on content
  useEffect(() => {
    if (addressRef.current) {
      const addressElement = addressRef.current
      addressElement.style.height = 'var(--input-height)'
      
      // Only adjust height if content overflows
      if (addressElement.scrollHeight > addressElement.clientHeight) {
        addressElement.style.height = 'auto'
        addressElement.style.height = addressElement.scrollHeight + 'px'
        addressElement.classList.add('has-content')
      } else if (formData.address === '') {
        addressElement.classList.remove('has-content')
      }
    }
  }, [formData.address])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Special handling for DOB to only allow numbers and forward slash
    if (name === 'dob') {
      // Remove any non-numeric/slash characters
      let sanitizedValue = value.replace(/[^0-9/]/g, '')
      
      // Auto-format with slashes
      if (sanitizedValue.length === 2 && !sanitizedValue.includes('/') && formData.dob.length !== 3) {
        sanitizedValue = sanitizedValue + '/'
      } else if (sanitizedValue.length === 5 && sanitizedValue.split('/').length === 2 && formData.dob.length !== 6) {
        sanitizedValue = sanitizedValue + '/'
      }
      
      // Limit to 8 characters (DD/MM/YY)
      if (sanitizedValue.length <= 8) {
        setFormData({
          ...formData,
          [name]: sanitizedValue,
        })
      }
    }
    // Special handling for mobile numbers to only allow digits
    else if (name === 'parentMobile' || name === 'studentMobile') {
      const sanitizedValue = value.replace(/\D/g, '')
      setFormData({
        ...formData,
        [name]: sanitizedValue,
      })
    }
    // Default handling for other fields
    else {
    setFormData({
      ...formData,
      [name]: value,
    })
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const invalidStartDigits = /^[1-5]/

    // Validate Student Name
    if (!formData.studentName.trim()) {
      newErrors.studentName = "Please enter student's name"
    }

    // Validate DOB
    if (!formData.dob.trim()) {
      newErrors.dob = "Please enter date of birth"
    } else {
      const dobRegex = /^\d{2}\/\d{2}\/\d{2}$/
      if (!dobRegex.test(formData.dob)) {
        newErrors.dob = "Please enter date in DD/MM/YY format"
      }
    }

    // Validate Grade
    if (!formData.grade) {
      newErrors.grade = "Please select a grade"
    }

    // Validate Father/Guardian Name
    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "Please enter father's/guardian's name"
    }

    // Mother's Name is optional, no validation needed

    // Validate Parent/Guardian Mobile
    if (!formData.parentMobile) {
      newErrors.parentMobile = "Please enter parent's/guardian's mobile number"
    } else if (formData.parentMobile.length !== 10) {
      newErrors.parentMobile = "Mobile number must be exactly 10 digits"
    } else if (invalidStartDigits.test(formData.parentMobile)) {
      newErrors.parentMobile = "Invalid Number. Number cannot start with 1, 2, 3, 4, or 5"
    }

    // Validate Student Mobile (optional)
    if (formData.studentMobile) {
      if (formData.studentMobile.length !== 10) {
        newErrors.studentMobile = "Mobile number must be exactly 10 digits"
      } else if (invalidStartDigits.test(formData.studentMobile)) {
        newErrors.studentMobile = "Invalid Number. Number cannot start with 1, 2, 3, 4, or 5"
      }
    }

    // Validate Email (optional)
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Validate Address
    if (!formData.address.trim()) {
      newErrors.address = "Please enter address"
    }

    // Validate Religion
    if (!formData.religion) {
      newErrors.religion = "Please select a religion"
    }

    // Validate Category
    if (!formData.category) {
      newErrors.category = "Please select a category"
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formErrors = validateForm()

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)

      // Show toast for each error
      Object.values(formErrors).forEach((error) => {
        toast.error(error)
      })

      return
    }

    // Form is valid, show success
    setIsSubmitted(true)
    toast.success("Form submitted successfully!")
  }

  // Handle key press for DOB field to only allow numbers and forward slash
  const handleDOBKeyPress = (e) => {
    const allowedChars = /[0-9/]/
    if (!allowedChars.test(e.key)) {
      e.preventDefault()
    }
  }

  // Handle key press for mobile fields to only allow numbers
  const handleNumberKeyPress = (e) => {
    const allowedChars = /[0-9]/
    if (!allowedChars.test(e.key)) {
      e.preventDefault()
    }
  }

  if (isSubmitted) {
    return <SuccessAnimation />
  }

  return (
    <div className="student-app-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="student-header">
        <div className="student-logo">Student Registration Form</div>
      </header>
      <div className="student-form-container">
        <form onSubmit={handleSubmit} className="student-registration-form">
          {/* Student's Name (single row) */}
          <div className="student-form-group">
            <label htmlFor="studentName">
              Student's Name <span className="student-required">*</span>
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              className={errors.studentName ? "student-error" : ""}
              placeholder="Enter student's name"
            />
            {errors.studentName && <div className="student-error-message">{errors.studentName}</div>}
          </div>

          {/* DOB and Grade (same row) */}
          <div className="student-form-row">
            <div className="student-form-group">
              <label htmlFor="dob">
                Date of Birth (DD/MM/YY) <span className="student-required">*</span>
              </label>
              <input
                type="text"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                onKeyPress={handleDOBKeyPress}
                className={errors.dob ? "student-error" : ""}
                placeholder="DD/MM/YY"
                maxLength="8"
              />
              {errors.dob && <div className="student-error-message">{errors.dob}</div>}
            </div>

            <div className="student-form-group">
              <label htmlFor="grade">
                Grade <span className="student-required">*</span>
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className={errors.grade ? "student-error" : ""}
              >
                <option value="">Select Grade</option>
                {grades.map((grade, index) => (
                  <option key={index} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              {errors.grade && <div className="student-error-message">{errors.grade}</div>}
            </div>
          </div>

          {/* Father's/Guardian's Name & Mother's Name (same row) */}
          <div className="student-form-row">
            <div className="student-form-group">
              <label htmlFor="fatherName">
                Father's/Guardian's Name <span className="student-required">*</span>
              </label>
              <input
                type="text"
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className={errors.fatherName ? "student-error" : ""}
                placeholder="Enter father's/guardian's name"
              />
              {errors.fatherName && <div className="student-error-message">{errors.fatherName}</div>}
            </div>

            <div className="student-form-group">
              <label htmlFor="motherName">
                Mother's Name
              </label>
              <input
                type="text"
                id="motherName"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                className={errors.motherName ? "student-error" : ""}
                placeholder="Enter mother's name"
              />
              {errors.motherName && <div className="student-error-message">{errors.motherName}</div>}
            </div>
          </div>

          {/* Parent's/Guardian's Mobile Number and Student's Mobile Number (same row) */}
          <div className="student-form-row">
            <div className="student-form-group">
              <label htmlFor="parentMobile">
                Parent's/Guardian's Mobile Number <span className="student-required">*</span>
              </label>
              <input
                type="text"
                id="parentMobile"
                name="parentMobile"
                value={formData.parentMobile}
                onChange={handleChange}
                onKeyPress={handleNumberKeyPress}
                className={errors.parentMobile ? "student-error" : ""}
                placeholder="10-digit mobile number"
                maxLength="10"
              />
              {errors.parentMobile && <div className="student-error-message">{errors.parentMobile}</div>}
            </div>

            <div className="student-form-group">
              <label htmlFor="studentMobile">
                Student's Mobile Number
              </label>
              <input
                type="text"
                id="studentMobile"
                name="studentMobile"
                value={formData.studentMobile}
                onChange={handleChange}
                onKeyPress={handleNumberKeyPress}
                className={errors.studentMobile ? "student-error" : ""}
                placeholder="10-digit mobile number"
                maxLength="10"
              />
              {errors.studentMobile && <div className="student-error-message">{errors.studentMobile}</div>}
            </div>
          </div>

          {/* Email & Address (same row) */}
          <div className="student-form-row">
            <div className="student-form-group">
              <label htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "student-error" : ""}
                placeholder="Enter email address"
              />
              {errors.email && <div className="student-error-message">{errors.email}</div>}
            </div>

            <div className="student-form-group">
              <label htmlFor="address">
                Address <span className="student-required">*</span>
              </label>
              <textarea
                ref={addressRef}
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? "student-error" : ""}
                placeholder="Enter complete address"
              />
              {errors.address && <div className="student-error-message">{errors.address}</div>}
            </div>
          </div>

          {/* Religion (single row) */}
          <div className="student-form-group">
            <label htmlFor="religion">
              Religion <span className="student-required">*</span>
            </label>
            <select
              id="religion"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              className={errors.religion ? "student-error" : ""}
            >
              <option value="">Select Religion</option>
              {religions.map((religion, index) => (
                <option key={index} value={religion}>
                  {religion}
                </option>
              ))}
            </select>
            {errors.religion && <div className="student-error-message">{errors.religion}</div>}
          </div>

          {/* Tribe and Category (same row) */}
          <div className="student-form-row">
            <div className="student-form-group">
              <label htmlFor="tribe">
                Tribe
              </label>
              <input
                type="text"
                id="tribe"
                name="tribe"
                value={formData.tribe}
                onChange={handleChange}
                className={errors.tribe ? "student-error" : ""}
                placeholder="Enter tribe (if applicable)"
              />
              {errors.tribe && <div className="student-error-message">{errors.tribe}</div>}
            </div>

            <div className="student-form-group">
            <label htmlFor="category">
                Category <span className="student-required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
                className={errors.category ? "student-error" : ""}
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
              {errors.category && <div className="student-error-message">{errors.category}</div>}
          </div>
          </div>

          <button type="submit" className="student-submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default StudentRegistrationForm;