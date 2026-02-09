import { z } from 'zod';

export const appSchema = z.object({
  name: z.string().min(2),
  url: z.string().url(),
  description: z.string().min(3),
  iconUrl: z.string().url().optional().or(z.literal('')),
  categoryId: z.string().optional().or(z.literal('')),
  tags: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  sortOrder: z.coerce.number().int().min(0),
});

export const settingSchema = z.object({
  portalName: z.string().min(2),
  logoUrl: z.string().url().optional().or(z.literal('')),
});

export const signupSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/\d/, 'Password must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
