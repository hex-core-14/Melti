// lib/db.ts
import { getDb } from './mongodb';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  tasteMood: string;
  createdAt: string;
}

export interface OtpRecord {
  email: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
}

let indexesReady = false;

async function ensureIndexes() {
  if (indexesReady) return;
  const db = await getDb();
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('otps').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  indexesReady = true;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  await ensureIndexes();
  const db = await getDb();
  return db
    .collection<UserRecord>('users')
    .findOne({ email: email.trim().toLowerCase() });
}

export async function createUser(user: UserRecord): Promise<UserRecord> {
  await ensureIndexes();
  const db = await getDb();
  const doc: UserRecord = {
    ...user,
    email: user.email.trim().toLowerCase(),
  };
  await db.collection<UserRecord>('users').insertOne(doc);
  return doc;
}

export async function saveOtp(record: OtpRecord) {
  await ensureIndexes();
  const db = await getDb();
  const normalized = record.email.trim().toLowerCase();
  await db.collection<OtpRecord>('otps').updateOne(
    { email: normalized },
    {
      $set: {
        email: normalized,
        otpHash: record.otpHash,
        expiresAt: record.expiresAt,
        attempts: 0,
      },
    },
    { upsert: true }
  );
}

export async function getOtp(email: string): Promise<OtpRecord | null> {
  await ensureIndexes();
  const db = await getDb();
  return db
    .collection<OtpRecord>('otps')
    .findOne({ email: email.trim().toLowerCase() });
}

export async function incrementOtpAttempts(email: string) {
  const db = await getDb();
  await db
    .collection<OtpRecord>('otps')
    .updateOne({ email: email.trim().toLowerCase() }, { $inc: { attempts: 1 } });
}

export async function deleteOtp(email: string) {
  const db = await getDb();
  await db
    .collection<OtpRecord>('otps')
    .deleteOne({ email: email.trim().toLowerCase() });
}

// Append to lib/db.ts

export interface OrderItemRecord {
  productId: string;
  slug: string;
  name: string;
  shortName: string;
  packSize: string;
  cocoaPercent: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
}

export interface ShippingAddressRecord {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderRecord {
  orderId: string;
  userId?: string;
  customerEmail: string;
  items: OrderItemRecord[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  couponCode: string | null;
  paymentMethod: 'demo_upi' | 'demo_card' | 'demo_cod';
  paymentStatus: 'paid_demo' | 'cod_confirmed';
  orderStatus: 'confirmed' | 'packed' | 'dispatched' | 'delivered';
  shippingAddress: ShippingAddressRecord;
  createdAt: string;
}

export async function createOrder(
  order: Omit<OrderRecord, 'orderId' | 'createdAt'>
): Promise<OrderRecord> {
  await ensureIndexes();
  const db = await getDb();

  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const orderId = `MLT-2026-${randomCode}`;

  const doc: OrderRecord = {
    ...order,
    orderId,
    customerEmail: order.customerEmail.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
  };

  await db.collection<OrderRecord>('orders').insertOne(doc);
  return doc;
}

export async function findOrderById(
  orderId: string
): Promise<OrderRecord | null> {
  await ensureIndexes();
  const db = await getDb();
  return db
    .collection<OrderRecord>('orders')
    .findOne({ orderId: orderId.trim() }, { projection: { _id: 0 } });
}

export async function findOrdersByEmail(
  email: string
): Promise<OrderRecord[]> {
  await ensureIndexes();
  const db = await getDb();
  return db
    .collection<OrderRecord>('orders')
    .find(
      { customerEmail: email.trim().toLowerCase() },
      { projection: { _id: 0 } }
    )
    .sort({ createdAt: -1 })
    .toArray();
}

// Append to lib/db.ts

export interface SavedDeliveryAddress {
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface UserProfileRecord {
  userId?: string;
  name: string;
  email: string;
  tasteMood?: string;
  defaultAddress?: SavedDeliveryAddress;
  hasCompletedSurvey?: boolean;
  createdAt?: string;
}

export async function findUserProfileByEmail(
  email: string
): Promise<UserProfileRecord | null> {
  await ensureIndexes();
  const db = await getDb();
  const user = await db.collection('users').findOne(
    { email: email.trim().toLowerCase() },
    { projection: { _id: 0, passwordHash: 0, password: 0 } }
  );
  return (user as UserProfileRecord | null) || null;
}

export async function updateUserProfileByEmail(
  email: string,
  updates: {
    name?: string;
    tasteMood?: string;
    defaultAddress?: SavedDeliveryAddress;
  }
): Promise<UserProfileRecord | null> {
  await ensureIndexes();
  const db = await getDb();
  const cleanEmail = email.trim().toLowerCase();

  const setFields: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };

  if (typeof updates.name === 'string' && updates.name.trim()) {
    setFields.name = updates.name.trim();
  }
  if (typeof updates.tasteMood === 'string') {
    setFields.tasteMood = updates.tasteMood.trim();
  }
  if (updates.defaultAddress) {
    setFields.defaultAddress = {
      phone: updates.defaultAddress.phone.trim(),
      line1: updates.defaultAddress.line1.trim(),
      city: updates.defaultAddress.city.trim(),
      state: updates.defaultAddress.state.trim() || 'Karnataka',
      pincode: updates.defaultAddress.pincode.trim(),
    };
  }

  await db
    .collection('users')
    .updateOne({ email: cleanEmail }, { $set: setFields });

  return findUserProfileByEmail(cleanEmail);
}