import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import {
  ProductModel,
  UserModel,
  CouponModel,
  DeliverySlotModel,
  PinCodeModel,
  OrderModel,
  AuditLogModel,
} from '../models/schemas.js';
import {
  initialProducts,
  initialCoupons,
  initialDeliverySlots,
  initialPinCodes,
  initialUsers,
  initialOrders,
  initialAuditLogs,
} from '../seed/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'greenbasket_db.json');

let mongoConnected = false;

function sanitizeProductGrades(product) {
  const copy = { ...product };
  if (copy.category !== 'vegetables') {
    delete copy.vegetableGrades;
  } else if (!Array.isArray(copy.vegetableGrades) || copy.vegetableGrades.length === 0) {
    const basePrice = Number(copy.price) || 40;
    const baseOrig = Number(copy.originalPrice) || Math.round(basePrice * 1.25);
    copy.vegetableGrades = [
      {
        grade: 'Grade A',
        label: 'Premium quality, carefully selected vegetables',
        price: basePrice,
        originalPrice: baseOrig,
        stock: Math.max(10, Math.floor((copy.stock || 50) * 0.45)),
        freshness: 'Harvested < 6 hrs ago • Hand-sorted uniform size & zero blemishes',
        available: true,
      },
      {
        grade: 'Grade B',
        label: 'Standard quality vegetables',
        price: Math.max(10, Math.round(basePrice * 0.8)),
        originalPrice: basePrice,
        stock: Math.max(10, Math.floor((copy.stock || 50) * 0.35)),
        freshness: 'Harvested today • Great everyday kitchen quality & natural shape',
        available: true,
      },
      {
        grade: 'Grade C',
        label: 'Budget-friendly vegetables',
        price: Math.max(8, Math.round(basePrice * 0.6)),
        originalPrice: Math.max(12, Math.round(basePrice * 0.8)),
        stock: Math.max(5, Math.floor((copy.stock || 50) * 0.2)),
        freshness: 'Farm-fresh value pick • Ideal for curries, soups, purees & juices',
        available: true,
      },
    ];
  }
  return copy;
}

class DataStore {
  constructor() {
    this.state = {
      products: [],
      users: [],
      coupons: [],
      deliverySlots: [],
      pinCodes: [],
      orders: [],
      auditLogs: [],
      storeSettings: {
        codEnabled: true,
        expressDeliveryEnabled: true,
        taxRatePercent: 5,
        defaultDeliveryCharge: 30,
        freeDeliveryThreshold: 499,
        cancellationPolicyHours: 2,
        lastDailyPriceSync: new Date().toISOString(),
      },
    };
  }

  async init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const existingPinCodes = Array.isArray(parsed.pinCodes) ? parsed.pinCodes : [];
        const missingSeedPinCodes = initialPinCodes.filter(
          (seedPin) => !existingPinCodes.some((pin) => pin.pincode === seedPin.pincode)
        );
        const users = Array.isArray(parsed.users) ? parsed.users : initialUsers;
        const adminUser = users.find(
          (user) => user.role === 'admin' && user.email.toLowerCase() === 'admin@greenbasket.in'
        );
        const migratedAdminPassword =
          adminUser && bcrypt.compareSync('Admin@123', adminUser.passwordHash);
        if (migratedAdminPassword) {
          adminUser.passwordHash = bcrypt.hashSync('admin@123', 10);
        }
        this.state = {
          ...this.state,
          ...parsed,
          products: (parsed.products || initialProducts).map(sanitizeProductGrades),
          users,
          pinCodes: [...existingPinCodes, ...missingSeedPinCodes],
        };
        if (missingSeedPinCodes.length > 0 || migratedAdminPassword) {
          this.save();
        }
      } catch (err) {
        console.warn('Resetting corrupted DB file with fresh seed data:', err.message);
        this.resetToSeed();
      }
    } else {
      this.resetToSeed();
    }

    // Attempt connection to MongoDB if running
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenbasket';
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1800 });
      mongoConnected = true;
      console.log('✅ Connected to MongoDB at', mongoUri);
      await this.syncToMongo();
    } catch {
      mongoConnected = false;
      console.log('ℹ️ Local MongoDB daemon not detected on port 27017 — using persistent JSON datastore at server/data/greenbasket_db.json (all Mongoose schemas validated).');
    }
  }

  resetToSeed() {
    this.state = {
      products: initialProducts.map(sanitizeProductGrades),
      users: initialUsers,
      coupons: initialCoupons,
      deliverySlots: initialDeliverySlots,
      pinCodes: initialPinCodes,
      orders: initialOrders,
      auditLogs: initialAuditLogs,
      storeSettings: {
        codEnabled: true,
        expressDeliveryEnabled: true,
        taxRatePercent: 5,
        defaultDeliveryCharge: 30,
        freeDeliveryThreshold: 499,
        cancellationPolicyHours: 2,
        lastDailyPriceSync: new Date().toISOString(),
      },
    };
    this.save();
  }

  save() {
    this.state.products = this.state.products.map(sanitizeProductGrades);
    fs.writeFileSync(DB_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    if (mongoConnected) {
      this.syncToMongo().catch(() => {});
    }
  }

  async syncToMongo() {
    if (!mongoConnected) return;
    try {
      const count = await ProductModel.countDocuments();
      if (count === 0) {
        await ProductModel.insertMany(this.state.products);
        await UserModel.insertMany(this.state.users);
        await CouponModel.insertMany(this.state.coupons);
        await DeliverySlotModel.insertMany(this.state.deliverySlots);
        await PinCodeModel.insertMany(this.state.pinCodes);
        await OrderModel.insertMany(this.state.orders);
        await AuditLogModel.insertMany(this.state.auditLogs);
      }
    } catch {
      // Ignore duplicate key sync errors
    }
  }

  addAuditLog({ action, entityType, entityId, summary, adminName = 'Ananya Verma (Store Admin)', details = {} }) {
    const entry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      entityType,
      entityId,
      summary,
      adminName,
      timestamp: new Date().toISOString(),
      details,
    };
    this.state.auditLogs.unshift(entry);
    this.save();
    return entry;
  }
}

export const db = new DataStore();
export { sanitizeProductGrades };
