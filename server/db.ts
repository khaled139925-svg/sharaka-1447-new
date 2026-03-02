import { stores, products, offers, orders, orderItems, users, consultants, bookings } from '../drizzle/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { getDatabase } from './_core/database';

// ==================== المتاجر ====================

export async function getAllStores() {
  try {
    const db = getDatabase();
    return await db.select().from(stores).where(eq(stores.isActive, true));
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
}

export async function getStoreById(id: number) {
  try {
    const db = getDatabase();
    return await db.select().from(stores).where(eq(stores.id, id)).limit(1);
  } catch (error) {
    console.error('Error fetching store:', error);
    return [];
  }
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
  try {
    const db = getDatabase();
    const result = await db.insert(stores).values(data);
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Error creating store:', error);
    throw error;
  }
}

export async function updateStore(id: number, data: Partial<typeof data>) {
  try {
    const db = getDatabase();
    await db.update(stores).set(data).where(eq(stores.id, id));
    return { id, ...data };
  } catch (error) {
    console.error('Error updating store:', error);
    throw error;
  }
}

export async function deleteStore(id: number) {
  try {
    const db = getDatabase();
    await db.update(stores).set({ isActive: false }).where(eq(stores.id, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting store:', error);
    throw error;
  }
}

// ==================== المنتجات ====================

export async function getProductsByStore(storeId: number) {
  try {
    const db = getDatabase();
    return await db.select().from(products).where(
      and(eq(products.storeId, storeId), eq(products.isActive, true))
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: number) {
  try {
    const db = getDatabase();
    return await db.select().from(products).where(eq(products.id, id)).limit(1);
  } catch (error) {
    console.error('Error fetching product:', error);
    return [];
  }
}

export async function createProduct(data: {
  storeId: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  stock?: number;
}) {
  try {
    const db = getDatabase();
    const result = await db.insert(products).values(data);
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: number, data: Partial<typeof data>) {
  try {
    const db = getDatabase();
    await db.update(products).set(data).where(eq(products.id, id));
    return { id, ...data };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: number) {
  try {
    const db = getDatabase();
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// ==================== المستشارون ====================

export async function getAllConsultants() {
  try {
    const db = getDatabase();
    return await db.select().from(consultants).where(eq(consultants.isActive, true));
  } catch (error) {
    console.error('Error fetching consultants:', error);
    return [];
  }
}

export async function getConsultantById(id: number) {
  try {
    const db = getDatabase();
    const result = await db.select().from(consultants).where(eq(consultants.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching consultant:', error);
    return null;
  }
}

export async function createConsultant(data: {
  name: string;
  nameEn: string;
  specialty: string;
  specialtyEn: string;
  bio: string;
  bioEn: string;
  image: string;
  email: string;
  phone: string;
  zohoDuration?: number;
}) {
  try {
    const db = getDatabase();
    const result = await db.insert(consultants).values(data);
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Error creating consultant:', error);
    throw error;
  }
}

export async function updateConsultant(id: number, data: Partial<typeof data>) {
  try {
    const db = getDatabase();
    await db.update(consultants).set(data).where(eq(consultants.id, id));
    return { id, ...data };
  } catch (error) {
    console.error('Error updating consultant:', error);
    throw error;
  }
}

export async function deleteConsultant(id: number) {
  try {
    const db = getDatabase();
    await db.update(consultants).set({ isActive: false }).where(eq(consultants.id, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting consultant:', error);
    throw error;
  }
}

// ==================== الحجوزات ====================

export async function getBookings(filters?: { consultantId?: number; status?: string }) {
  try {
    const db = getDatabase();
    let query = db.select().from(bookings);
    
    if (filters?.consultantId) {
      query = query.where(eq(bookings.consultantId, filters.consultantId));
    }
    if (filters?.status) {
      query = query.where(eq(bookings.status, filters.status as any));
    }
    
    return await query.orderBy(desc(bookings.createdAt));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

export async function createBooking(data: {
  consultantId: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  subject: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
}) {
  try {
    const db = getDatabase();
    const result = await db.insert(bookings).values(data);
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function updateBookingStatus(id: number, status: string) {
  try {
    const db = getDatabase();
    await db.update(bookings).set({ status: status as any }).where(eq(bookings.id, id));
    return { id, status };
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
}

// ==================== الطلبات ====================

export async function getOrders(filters?: { userId?: number; storeId?: number; status?: string }) {
  try {
    const db = getDatabase();
    let query = db.select().from(orders);
    
    const conditions = [];
    if (filters?.userId) conditions.push(eq(orders.userId, filters.userId));
    if (filters?.storeId) conditions.push(eq(orders.storeId, filters.storeId));
    if (filters?.status) conditions.push(eq(orders.status, filters.status as any));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function createOrder(data: {
  userId: number;
  storeId: number;
  totalPrice: string;
  pointsEarned?: number;
}) {
  try {
    const db = getDatabase();
    const result = await db.insert(orders).values(data);
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function updateOrderStatus(id: number, status: string) {
  try {
    const db = getDatabase();
    await db.update(orders).set({ status: status as any }).where(eq(orders.id, id));
    return { id, status };
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

// ==================== النقاط والرصيد ====================

export async function getUserBalance(userId: number) {
  try {
    const db = getDatabase();
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user[0]) return { userId, points: 0, balance: '0' };
    return { userId, points: user[0].points || 0, balance: user[0].balance || '0' };
  } catch (error) {
    console.error('Error fetching user balance:', error);
    return { userId, points: 0, balance: '0' };
  }
}

export async function addPoints(userId: number, points: number) {
  try {
    const db = getDatabase();
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user[0]) return { userId, points: 0, success: false };
    
    const newPoints = (user[0].points || 0) + points;
    await db.update(users).set({ points: newPoints }).where(eq(users.id, userId));
    return { userId, points: newPoints, success: true };
  } catch (error) {
    console.error('Error adding points:', error);
    throw error;
  }
}

export async function deductBalance(userId: number, amount: number) {
  try {
    const db = getDatabase();
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user[0]) return { userId, amount, success: false };
    
    const currentBalance = parseFloat(user[0].balance || '0');
    const newBalance = currentBalance - amount;
    
    if (newBalance < 0) {
      throw new Error('Insufficient balance');
    }
    
    await db.update(users).set({ balance: newBalance.toString() }).where(eq(users.id, userId));
    return { userId, amount, success: true, newBalance };
  } catch (error) {
    console.error('Error deducting balance:', error);
    throw error;
  }
}
