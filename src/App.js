import React, { useState, useEffect } from "react";
import "./App.css";
import Popup from "./Popup";
import Popup2 from './popupsearch';
function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [groupedJobs, setGroupedJobs] = useState({});
  const [updatedJob, setUpdatedJob] = useState({});
  const [showPopup2, setShowPopup2] = useState(false);
  const [searchDate, setSearchDate] = useState("");

  //poups toggles
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const togglePopup2 = () => {
    setShowPopup2(!showPopup2);
  };

  const handleEditClick = (job) => {
    setEditJob(job._id);
    setUpdatedJob({ ...job });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedJob({ ...updatedJob, [name]: value });
  };

  //connects to backend
  useEffect(() => {
    const fetchJobsByDate = async () => {
      try {
        const response = await fetch("http://localhost:3001/get-jobs-by-date");
        const data = await response.json();
        if (data && typeof data === "object") {
          setGroupedJobs(data);
        } else {
          console.error("Unexpected data format:", data);
          setGroupedJobs({});
        }
      } catch (err) {
        console.error("Error fetching jobs by date:", err);
        setGroupedJobs({});
      }
    };

    fetchJobsByDate();
  }, []);

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/update-job/${updatedJob._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedJob),
      });
      const data = await response.json();
      if (data.success) {
        alert("Job updated successfully!");
        setGroupedJobs((prev) => {
          return {
            ...prev,
            [updatedJob.DateDue]: prev[updatedJob.DateDue].map(job =>
              job._id === updatedJob._id ? updatedJob : job
            )
          };
        });
        setEditJob(null);
      }
    } catch (err) {
      console.error("Error updating job:", err);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await fetch(`http://localhost:3001/delete-job/${jobId}`, {
        method: "DELETE",
      });
      setGroupedJobs((prev) => {
        return Object.fromEntries(
          Object.entries(prev).map(([date, jobs]) => [
            date,
            jobs.filter((job) => job._id !== jobId),
          ])
        );
      });
      alert("Job deleted successfully!");
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  // Calculate total hours for each day
  const getTotalHoursByDay = () => {
    const dayHours = {};

    Object.values(groupedJobs).flat().forEach((job) => {
      const date = job.DateDue; 
      const hours = parseFloat(job.TimeAllocated) || 0;

      if (!dayHours[date]) {
        dayHours[date] = 0;
      }

      dayHours[date] += hours;
    });

    return dayHours;
  };

  const totalHoursByDay = getTotalHoursByDay();

  const handleSearchChange = (e) => {
    setSearchDate(e.target.value);
  };
  //finds where on page the date is
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (groupedJobs[searchDate]) {
      const element = document.getElementById(searchDate);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      alert("Date not found!");
    }
  };

  return (
    <div className="App">
      <header>
        <div className="logo">
          <img src={require("./Logo.png")} alt="logo" />
        </div>
        <nav>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); togglePopup(); }}>Add Job</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); togglePopup2(); }}>Search Employee</a></li>
          </ul>
        </nav>
        <div className="search-bar-right">
          <input
            type="text"
            placeholder="Search Date (YYYY-MM-DD)"
            value={searchDate}
            onChange={handleSearchChange}
          />
          <button onClick={handleSearchSubmit}>Go</button>
        </div>
      </header>

      {showPopup && <Popup onClose={togglePopup} />}
      {showPopup2 && <Popup2 groupedJobs={groupedJobs} onClose={togglePopup2} />}

      {Object.keys(groupedJobs).map((date) => (
        <div key={date} id={date}>
          <h2>{`Total Hours for ${date}: ${totalHoursByDay[date]?.toFixed(2) || 0}`}</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Date Due</th>
                <th>Day</th>
                <th>Role</th>
                <th>Employee</th>
                <th>Time Taken</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedJobs[date].map((job) => (
                <tr key={job._id}>
                  <td>{job.DateDue}</td>
                  <td>{job.Day}</td>
                  <td>{editJob === job._id ?
                    <input
                      type="text"
                      name="Role"
                      value={updatedJob.Role}
                      onChange={handleInputChange}
                    />
                    : job.Role}
                  </td>
                  <td>{editJob === job._id ?
                    <input
                      type="number"
                      name="Employee"
                      value={updatedJob.Employee}
                      onChange={handleInputChange}
                    />
                    : job.Employee}
                  </td>
                  <td>{editJob === job._id ?
                    <input
                      type="number"
                      name="TimeAllocated"
                      value={updatedJob.TimeAllocated}
                      onChange={handleInputChange}
                    />
                    : job.TimeAllocated}
                  </td>
                  <td>{editJob === job._id ?
                    <textarea
                      name="Comments"
                      value={updatedJob.Comments}
                      onChange={handleInputChange}
                    />
                    : job.Comments}
                  </td>
                  <td>
                    {editJob === job._id ? (
                      <button onClick={handleSubmitEdit}>Save</button>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(job)}>Edit</button>
                        <button onClick={() => deleteJob(job._id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default App;
