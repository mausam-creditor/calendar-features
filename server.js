const express = require('express');
const cors = require('cors');
require('dotenv').config();

const eventRoutes = require('./api/events/event.routes.js');
 //const eventRoutes = require('./src/routes/calendar/events/event.routes.js');

const participantRoutes = require('./api/participants/participants.routes');
//const participantRoutes = require('./src/routes/calendar/participants/participants.routes');

const reminderRoutes = require('./api/reminders/reminders.routes');
// const reminderRoutes = require('./src/routes/calendar/reminders/reminders.routes');


const app = express();
const PORT = process.env.PORT || 3000;
//middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/participants', participantRoutes);
app.use('/reminders', reminderRoutes);


// Mount the event routes
app.use('/api/events', eventRoutes);

// Root check
app.get('/', (req, res) => {
  res.send('Calendar API is running!');
});

//error handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
