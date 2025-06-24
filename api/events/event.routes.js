const express = require('express');
const router = express.Router();
const controller = require('./event.controller.js');

// Create Event
router.post('/', controller.createEvent);

// Get all Events 
router.get('/', controller.getAllEvents);

// Get Event by ID
router.get('/:id', controller.getEventById);

// Update Event
router.patch('/:id', controller.updateEvent);

// Delete Event
router.delete('/:id', controller.deleteEvent);

// Get Recurrence Rule
router.get('/:id/recurrence', controller.getRecurrenceRule);



// Export iCal (optional)
// router.get('/:id/export', controller.exportICal);

module.exports = router;
