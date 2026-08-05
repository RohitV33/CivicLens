// ============================================================
// lib/prisma.js - DATABASE CLIENT (Singleton)
//
// Prisma is our ORM (Object Relational Mapper).
// It lets us talk to PostgreSQL using JavaScript code instead of raw SQL.
//
// We create ONE PrismaClient and reuse it everywhere.
// (Creating multiple clients wastes database connections)
// ============================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;