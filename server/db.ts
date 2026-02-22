import { db as drizzleDb } from './_core/index';
import { stores, products, offers, orders, orderItems, users } from '../drizzle/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

// ==================== المتاجر ====================

export async function getAllStores() {
  return await drizzleDb.select().from(stores).where(eq(stores.isActive, true));
}

export async function getStoreById(id: number) {
  return await drizzleDb.select().from(stores).where(eq(stores.id, id)).limit(1);
}

export async function createStore(data: {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  categoryEn: string;
  image: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}) {
  return await drizzleDb.insert(stores).values(data);
}

export async function updateStore(id: number, data: Partial<typeof data>) {
  return await drizzleDb.update(stores).set(data).where(eq(stores.id, id));
}

export async function deleteStore(id: number) {
  return await drizzleDb.update(stores).set({ isActive: false }).where(eq(stores.id, id));
}

// ==================== المنتجات ====================

export async function getStoreProducts(storeId: number) {
  return await drizzleDb.select().from(products).where(
    and(eq(products.storeId, storeId), eq(products.isActive, true))
  );
}

export async function getProductById(id: number) {
  return await drizzleDb.select().from(products).where(eq(products.id, id)).limit(1);
}

export async function createProduct(data: {
  storeId: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  stock: number;
}) {
  return await drizzleDb.insert(products).values(data);
}

export async function updateProduct(id: number, data: Partial<typeof data>) {
  return await drizzleDb.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  return await drizzleDb.update(products).set({ isActive: false }).where(eq(products.id, id));
}

// ==================== العروض ====================

export async function getStoreOffers(storeId: number) {
  const now = new Date();
  return await drizzleDb.select().from(offers).where(
    and(
      eq(offers.storeId, storeId),
      eq(offers.isActive, true),
      lte(offers.startDate, now),
      gte(offers.endDate, now)
    )
  );
}

export async function createOffer(data: {
  storeId: number;
  productId?: number;
  title: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: string;
  startDate: Date;
  endDate: Date;
}) {
  return await drizzleDb.insert(offers).values(data);
}

export async function updateOffer(id: number, data: Partial<typeof data>) {
  return await drizzleDb.update(offers).set(data).where(eq(offers.id, id));
}

export async function deleteOffer(id: number) {
  return await drizzleDb.update(offers).set({ isActive: false }).where(eq(offers.id, id));
}

// ==================== الطلبات ====================

export async function getUserOrders(userId: number) {
  return await drizzleDb.select().from(orders).where(eq(orders.userId, userId));
}

export async function getStoreOrders(storeId: number) {
  return await drizzleDb.select().from(orders).where(eq(orders.storeId, storeId));
}

export async function createOrder(data: {
  userId: number;
  storeId: number;
  totalPrice: string;
  pointsEarned: number;
}) {
  return await drizzleDb.insert(orders).values(data);
}

export async function updateOrderStatus(id: number, status: 'pending' | 'processing' | 'completed' | 'cancelled') {
  return await drizzleDb.update(orders).set({ status }).where(eq(orders.id, id));
}

// ==================== تفاصيل الطلبات ====================

export async function getOrderItems(orderId: number) {
  return await drizzleDb.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function createOrderItem(data: {
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}) {
  return await drizzleDb.insert(orderItems).values(data);
}

// ==================== المستخدمين ====================

export async function getUserByEmail(email: string) {
  return await drizzleDb.select().from(users).where(eq(users.email, email)).limit(1);
}

export async function getUserById(id: number) {
  return await drizzleDb.select().from(users).where(eq(users.id, id)).limit(1);
}

export async function createUser(data: {
  name: string;
  email: string;
  phone: string;
}) {
  return await drizzleDb.insert(users).values(data);
}

export async function updateUserBalance(id: number, balance: string) {
  return await drizzleDb.update(users).set({ balance }).where(eq(users.id, id));
}

export async function updateUserPoints(id: number, points: number) {
  return await drizzleDb.update(users).set({ points }).where(eq(users.id, id));
}
