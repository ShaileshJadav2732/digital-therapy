import React, { useState } from 'react';
import './ChildProfile.css';
import { useNavigate } from 'react-router-dom';

const ChildProfile = () => {
  const [formData, setFormData] = useState({
    patientName: 'Child',
    age: '20',
    parentsName: 'Parent',
    challenges: ['Anxiety', 'Confidence', 'Depression'],
    hobbies: ['Books/Reading', 'Music', 'Movies'],
  });

  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    navigate('/Ai-Chat'); // Navigate to the Ai-Chat route after submission
  };

  return (
    <div className="child-profile-wrapper"> {/* New wrapper with background */}
      <div className="child-profile-container">
        <h2>Child Profile</h2>
        <form className="child-profile-form" onSubmit={handleSubmit}>
          {/* Patient Name / Username */}
          <div className="form-group">
            <label htmlFor="patientName">Name:</label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              placeholder="Your Full Name"
            />
          </div>

          {/* Age */}
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Age"
            />
          </div>

          {/* Parents' Name */}
          <div className="form-group">
            <label htmlFor="parentsName">Parent Name:</label>
            <input
              type="text"
              id="parentsName"
              name="parentsName"
              value={formData.parentsName}
              onChange={handleInputChange}
              placeholder="Enter parent's name"
            />
          </div>

          {/* Challenges / Issues */}
          <div className="form-group">
            <label>Challenges / Issues you would like help with:</label>
            <div className="checkbox-group">
              {['Anxiety', 'Confidence', 'Depression', 'Relationships', 'Motivation', 'Sleep', 'Stress', 'Loss'].map((challenge) => (
                <div key={challenge}>
                  <input
                    type="checkbox"
                    name="challenges"
                    value={challenge}
                    onChange={handleCheckboxChange}
                    checked={formData.challenges.includes(challenge)}
                  />
                  <label>{challenge}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Interests & Hobbies */}
          <div className="form-group">
            <label>Interests & Hobbies:</label>
            <div className="checkbox-group">
              {['Books/Reading', 'Music', 'Movies', 'Sports', 'Travel'].map((hobby) => (
                <div key={hobby}>
                  <input
                    type="checkbox"
                    name="hobbies"
                    value={hobby}
                    onChange={handleCheckboxChange}
                    checked={formData.hobbies.includes(hobby)}
                  />
                  <label>{hobby}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ChildProfile;
