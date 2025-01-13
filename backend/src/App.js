import logo from './logo.svg';
import './App.css';

  const express = require("express");
  const fileUpload = require("express-fileupload");
  const XLSX = require("xlsx");
  const fs = require("fs");
  
  const app = express();
  app.use(fileUpload());
  app.use(express.json());
  
  app.post("/update-excel", (req, res) => {
    const { data } = req.body;
  
    // Read existing file
    const workbook = XLSX.readFile("src\Test.xlsx");
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
    // Append new data
    jsonData.push(...data);
  
    // Write back to file
    const newWorksheet = XLSX.utils.json_to_sheet(jsonData);
    workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
    XLSX.writeFile(workbook, "SRC\Test.xlsx");
  
    res.send({ success: true });
  });
  
  app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
  });