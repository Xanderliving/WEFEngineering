import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ jobTitle: "", companyName: "", location: "" });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setData(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedData = [...data, formData];
    setData(updatedData);

    const worksheet = XLSX.utils.json_to_sheet(updatedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "UpdatedData.xlsx"); // Downloads the updated file
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="App">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <form onSubmit={handleFormSubmit}>
        <label>
          Job Title:
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleFormChange}
            required
          />
        </label>
        <label>
          Company Name:
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleFormChange}
            required
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleFormChange}
            required
          />
        </label>
        <button type="submit">Add Job</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {data.map((job, index) => (
            <tr key={index}>
              <td>{job.jobTitle}</td>
              <td>{job.companyName}</td>
              <td>{job.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
