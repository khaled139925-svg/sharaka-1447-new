import { router, publicProcedure, protectedProcedure } from './_core/trpc';
import { z } from 'zod';
import * as db from './db';

export const appRouter = router({
  // ==================== المستخدمون والتسجيل ====================
  auth: router({
    registerClient: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(10),
        password: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
        return await db.registerClient(input);
      }),

    registerConsultant: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(10),
        password: z.string().min(6),
        specialization: z.string().min(3),
        yearsOfExperience: z.number().min(0),
        bio: z.string().min(10),
        hourlyRate: z.number().min(1),
      }))
      .mutation(async ({ input }) => {
        return await db.registerConsultant(input);
      }),

    getUserByEmail: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        return await db.getUserByEmail(input.email);
      }),
  }),

  // ==================== المستشارون ====================
  consultants: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllConsultantProfiles();
    }),

    getProfile: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await db.getConsultantProfile(input.userId);
      }),

    updateProfile: protectedProcedure
      .input(z.object({
        specialization: z.string().optional(),
        yearsOfExperience: z.number().optional(),
        bio: z.string().optional(),
        hourlyRate: z.number().optional(),
        profileImage: z.string().optional(),
        isAvailable: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.updateConsultantProfile(ctx.user.id, input);
      }),
  }),

  // ==================== الجلسات ====================
  sessions: router({
    create: protectedProcedure
      .input(z.object({
        consultantId: z.number(),
        title: z.string().min(3),
        description: z.string().optional(),
        scheduledDate: z.date(),
        duration: z.number().min(15),
        meetingType: z.enum(['zoom', 'google_meet', 'teams', 'phone']),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createSession({
          ...input,
          clientId: ctx.user.id,
        });
      }),

    getByConsultant: protectedProcedure.query(async ({ ctx }) => {
      return await db.getSessionsByConsultant(ctx.user.id);
    }),

    getByClient: protectedProcedure.query(async ({ ctx }) => {
      return await db.getSessionsByClient(ctx.user.id);
    }),

    updateStatus: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
      }))
      .mutation(async ({ input }) => {
        return await db.updateSessionStatus(input.sessionId, input.status);
      }),
  }),

  // ==================== الدفعات ====================
  payments: router({
    create: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        consultantId: z.number(),
        amount: z.number().min(1),
        currency: z.string().optional(),
        stripePaymentId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createPayment({
          ...input,
          clientId: ctx.user.id,
        });
      }),

    getByClient: protectedProcedure.query(async ({ ctx }) => {
      return await db.getPaymentsByClient(ctx.user.id);
    }),

    updateStatus: protectedProcedure
      .input(z.object({
        paymentId: z.number(),
        status: z.enum(['pending', 'completed', 'failed', 'refunded']),
      }))
      .mutation(async ({ input }) => {
        return await db.updatePaymentStatus(input.paymentId, input.status);
      }),
  }),

  // ==================== التقييمات ====================
  reviews: router({
    create: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        consultantId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createReview({
          ...input,
          clientId: ctx.user.id,
        });
      }),

    getByConsultant: publicProcedure
      .input(z.object({ consultantId: z.number() }))
      .query(async ({ input }) => {
        return await db.getReviewsByConsultant(input.consultantId);
      }),
  }),

  // ==================== المتاجر ====================
  stores: router({
    getAll: publicProcedure.query(async () => {
      const result = await db.getAllStores();
      return result || [];
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const result = await db.getStoreById(input.id);
        return result?.[0] || null;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        nameEn: z.string(),
        description: z.string(),
        descriptionEn: z.string(),
        category: z.string(),
        categoryEn: z.string(),
        image: z.string(),
        ownerName: z.string(),
        ownerEmail: z.string(),
        ownerPhone: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.createStore(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          image: z.string().optional(),
          rating: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return await db.updateStore(input.id, input.data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteStore(input.id);
      }),
  }),

  // ==================== المنتجات ====================
  products: router({
    getByStore: publicProcedure
      .input(z.object({ storeId: z.number() }))
      .query(async ({ input }) => {
        const result = await db.getProductsByStore(input.storeId);
        return result || [];
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const result = await db.getProductById(input.id);
        return result?.[0] || null;
      }),

    create: protectedProcedure
      .input(z.object({
        storeId: z.number(),
        name: z.string(),
        description: z.string(),
        price: z.string(),
        image: z.string(),
        category: z.string(),
        stock: z.number(),
      }))
      .mutation(async ({ input }) => {
        return await db.createProduct(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.string().optional(),
          image: z.string().optional(),
          stock: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return await db.updateProduct(input.id, input.data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteProduct(input.id);
      }),
  }),

  // ==================== المستشارون (القديم) ====================
  consultantsList: router({
    getAll: publicProcedure.query(async () => {
      const result = await db.getAllConsultants();
      return result || [];
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getConsultantById(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        nameEn: z.string(),
        specialty: z.string(),
        specialtyEn: z.string(),
        bio: z.string(),
        bioEn: z.string(),
        image: z.string(),
        email: z.string(),
        phone: z.string(),
        zohoDuration: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createConsultant(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          specialty: z.string().optional(),
          bio: z.string().optional(),
          image: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return await db.updateConsultant(input.id, input.data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteConsultant(input.id);
      }),
  }),

  // ==================== الحجوزات ====================
  bookings: router({
    getAll: publicProcedure
      .input(z.object({
        consultantId: z.number().optional(),
        status: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getBookings(input);
      }),

    create: publicProcedure
      .input(z.object({
        consultantId: z.number(),
        clientName: z.string(),
        clientEmail: z.string(),
        clientPhone: z.string(),
        subject: z.string(),
        bookingDate: z.string(),
        bookingTime: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createBooking(input);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateBookingStatus(input.id, input.status);
      }),
  }),

  // ==================== الطلبات ====================
  orders: router({
    getAll: protectedProcedure
      .input(z.object({
        storeId: z.number().optional(),
        status: z.string().optional(),
      }))
      .query(async ({ input, ctx }) => {
        return await db.getOrders({
          userId: ctx.user.id,
          storeId: input.storeId,
          status: input.status,
        });
      }),

    create: protectedProcedure
      .input(z.object({
        storeId: z.number(),
        totalPrice: z.string(),
        pointsEarned: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createOrder({
          userId: ctx.user.id,
          storeId: input.storeId,
          totalPrice: input.totalPrice,
          pointsEarned: input.pointsEarned,
        });
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'processing', 'completed', 'cancelled']),
      }))
      .mutation(async ({ input }) => {
        return await db.updateOrderStatus(input.id, input.status);
      }),
  }),
});

export type AppRouter = typeof appRouter;
