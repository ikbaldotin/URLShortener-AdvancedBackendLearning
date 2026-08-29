import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env.config.js";
import { PrismaClient } from "./../../generated/prisma/client.js";
import { Pool } from "pg";

const connectionString = `${env.DATABASE_URL}`;
const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
