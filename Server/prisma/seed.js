import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding production database schema...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@civiclens.gov.in";
  const adminRawPassword = process.env.ADMIN_PASSWORD || "Admin@civiclens2026";
  const userRawPassword = process.env.USER_PASSWORD || "User@civiclens2026";
  const user1Email = process.env.USER_EMAIL || "citizen@civiclens.com";

  const adminPassword = await bcrypt.hash(adminRawPassword, 10);
  const userPassword = await bcrypt.hash(userRawPassword, 10);

  // 1. Create System Admin
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", password: adminPassword },
    create: {
      name: "Municipal Admin Officer",
      email: adminEmail,
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // 2. Create Citizens
  const user1 = await prisma.user.upsert({
    where: { email: user1Email },
    update: { password: userPassword },
    create: {
      name: "Rohit Verma",
      email: user1Email,
      password: userPassword,
      role: "USER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "ananya@civiclens.com" },
    update: { password: userPassword },
    create: {
      name: "Ananya Gupta",
      email: "ananya@civiclens.com",
      password: userPassword,
      role: "USER",
    },
  });

  // 3. Create Sample Civic Issues
  const issue1 = await prisma.issue.create({
    data: {
      title: "Severe Road Crater Pothole",
      description: "Massive pothole near Sector 14 market causing traffic jams and potential accidents.",
      category: "POTHOLE",
      status: "ASSIGNED",
      priority: "HIGH",
      latitude: 28.6692,
      longitude: 77.4538,
      address: "GT Road, Sector 14, Ghaziabad",
      aiClassification: "Road Surface Degradation / Deep Crater Pothole",
      aiConfidence: 96.5,
      createdById: user1.id,
      assignedToId: admin.id,
    },
  });

  const issue2 = await prisma.issue.create({
    data: {
      title: "Overflowing Waste Container",
      description: "Garbage bin overflowing for 3 days attracting stray animals and blocking sidewalk.",
      category: "GARBAGE",
      status: "PENDING",
      priority: "CRITICAL",
      latitude: 28.6139,
      longitude: 77.2090,
      address: "Connaught Place Block B, New Delhi",
      aiClassification: "Waste Management Overflow",
      aiConfidence: 92.0,
      createdById: user2.id,
    },
  });

  const issue3 = await prisma.issue.create({
    data: {
      title: "Damaged Luminaire Streetlight",
      description: "Streetlight flickering and completely dark during night near public park entrance.",
      category: "STREETLIGHT",
      status: "RESOLVED",
      priority: "MEDIUM",
      latitude: 28.5355,
      longitude: 77.3910,
      address: "Sector 62 Park Road, Noida",
      aiClassification: "Electrical Fixture Failure",
      aiConfidence: 89.4,
      createdById: user1.id,
      assignedToId: admin.id,
    },
  });

  // 4. Create Issue History
  await prisma.issueHistory.createMany({
    data: [
      {
        issueId: issue1.id,
        changedById: user1.id,
        newStatus: "PENDING",
        comment: "Issue reported by citizen via CivicLens mobile web app.",
      },
      {
        issueId: issue1.id,
        changedById: admin.id,
        oldStatus: "PENDING",
        newStatus: "ASSIGNED",
        comment: "Assigned to Public Works Department field unit 4.",
      },
      {
        issueId: issue3.id,
        changedById: admin.id,
        oldStatus: "IN_PROGRESS",
        newStatus: "RESOLVED",
        comment: "Field technician replaced defective LED bulb and wiring fixture.",
      },
    ],
  });

  // 5. Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user1.id,
        issueId: issue1.id,
        message: "Your reported pothole issue has been reviewed and assigned to an officer.",
        isRead: false,
      },
      {
        userId: user1.id,
        issueId: issue3.id,
        message: "Great news! Your reported streetlight issue has been marked as RESOLVED.",
        isRead: true,
      },
      {
        userId: user2.id,
        issueId: issue2.id,
        message: "Thank you for reporting. Your waste management issue is pending municipal review.",
        isRead: false,
      },
    ],
  });

  console.log("✅ Production Seeding Completed!");
  console.log("   Admin:", admin.email);
  console.log("   User 1:", user1.email);
  console.log("   Issues Created: 3");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
