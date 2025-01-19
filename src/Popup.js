import React, { useState } from "react";
import "./Popup.css";
//Popup for adding a new job
function Popup({ onClose }) {
  const [formData, setFormData] = useState({
    DateDue: "",  
    Employee: "",
    Role: "",
    TimeAllocated: "",
    Comments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //Api to connect to backend
      const response = await fetch("http://localhost:3001/add-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Record added:", result);
        onClose();
      } else {
        console.error("Failed to add record");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };
//The form for adding a new job
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Add Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Date Due">Date Due:</label>
            <input
              type="date"
              id="DateDue"
              name="DateDue"
              value={formData.DateDue}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Employee Number">Employee Number:</label>
            <input
              type="number"
              id="number"
              name="Employee"
              value={formData.Employee}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Role">Role:</label>
            <input
              type="text"
              id="Role"
              name="Role"
              value={formData.Role}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Time Allocated">Time Taken:</label>
            <input
              type="number"
              id="number"
              name="TimeAllocated"
              value={formData.TimeAllocated}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Comments">Comments:</label>
            <textarea
              id="Comments"
              name="Comments"
              value={formData.Comments}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Popup;
