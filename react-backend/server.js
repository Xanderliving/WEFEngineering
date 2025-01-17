const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3001;


app.use(cors());

const mongoURI = "mongodb+srv://alexw123456w:1234@cluster0.nn9mg.mongodb.net/myDatabase?retryWrites=true&w=majority";


mongoose
  .connect(mongoURI, { dbName: 'Tasks' })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

const recordSchema = new mongoose.Schema({
  Day: String,
  Date: String,
  Employee: Number,
  Role: String,
  TimeAllocated: Number,
  Comments: String,
  TimeLeft: Number,
});

const Record = mongoose.model('Timesheet', recordSchema);

app.get('/data', async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/data', async (req, res) => {
  try {
    const record = new Record({
      Day: 'Monday',
      Date: '2021-01-01',
      Employee: 1,
      Role: 'Developer',
      TimeAllocated: 8,
      Comments: 'No comments',
      TimeLeft: 8,
    });
    await record.save();
    res.json(record);
  } catch (err) {
    console.error('Error adding data:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
