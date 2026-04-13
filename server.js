require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Cloud DB Connected!"))
    .catch(err => console.error("❌ DB Error:", err));

const Event = mongoose.model('Event', new mongoose.Schema({
    title: String, date: String, location: String
}));

app.get('/api/events', async (req, res) => {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
});

app.post('/api/events', async (req, res) => {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
});

app.delete('/api/events/:id', async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});
