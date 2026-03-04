import { router, publicProcedure, protectedProcedure, adminProcedure } from './_core/trpc';
import { z } from 'zod';
import * as db from './db';

export const appRouter = router({
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

  // ==================== العروض ====================
  offers: router({
    getByStore: publicProcedure
      .input(z.object({ storeId: z.number() }))
      .query(async ({ input }) => {
        const result = await db.getStoreOffers(input.storeId);
        return result || [];
      }),

    create: protectedProcedure
      .input(z.object({
        storeId: z.number(),
        productId: z.number().optional(),
        title: z.string(),
        description: z.string().optional(),
        discountType: z.enum(['percentage', 'fixed']),
        discountValue: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      }))
      .mutation(async ({ input }) => {
        return await db.createOffer(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          discountValue: z.string().optional(),
          endDate: z.date().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return await db.updateOffer(input.id, input.data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteOffer(input.id);
      }),
  }),

  // ==================== الطلبات ====================
  orders: router({
    getByUser: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) return [];
      const result = await db.getUserOrders(ctx.user.id);
      return result || [];
    }),

    getByStore: protectedProcedure
      .input(z.object({ storeId: z.number() }))
      .query(async ({ input }) => {
        const result = await db.getStoreOrders(input.storeId);
        return result || [];
      }),

    create: protectedProcedure
      .input(z.object({
        storeId: z.number(),
        totalPrice: z.string(),
        pointsEarned: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) throw new Error('Unauthorized');
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
