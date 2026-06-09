/**
 * Zod validation schemas for the dining form
 * Ensures type-safe and validated dining data
 */

import { z } from 'zod';

// Schedule validation schema
const ScheduleSchema = z.object({
  label: z
    .string()
    .min(1, 'Label is required')
    .max(50, 'Label must be less than 50 characters'),
  start: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format'),
  end: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format'),
});

// Restaurant validation schema
export const RestaurantSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(2, 'Restaurant name must be at least 2 characters')
    .max(100, 'Restaurant name must be less than 100 characters'),
  type: z.enum(['Signature Dining', 'Casual', 'Bar', 'Café'], {
    errorMap: () => ({ message: 'Please select a valid restaurant type' }),
  }),
  cuisine: z
    .string()
    .min(2, 'Cuisine must be at least 2 characters')
    .max(100, 'Cuisine must be less than 100 characters'),
  images: z
    .array(z.string().url('Invalid image URL').optional().or(z.literal('')))
    .optional()
    .default([]),
  schedules: z
    .array(ScheduleSchema)
    .min(1, 'At least one schedule is required'),
  menu_link: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

// Breakfast type validation schema
export const BreakfastTypeSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(2, 'Breakfast type name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  items: z
    .array(z.string().min(1, 'Item cannot be empty'))
    .min(1, 'At least one item is required'),
  included_in_room_rate: z.boolean().optional(),
});

// Bar info validation schema
export const BarInfoSchema = z.object({
  id: z.string().uuid().optional(),
  section_label: z
    .string()
    .max(50, 'Section label must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  name: z
    .string()
    .min(2, 'Bar name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  hours: z
    .string()
    .min(5, 'Hours must be in format HH:MM - HH:MM')
    .max(50, 'Hours format invalid')
    .optional()
    .or(z.literal('')),
  specialties: z
    .string()
    .max(500, 'Specialties must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  room_service_available: z.boolean().optional(),
});

// Main dining form validation schema
export const DiningFormSchema = z.object({
  main_description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  hero_image_url: z
    .string()
    .url('Invalid image URL')
    .optional()
    .or(z.literal('')),
  section_label: z.string().max(50).optional().or(z.literal('')),
  heading_main: z.string().max(50).optional().or(z.literal('')),
  heading_italic: z.string().max(50).optional().or(z.literal('')),
  restaurants: z
    .array(RestaurantSchema)
    .min(1, 'At least one restaurant is required')
    .max(10, 'Maximum 10 restaurants allowed'),
  breakfast_types: z
    .array(BreakfastTypeSchema)
    .max(5, 'Maximum 5 breakfast types allowed')
    .optional()
    .default([]),
  bar_info: BarInfoSchema
    .optional()
    .or(z.literal({}))
    .default({}),
});

// Type inference from schemas
export type Restaurant = z.infer<typeof RestaurantSchema>;
export type RestaurantSchedule = z.infer<typeof ScheduleSchema>;
export type BreakfastType = z.infer<typeof BreakfastTypeSchema>;
export type BarInfo = z.infer<typeof BarInfoSchema>;
export type DiningFormData = z.infer<typeof DiningFormSchema>;

/**
 * Validate dining form data
 * @param data - The data to validate
 * @returns Validation result with either data or errors
 */
export function validateDiningForm(data: unknown) {
  return DiningFormSchema.safeParse(data);
}

/**
 * Validate a single restaurant
 * @param data - The restaurant data to validate
 * @returns Validation result
 */
export function validateRestaurant(data: unknown) {
  return RestaurantSchema.safeParse(data);
}

/**
 * Get formatted validation errors as a string
 * @param errors - Zod validation errors
 * @returns Formatted error message
 */
export function getFormattedErrors(
  errors: z.ZodError
): Record<string, string> {
  const formatted: Record<string, string> = {};

  errors.errors.forEach((error) => {
    const path = error.path.join('.');
    formatted[path] = error.message;
  });

  return formatted;
}