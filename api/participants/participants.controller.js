const { prisma } = require('../../prisma/client');

exports.addParticipants = async (req, res) => {
  const { id } = req.params;
  const participants = req.body; // [{ userId, role }]

  try {
    // Validate input
    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid input', 
        message: 'Participants must be an array with at least one participant' 
      });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return res.status(404).json({ 
        error: 'Event not found', 
        message: `Event with id ${id} does not exist` 
      });
    }

    // Validate each participant
    for (const participant of participants) {
      if (!participant.userId || !participant.role) {
        return res.status(400).json({ 
          error: 'Invalid participant data', 
          message: 'Each participant must have userId and role' 
        });
      }

      // Check if user exists
      const user = await prisma.users.findUnique({
        where: { id: participant.userId }
      });

      if (!user) {
        return res.status(404).json({ 
          error: 'User not found', 
          message: `User with id ${participant.userId} does not exist` 
        });
      }
    }

    const results = await prisma.$transaction(
      participants.map(p =>
        prisma.eventParticipant.upsert({
          where: { 
            eventId_userId: { 
              eventId: id, 
              userId: p.userId 
            } 
          },
          update: { role: p.role },
          create: { 
            eventId: id, 
            userId: p.userId, 
            role: p.role 
          },
        })
      )
    );

    res.status(201).json({
      message: 'Participants added successfully',
      data: results
    });
  } catch (error) {
    console.error('Error adding participants:', error);
    res.status(500).json({ 
      error: 'Failed to add participants', 
      message: error.message 
    });
  }
};

exports.getParticipants = async (req, res) => {
  const { eventId } = req.params;

  try {
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return res.status(404).json({ 
        error: 'Event not found', 
        message: `Event with id ${eventId} does not exist` 
      });
    }

    const participants = await prisma.eventParticipant.findMany({
      where: { eventId },
      include: { 
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        } 
      }
    });

    res.json({
      message: 'Participants retrieved successfully',
      data: participants
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ 
      error: 'Failed to fetch participants', 
      message: error.message 
    });
  }
};

exports.removeParticipant = async (req, res) => {
  const { eventId, userId } = req.params;

  try {
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return res.status(404).json({ 
        error: 'Event not found', 
        message: `Event with id ${eventId} does not exist` 
      });
    }

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found', 
        message: `User with id ${userId} does not exist` 
      });
    }

    // Check if participant exists
    const participant = await prisma.eventParticipant.findUnique({
      where: { 
        eventId_userId: { 
          eventId, 
          userId 
        } 
      }
    });

    if (!participant) {
      return res.status(404).json({ 
        error: 'Participant not found', 
        message: `User ${userId} is not a participant of event ${eventId}` 
      });
    }

    await prisma.eventParticipant.delete({
      where: { 
        eventId_userId: { 
          eventId, 
          userId 
        } 
      }
    });

    res.status(200).json({
      message: 'Participant removed successfully'
    });
  } catch (error) {
    console.error('Error removing participant:', error);
    res.status(500).json({ 
      error: 'Failed to remove participant', 
      message: error.message 
    });
  }
};

// New endpoint to add a single participant
exports.addSingleParticipant = async (req, res) => {
  const { eventId } = req.params;
  const { userId, role } = req.body;

  try {
    // Validate input
    if (!userId || !role) {
      return res.status(400).json({ 
        error: 'Invalid input', 
        message: 'userId and role are required' 
      });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return res.status(404).json({ 
        error: 'Event not found', 
        message: `Event with id ${eventId} does not exist` 
      });
    }

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found', 
        message: `User with id ${userId} does not exist` 
      });
    }

    const participant = await prisma.eventParticipant.upsert({
      where: { 
        eventId_userId: { 
          eventId, 
          userId 
        } 
      },
      update: { role },
      create: { 
        eventId, 
        userId, 
        role 
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Participant added successfully',
      data: participant
    });
  } catch (error) {
    console.error('Error adding participant:', error);
    res.status(500).json({ 
      error: 'Failed to add participant', 
      message: error.message 
    });
  }
};
