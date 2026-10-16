import dotenv from 'dotenv';
import { db } from '../db/datastore.js';

dotenv.config();

async function run() {
  await db.init();
  db.resetToSeed();
  console.log('🌱 Green Basket database seeded successfully with Fresh Fruits, Graded Vegetables (Grade A/B/C), Dry Fruits, Coupons, Delivery Slots, PIN Codes, Users, and Sample Orders!');
  process.exit(0);
}

run();
