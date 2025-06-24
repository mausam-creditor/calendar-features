const { prisma } = require('../../prisma/client');



exports.getAllReminders = async (req, res) => {
  try {
    const reminders = await prisma.reminder.findMany();
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reminders', details: error });
  }
};

exports.getRemindersByEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const reminders = await prisma.reminder.findMany({
      where: { eventId }
    });
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reminders by eventId', details: error.message });
  }
};

exports.getRemindersByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const reminders = await prisma.reminder.findMany({
      where: { userId }
    });
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reminders by userId', details: error.message });
  }
};

exports.addReminder = async (req, res) => {
  const { id } = req.params;
  const { userId, triggerTime, method } = req.body;

  try {
    const reminder = await prisma.reminder.create({
      data: {
        eventId: id,
        userId,
        triggerTime: new Date(triggerTime),
        method
      }
    });
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add reminder', details: error });
  }
};


exports.updateReminder = async (req, res) => {
  const { reminderId } = req.params;
  const { triggerTime, method } = req.body;

  try {
    const updatedReminder = await prisma.reminder.update({
      where: { id: reminderId },
      data: {
        triggerTime: triggerTime ? new Date(triggerTime) : undefined,
        method
      }
    });
    res.status(200).json(updatedReminder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reminder', details: error });
  }
};

exports.deleteReminder = async (req, res) => {
  const { reminderId } = req.params;

  try {
    await prisma.reminder.delete({
      where: { id: reminderId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reminder', details: error });
  }
};
