import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/IDCardGenerator.css";
import IDCard from "./IDCard";

const IDCardGenerator = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    grade: "",
    section: "",
    guardianName: "",
    guardianMobile: "",
    address: "",
    photo: null
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showIDCard, setShowIDCard] = useState(false);
  const addressRef = useRef(null);
  const fileInputRef = useRef(null);

  const grades = [
    "1st", "2nd", "3rd", "4th", "5th", "6th", 
    "7th", "8th", "9th", "10th", "11th", "12th"
  ];

  const sections = ["A", "B", "C"];

  // Handle input change for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for mobile numbers to only allow digits
    if (name === 'guardianMobile') {
      const sanitizedValue = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [name]: sanitizedValue,
      });
    } else {
      // Default handling for other fields
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        setErrors({
          ...errors,
          photo: "Please upload an image file (jpg, png, etc.)"
        });
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          photo: "Image size should be less than 5MB"
        });
        return;
      }

      setFormData({
        ...formData,
        photo: file
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear error if any
      if (errors.photo) {
        setErrors({
          ...errors,
          photo: ""
        });
      }
    }
  };

  // Remove photo
  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      photo: null
    });
    setPhotoPreview(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Auto-resize address textarea based on content
  const handleAddressChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      address: value
    });

    if (addressRef.current) {
      const addressElement = addressRef.current;
      addressElement.style.height = 'var(--idcard-input-height)';
      
      // Only adjust height if content overflows
      if (addressElement.scrollHeight > addressElement.clientHeight) {
        addressElement.style.height = 'auto';
        addressElement.style.height = addressElement.scrollHeight + 'px';
        addressElement.classList.add('has-content');
      } else if (value === '') {
        addressElement.classList.remove('has-content');
      }
    }

    // Clear error when user starts typing
    if (errors.address) {
      setErrors({
        ...errors,
        address: ""
      });
    }
  };

  // Trigger file input click
  const handlePhotoUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle key press for mobile fields to only allow numbers
  const handleNumberKeyPress = (e) => {
    const allowedChars = /[0-9]/;
    if (!allowedChars.test(e.key)) {
      e.preventDefault();
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const invalidStartDigits = /^[1-5]/;

    // Validate Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter full name";
    }

    // Validate Grade
    if (!formData.grade) {
      newErrors.grade = "Please select a grade";
    }

    // Validate Section
    if (!formData.section) {
      newErrors.section = "Please select a section";
    }

    // Validate Guardian Name
    if (!formData.guardianName.trim()) {
      newErrors.guardianName = "Please enter guardian's name";
    }

    // Validate Guardian Mobile
    if (!formData.guardianMobile) {
      newErrors.guardianMobile = "Please enter guardian's mobile number";
    } else if (formData.guardianMobile.length !== 10) {
      newErrors.guardianMobile = "Mobile number must be exactly 10 digits";
    } else if (invalidStartDigits.test(formData.guardianMobile)) {
      newErrors.guardianMobile = "Invalid Number. Number cannot start with 1, 2, 3, 4, or 5";
    }

    // Validate Address
    if (!formData.address.trim()) {
      newErrors.address = "Please enter address";
    }

    // Validate Photo
    if (!formData.photo) {
      newErrors.photo = "Please upload a photo";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);

      // Show toast for each error
      Object.values(formErrors).forEach((error) => {
        toast.error(error);
      });

      return;
    }

    // Form is valid, show ID card
    setShowIDCard(true);
    toast.success("ID Card generated successfully!");
  };

  // Handle back button click from ID card view
  const handleBackToForm = () => {
    setShowIDCard(false);
  };

  // Show ID card if generated
  if (showIDCard) {
    return <IDCard studentData={formData} onBack={handleBackToForm} />;
  }

  return (
    <div className="idcard-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="idcard-header">
        <div className="idcard-logo">ID Card Generator</div>
      </header>
      <div className="idcard-form-container">
        <form onSubmit={handleSubmit} className="idcard-form">
          {/* Photo Upload */}
          <div className="idcard-form-group idcard-photo-upload">
            <label htmlFor="photo">
              Upload Photo <span className="idcard-required">*</span>
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div className="idcard-photo-container">
              <div 
                className={`idcard-photo-preview ${photoPreview ? 'has-photo' : ''} ${errors.photo ? 'idcard-error' : ''}`}
                onClick={photoPreview ? null : handlePhotoUploadClick}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="idcard-preview-image" />
                ) : (
                  <div className="idcard-photo-placeholder">
                    <span className="idcard-photo-icon">+</span>
                    <span>Click to upload photo</span>
                  </div>
                )}
              </div>
              {photoPreview ? (
                <button 
                  type="button" 
                  className="idcard-remove-btn"
                  onClick={handleRemovePhoto}
                >
                  Remove Photo
                </button>
              ) : (
                <button 
                  type="button" 
                  className="idcard-upload-btn"
                  onClick={handlePhotoUploadClick}
                >
                  Browse Files
                </button>
              )}
            </div>
            {errors.photo && <div className="idcard-error-message">{errors.photo}</div>}
          </div>

          {/* Full Name */}
          <div className="idcard-form-group">
            <label htmlFor="fullName">
              Full Name <span className="idcard-required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? "idcard-error" : ""}
              placeholder="Enter full name"
            />
            {errors.fullName && <div className="idcard-error-message">{errors.fullName}</div>}
          </div>

          {/* Grade and Section (same row) */}
          <div className="idcard-form-row">
            <div className="idcard-form-group">
              <label htmlFor="grade">
                Grade <span className="idcard-required">*</span>
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className={errors.grade ? "idcard-error" : ""}
              >
                <option value="">Select Grade</option>
                {grades.map((grade, index) => (
                  <option key={index} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              {errors.grade && <div className="idcard-error-message">{errors.grade}</div>}
            </div>

            <div className="idcard-form-group">
              <label htmlFor="section">
                Section <span className="idcard-required">*</span>
              </label>
              <select
                id="section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className={errors.section ? "idcard-error" : ""}
              >
                <option value="">Select Section</option>
                {sections.map((section, index) => (
                  <option key={index} value={section}>
                    {section}
                  </option>
                ))}
              </select>
              {errors.section && <div className="idcard-error-message">{errors.section}</div>}
            </div>
          </div>

          {/* Father's/Guardian's Name and Mobile Number (same row) */}
          <div className="idcard-form-row">
            <div className="idcard-form-group">
              <label htmlFor="guardianName">
                Father's/Guardian's Name <span className="idcard-required">*</span>
              </label>
              <input
                type="text"
                id="guardianName"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                className={errors.guardianName ? "idcard-error" : ""}
                placeholder="Enter father's/guardian's name"
              />
              {errors.guardianName && <div className="idcard-error-message">{errors.guardianName}</div>}
            </div>

            <div className="idcard-form-group">
              <label htmlFor="guardianMobile">
                Guardian's Mobile <span className="idcard-required">*</span>
              </label>
              <input
                type="text"
                id="guardianMobile"
                name="guardianMobile"
                value={formData.guardianMobile}
                onChange={handleChange}
                onKeyPress={handleNumberKeyPress}
                className={errors.guardianMobile ? "idcard-error" : ""}
                placeholder="10-digit mobile number"
                maxLength="10"
              />
              {errors.guardianMobile && <div className="idcard-error-message">{errors.guardianMobile}</div>}
            </div>
          </div>

          {/* Address */}
          <div className="idcard-form-group">
            <label htmlFor="address">
              Address <span className="idcard-required">*</span>
            </label>
            <textarea
              ref={addressRef}
              id="address"
              name="address"
              value={formData.address}
              onChange={handleAddressChange}
              className={errors.address ? "idcard-error" : ""}
              placeholder="Enter complete address"
            />
            {errors.address && <div className="idcard-error-message">{errors.address}</div>}
          </div>

          {/* Generate Button */}
          <button type="submit" className="idcard-generate-btn">
            Generate ID Card
          </button>
        </form>
      </div>
    </div>
  );
};

export default IDCardGenerator; 