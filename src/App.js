import React, { useState, useEffect } from "react";
import "./App.css";
import Popup from "./Popup";
import axios from "axios";


function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [data, setData] = useState([]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    // Fetch data from the backend
    fetch("http://localhost:3001/data")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);


  return (
    <div className="App">
      <header>
        <div className="logo">
          <img src={require("./Logo.png")} alt="logo" />
        </div>
        <nav>
          <ul>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); togglePopup(); }}>
                Add Job
              </a>
            </li>
            <li><a href="#">Search Job</a></li>
          </ul>
        </nav>
      </header>
      {showPopup && <Popup onClose={togglePopup} />}
      <table>
        <thead>
        <tr>
            <th>Day</th>
            <th>Date</th>
            <th>Employee</th>
            <th>Role</th>
            <th>Time Allocated</th>
            <th>Comments</th>
            <th>Time Left</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record._id}>
              <td>{record.Day}</td>
              <td>{record.Date}</td>
              <td>{record.Employee}</td>
              <td>{record.Role}</td>
              <td>{record.TimeAllocated}</td>
              <td>{record.Comments}</td>
              <td>{record.TimeLeft}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
