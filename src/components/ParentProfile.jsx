  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';  // Import useNavigate
  import './ParentProfile.css';

  const ParentProfile = () => {
    const navigate = useNavigate();  // Initialize navigate hook

    const [formData, setFormData] = useState({
      patientName: 'Parent',
      parentsName: 'Child',
      challenges: ['Anxiety', 'Confidence', 'Depression'], // Default selected challenges
      hobbies: [],
      consent: true,  // Keep the consent state as boolean
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleCheckboxChange = (e) => {
      const { name, value, checked } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
          ? [...prevData[name], value]
          : prevData[name].filter((item) => item !== value),
      }));
    };

    const handleConsentChange = (e) => {
      setFormData({
        ...formData,
        consent: e.target.value === 'yes',  // Update state to true for 'yes' and false for 'no'
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Form Data:', formData);
      
      // After form submission, redirect to ChatAi page
      navigate('/Ai-Chat');
    };

    return (
      <div className='Parents'>
        <div className="parents-profile-container"> {/* Add background image styles here */}
        <h2>Parent's Profile</h2>
        <form className="parents-profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="patientName">Parent name:</label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              placeholder="Your Full Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="parentsName">Child Name:</label>
            <input
              type="text"
              id="parentsName"
              name="parentsName"
              value={formData.parentsName}
              onChange={handleInputChange}
              placeholder="Enter parent's name"
            />
          </div>

          <div className="form-group consent-group">
    <label htmlFor="consent">
      Do you give your consent to let your child use the Digital Therapy app to get help with their mental and behavioral health?
    </label>
    <div className="radio-group">
      <div>
        <input
          className='radio'
          type="radio"
          id="consentYes"
          name="consent"
          value="yes"
          checked={formData.consent === true}
          onChange={handleConsentChange}
        />
        <label className='radio' htmlFor="consentYes">Yes</label>
      </div>
      <div>
        <input
          className='radio'
          type="radio"
          id="consentNo"
          name="consent"
          value="no"
          checked={formData.consent === false}
          onChange={handleConsentChange}
        />
        <label htmlFor="consentNo">No</label>
      </div>
    </div>
  </div>
    <div className="form-group">
            <label>Please select the challenges/issues that you think your child would like help with:</label>
            <div className="checkbox-group">
              {/* Static Checked Challenges */}
              <div>
                <input
                  type="checkbox"
                  name="challenges"
                  value="Anxiety"
                  checked={formData.challenges.includes('Anxiety')}  // Checked by default
                  onChange={handleCheckboxChange}
                />
                <label>Anxiety</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="challenges"
                  value="Confidence"
                  checked={formData.challenges.includes('Confidence')}  // Checked by default
                  onChange={handleCheckboxChange}
                />
                <label>Confidence</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="challenges"
                  value="Depression"
                  checked={formData.challenges.includes('Depression')}  // Checked by default
                  onChange={handleCheckboxChange}
                />
                <label>Depression</label>
              </div>

              {/* Other Challenges */}
              {['Relationships', 'Motivation', 'Sleep', 'Stress', 'Loss'].map((challenge) => (
                <div key={challenge}>
                  <input
                    type="checkbox"
                    name="challenges"
                    value={challenge}
                    onChange={handleCheckboxChange}
                    checked={formData.challenges.includes(challenge)}  // Other checkboxes are handled dynamically
                  />
                  <label>{challenge}</label>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
      </div>
    );
  };

  export default ParentProfile;
