// prisma/seed.js — Demo seed data for CivicLens
// Run with: node prisma/seed.js
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const demoIssues = [
  {
    title: 'Large Pothole on GT Road',
    description: 'A dangerous pothole near Sector 14 crossing causing accidents.',
    location: 'GT Road, Sector 14, New Delhi',
    lat: 28.6139, lng: 77.2090,
    category: 'Pothole', status: 'OPEN',
  },
  {
    title: 'Overflowing Garbage Dump',
    description: 'Bin near market complex has not been cleared in 3 days.',
    location: 'Market Complex, Lajpat Nagar',
    lat: 28.5672, lng: 77.2434,
    category: 'Garbage', status: 'IN_PROGRESS',
  },
  {
    title: 'Street Light Out – Dark Zone',
    description: 'Street lights on Station Square have been non-functional for 2 weeks.',
    location: 'Station Square, Connaught Place',
    lat: 28.6328, lng: 77.2197,
    category: 'Lights', status: 'IN_PROGRESS',
  },
  {
    title: 'Pipeline Leakage – Water Wastage',
    description: 'Water pipe burst on Green Park Road wasting thousands of litres.',
    location: 'Green Park Main Road',
    lat: 28.5599, lng: 77.2025,
    category: 'Water', status: 'OPEN',
  },
  {
    title: 'Road Resurfacing Completed',
    description: 'Asphalt patch on Park Avenue has been successfully resurfaced.',
    location: 'Park Avenue, Ward 6, Dwarka',
    lat: 28.5921, lng: 77.0460,
    category: 'Pothole', status: 'RESOLVED',
  },
  {
    title: 'Broken Footpath Slab',
    description: 'Footpath near Saket metro station has broken slabs – risk for pedestrians.',
    location: 'Saket Metro Station, South Delhi',
    lat: 28.5244, lng: 77.2066,
    category: 'Infrastructure', status: 'OPEN',
  },
  {
    title: 'Drainage Blockage Flooding Street',
    description: 'Drainage drain blocked near Chandni Chowk causing water logging.',
    location: 'Chandni Chowk, Old Delhi',
    lat: 28.6507, lng: 77.2303,
    category: 'Drainage', status: 'IN_PROGRESS',
  },
  {
    title: 'Stray Dogs Near School',
    description: 'Aggressive stray dogs spotted outside DAV Public School.',
    location: 'DAV School, Rohini Sector 7',
    lat: 28.7103, lng: 77.1127,
    category: 'Animal', status: 'OPEN',
  },
]

async function main() {
  console.log('Seeding database...')

  // Upsert demo user so seed is idempotent
  const user = await prisma.user.upsert({
    where: { email: 'demo@civiclens.in' },
    update: {},
    create: {
      name: 'Demo Citizen',
      email: 'demo@civiclens.in',
      password: await bcrypt.hash('demo1234', 10),
      role: 'USER',
    },
  })

  console.log(`Demo user: ${user.email}`)

  // Delete existing demo issues (optional cleanup)
  await prisma.issue.deleteMany({ where: { reporterId: user.id } })

  for (const issue of demoIssues) {
    await prisma.issue.create({
      data: { ...issue, reporterId: user.id },
    })
  }

  console.log(`${demoIssues.length} demo issues seeded!`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
