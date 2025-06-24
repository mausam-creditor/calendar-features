const express = require('express');
const router = express.Router();
const remindersController = require('./reminders.controller');

router.post('/:id/reminders', remindersController.addReminder);

router.get('/reminders', remindersController.getAllReminders);

router.put('/reminders/:reminderId', remindersController.updateReminder);

router.delete('/:eventId/reminders/:reminderId', remindersController.deleteReminder);
router.get('/:eventId', remindersController.getRemindersByEvent);
router.get('/user/:userId', remindersController.getRemindersByUser);

module.exports = router;
