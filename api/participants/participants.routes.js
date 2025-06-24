const express = require('express');
const router = express.Router();
const participantsController = require('./participants.controller');

// Add multiple participants to an event
router.post('/:id/participants', participantsController.addParticipants);

// Add a single participant to an event
router.post('/:eventId/participant', participantsController.addSingleParticipant);

// Get all participants of an event
router.get('/:eventId/participants', participantsController.getParticipants);

// Remove a participant from an event
router.delete('/:eventId/participants/:userId', participantsController.removeParticipant);

module.exports = router;
