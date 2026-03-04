import { mysqlTable, varchar, text, int, decimal, boolean, timestamp, mysqlEnum, datetime } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// جدول المستخدمين (موحد لجميع الأنواع)
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  password: varchar('password', { length: 500 }),
  userType: mysqlEnum('user_type', ['client', 'consultant', 'admin']).default('client'),
  points: int('points').default(0),
  balance: decimal('balance', { precision: 10, scale: 2 }).default('0'),
  role: mysqlEnum('role', ['user', 'admin']).default('user'),
  isActive: boolean('is_active').default(true),
  isVerified: boolean('is_verified').default(false),
  verificationToken: varchar('verification_token', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// جدول بيانات المستشارين الموسعة
export const consultantProfiles = mysqlTable('consultant_profiles', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  specialization: varchar('specialization', { length: 255 }).notNull(),
  specialization_en: varchar('specialization_en', { length: 255 }),
  yearsOfExperience: int('years_of_experience').notNull(),
  bio: text('bio').notNull(),
  bio_en: text('bio_en'),
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }).notNull(),
  profileImage: varchar('profile_image', { length: 500 }),
  certifications: text('certifications'), // JSON array
  languages: varchar('languages', { length: 255 }), // JSON array
  rating: decimal('rating', { precision: 3, scale: 1 }).default('0'),
  totalSessions: int('total_sessions').default(0),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// جدول الجلسات المحجوزة
export const sessions = mysqlTable('sessions', {
  id: int('id').primaryKey().autoincrement(),
  consultantId: int('consultant_id').notNull(),
  clientId: int('client_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  scheduledDate: datetime('scheduled_date').notNull(),
  duration: int('duration').notNull(), // بالدقائق
  status: mysqlEnum('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).default('pending'),
  meetingType: mysqlEnum('meeting_type', ['zoom', 'google_meet', 'teams', 'phone']).default('zoom'),
  meetingLink: varchar('meeting_link', { length: 500 }),
  recordingUrl: varchar('recording_url', { length: 500 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// جدول الدفعات
export const payments = mysqlTable('payments', {
  id: int('id').primaryKey().autoincrement(),
  sessionId: int('session_id').notNull(),
  clientId: int('client_id').notNull(),
  consultantId: int('consultant_id').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('SAR'),
  status: mysqlEnum('status', ['pending', 'completed', 'failed', 'refunded']).default('pending'),
  stripePaymentId: varchar('stripe_payment_id', { length: 255 }),
  invoiceNumber: varchar('invoice_number', { length: 50 }),
  paymentMethod: varchar('payment_method', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// جدول التقييمات
export const reviews = mysqlTable('reviews', {
  id: int('id').primaryKey().autoincrement(),
  sessionId: int('session_id').notNull(),
  consultantId: int('consultant_id').notNull(),
  clientId: int('client_id').notNull(),
  rating: int('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

// جدول الإشعارات
export const notifications = mysqlTable('notifications', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // booking, payment, session, etc
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// جدول المستشارين (القديم - للتوافقية)
export const consultants = mysqlTable('consultants', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }).notNull(),
  specialty: varchar('specialty', { length: 255 }).notNull(),
  specialtyEn: varchar('specialty_en', { length: 255 }).notNull(),
  bio: text('bio').notNull(),
  bioEn: text('bio_en').notNull(),
  image: varchar('image', { length: 500 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  zohoDuration: int('zoho_duration').default(60),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// جدول الحجوزات (القديم - للتوافقية)
export const bookings = mysqlTable('bookings', {
  id: int('id').primaryKey().autoincrement(),
  consultantId: int('consultant_id').notNull(),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  clientEmail: varchar('client_email', { length: 255 }).notNull(),
  clientPhone: varchar('client_phone', { length: 20 }).notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  bookingDate: varchar('booking_date', { length: 50 }).notNull(),
  bookingTime: varchar('booking_time', { length: 20 }).notNull(),
  status: mysqlEnum('status', ['pending', 'confirmed', 'completed', 'cancelled']).default('pending'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// جدول المتاجر
export const stores = mysqlTable('stores', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }).notNull(),
  description: text('description').notNull(),
  descriptionEn: text('description_en').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  categoryEn: varchar('category_en', { length: 100 }).notNull(),
  image: varchar('image', { length: 500 }).notNull(),
  ownerName: varchar('owner_name', { length: 255 }).notNull(),
  ownerEmail: varchar('owner_email', { length: 255 }).notNull(),
  ownerPhone: varchar('owner_phone', { length: 20 }).notNull(),
  rating: decimal('rating', { precision: 3, scale: 1 }).default('0'),
  reviewCount: int('review_count').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// جدول المنتجات
export const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  storeId: int('store_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  image: varchar('image', { length: 500 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  stock: int('stock').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// جدول العروض والخصومات
export const offers = mysqlTable('offers', {
  id: int('id').primaryKey().autoincrement(),
  storeId: int('store_id').notNull(),
  productId: int('product_id'),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  discountType: mysqlEnum('discount_type', ['percentage', 'fixed']).default('percentage'),
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// جدول تفاصيل الطلبات
export const orderItems = mysqlTable('order_items', {
  id: int('id').primaryKey().autoincrement(),
  orderId: int('order_id').notNull(),
  productId: int('product_id').notNull(),
  quantity: int('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// جدول الطلبات
export const orders = mysqlTable('orders', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  storeId: int('store_id').notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  pointsEarned: int('points_earned').default(0),
  status: mysqlEnum('status', ['pending', 'processing', 'completed', 'cancelled']).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// جدول رسائل التواصل
export const contactMessages = mysqlTable('contact_messages', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  message: text('message').notNull(),
  status: mysqlEnum('status', ['new', 'read', 'replied']).default('new'),
  createdAt: timestamp('created_at').defaultNow(),
});

// العلاقات
export const consultantProfilesRelations = relations(consultantProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [consultantProfiles.userId],
    references: [users.id],
  }),
  sessions: many(sessions),
  reviews: many(reviews),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  consultant: one(consultantProfiles, {
    fields: [sessions.consultantId],
    references: [consultantProfiles.id],
  }),
  client: one(users, {
    fields: [sessions.clientId],
    references: [users.id],
  }),
  payment: one(payments, {
    fields: [sessions.id],
    references: [payments.sessionId],
  }),
  reviews: many(reviews),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  session: one(sessions, {
    fields: [payments.sessionId],
    references: [sessions.id],
  }),
  client: one(users, {
    fields: [payments.clientId],
    references: [users.id],
  }),
  consultant: one(consultantProfiles, {
    fields: [payments.consultantId],
    references: [consultantProfiles.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  session: one(sessions, {
    fields: [reviews.sessionId],
    references: [sessions.id],
  }),
  consultant: one(consultantProfiles, {
    fields: [reviews.consultantId],
    references: [consultantProfiles.id],
  }),
  client: one(users, {
    fields: [reviews.clientId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  consultantProfile: many(consultantProfiles),
  sessionsAsClient: many(sessions),
  notifications: many(notifications),
}));

export const consultantsRelations = relations(consultants, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  consultant: one(consultants, {
    fields: [bookings.consultantId],
    references: [consultants.id],
  }),
}));

export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
  orders: many(orders),
}));

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  items: many(orderItems),
}));

export const offersRelations = relations(offers, ({ one }) => ({
  store: one(stores, {
    fields: [offers.storeId],
    references: [stores.id],
  }),
  product: one(products, {
    fields: [offers.productId],
    references: [products.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
