import React, { useState } from "react";
import "./search.css";

//search pop up
const Popup2 = ({ groupedJobs, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  //gets all jobs and filters them by employee number
  const searchJobs = () => {
    const allJobs = Object.values(groupedJobs).flat();
    const employeeJobs = allJobs.filter((job) =>
      job.Employee.toString().includes(searchTerm)
    );

    setFilteredJobs(employeeJobs);
  };
  const totalHours = filteredJobs.reduce((total, job) => total + parseFloat(job.TimeAllocated || 0), 0);

  return (
    <div className="popup">
      <div className="popup-content">
        <button onClick={onClose}>Close</button>
        <h2>Search Employee Jobs</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter Employee Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <button onClick={searchJobs}>Search</button>
        </div>

        {filteredJobs.length > 0 ? (
          <>
            <table border="1">
              <thead>
                <tr>
                  <th>Date Due</th>
                  <th>Role</th>
                  <th>Time Taken</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job._id}>
                    <td>{job.DateDue}</td>
                    <td>{job.Role}</td>
                    <td>{job.TimeAllocated}</td>
                    <td>{job.Comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="total-hours">
              <h2>Total Hours Worked: </h2>{totalHours.toFixed(2)}
            </div>
          </>
        ) : (
          <p>No jobs found for this employee.</p>
        )}
      </div>
    </div>
  );
};

export default Popup2;
