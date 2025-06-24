const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
//cretaing an event
module.exports = {
  async createEvent(req, res) {
    try {
      const data = req.body;
      const event = await prisma.event.create({
        data: {
          title: data.title,
          description: data.description,
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
          location: data.location,
          calendarType: data.calendarType,
          visibility: data.visibility || 'PRIVATE',
          creatorId: data.creatorId,
          groupId: data.groupId || null,
          isRecurring: data.isRecurring || false
        }
      });
      res.status(201).json(event);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create event' });
    }
  },

  // Get all events / or get specific events based on criteria
  async getAllEvents(req, res) {
    try {
      const { userId, groupId, startDate, endDate } = req.query;

      const filters = {};
      if (userId) {
        filters.participants = { some: { userId } };
      }
      if (groupId) {
        filters.groupId = groupId;
      }
      if (startDate && endDate) {
        filters.startTime = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        };
      }

      const events = await prisma.event.findMany({
        where: filters,
        include: {
          participants: true,
          reminder: true,
          recurrenceRule: true
        }
      });

      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  },

  // Get event by ID(event id)
  async getEventById(req, res) {
    try {
      const event = await prisma.event.findUnique({
        where: { id: req.params.id },
        include: {
          participants: true,
          reminder: true,
          recurrenceRule: true
        }
      });

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json(event);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  },

  // Update event
  async updateEvent(req, res) {
    try {
      const updated = await prisma.event.update({
        where: { id: req.params.id },
        data: req.body
      });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update event' });
    }
  },

  // Delete event
  async deleteEvent(req, res) {
    try {
      await prisma.event.delete({
        where: { id: req.params.id }
      });

      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  },

  // Get recurrence rule for an event
  async getRecurrenceRule(req, res) {
    try {
      const rule = await prisma.recurrenceRule.findUnique({
        where: { eventId: req.params.id }
      });

      if (!rule) {
        return res.status(404).json({ error: 'Recurrence rule not found' });
      }

      res.json(rule);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch recurrence rule' });
    }
  }
};
