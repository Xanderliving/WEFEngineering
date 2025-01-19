const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

//Mnogo details
const mongoURI = "mongodb+srv://alexw123456w:1234@cluster0.nn9mg.mongodb.net/myDatabase?retryWrites=true&w=majority";


mongoose
    .connect(mongoURI, { dbName: 'Tasks' })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));


    //Database Schema
const recordSchema = new mongoose.Schema({
    Day: String,
    DateDue: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ }, 
    Employee: Number,
    Role: String,
    TimeAllocated: Number,
    Comments: String,
    archived: { type: Boolean, default: false },  

  });
  const Record = mongoose.model('Timesheet', recordSchema);

  //Get data
app.get('/get-jobs-by-date', async (req, res) => {
    try {
      const records = await Record.find().sort({ DateDue: 1 }); // Sort records by DateDue in ascending order
      const groupedByDate = records.reduce((acc, record) => {
        const dateKey = record.DateDue; // Use DateDue as the key
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(record);
        return acc;
      }, {});
  
      res.status(200).json(groupedByDate);
    } catch (err) {
      console.error("Error fetching jobs by date:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  //Add Data
app.post('/add-job', async (req, res) => {
    try {
      const { DateDue, Employee, Role, TimeAllocated, Comments } = req.body;

      const date = new Date(DateDue);
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayOfWeek = daysOfWeek[date.getDay()];

      const newRecord = new Record({
        DateDue,
        Day: dayOfWeek,
        Employee,
        Role,
        TimeAllocated,
        Comments,
      });
  
      await newRecord.save();
      res.status(201).json({ message: "Record added successfully", data: newRecord });
    } catch (err) {
      console.error("Error adding job:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  //Edit Data
  app.put('/update-job/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const updatedJob = await Record.findByIdAndUpdate(id, updatedData, { new: true });
      if (!updatedJob) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      res.status(200).json({ success: true, updatedJob });
    } catch (err) {
      console.error("Error updating job:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  //Delete Data
  app.delete('/delete-job/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Record.findByIdAndDelete(id);
      res.json({ success: true });
    } catch (err) {
      console.error("Error deleting job:", err);
      res.status(500).json({ success: false });
    }
  });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

