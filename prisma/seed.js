// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, 'dummyData.json');
  const rawData = fs.readFileSync(dataPath);
  const { users, groups, events, eventParticipants, reminders } = JSON.parse(rawData);

  // Create Users
  for (const user of users) {
    await prisma.users.create({ data: user });
  }

  // Create Groups
  for (const group of groups) {
    await prisma.groups.create({ data: group });
  }

  // Create Events
  for (const [index, event] of events.entries()) {
    await prisma.event.create({
      data: {
        ...event,
        id: `event${index + 1}` // assign a fixed ID for reference
      }
    });
  }

  // Add Participants
  for (const participant of eventParticipants) {
    await prisma.eventParticipant.create({ data: participant });
  }

  // Add Reminders
  for (const reminder of reminders) {
    await prisma.reminder.create({ data: reminder });
  }

  console.log('✅ Dummy data seeded successfully.');
}

main()
  .catch((e) => {
    console.error(' Seeding error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
