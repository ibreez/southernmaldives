import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialService } from '@/lib/apiService';
import { Testimonial } from '@/types/testimonial';
import { toast } from 'sonner';
import { ErrorResponse } from '@/types/auth';

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      try {
        return await testimonialService.getAll();
      } catch (error: unknown) {
        if ((error as ErrorResponse)?.code === 'PGRST301' ||
            (error as Error).message?.includes('401') ||
            (error as Error).message?.includes('unauthorized')) {
          throw new Error('Authentication required. Please log in to access testimonials.');
        }
        throw error;
      }
    },
    retry: (failureCount, error: unknown) => {
      if ((error as Error).message?.includes('Authentication required')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useTestimonialsAdmin() {
  return useQuery({
    queryKey: ['testimonials', 'admin'],
    queryFn: async () => {
      try {
        return await testimonialService.getAll(true);
      } catch (error: unknown) {
        if ((error as ErrorResponse)?.code === 'PGRST301' ||
            (error as Error).message?.includes('401') ||
            (error as Error).message?.includes('unauthorized')) {
          throw new Error('Authentication required. Please log in to access testimonials.');
        }
        throw error;
      }
    },
    retry: (failureCount, error: unknown) => {
      if ((error as Error).message?.includes('Authentication required')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testimonial: Omit<Testimonial, 'id' | 'created_at'>) => testimonialService.create(testimonial),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'testimonials' });
      toast.success('Testimonial added successfully');
    },
    onError: () => {
      toast.error('Failed to add testimonial');
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, testimonial }: { id: string; testimonial: Partial<Testimonial> }) =>
      testimonialService.update(id, testimonial),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'testimonials' });
      toast.success('Testimonial updated successfully');
    },
    onError: () => {
      toast.error('Failed to update testimonial');
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => testimonialService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'testimonials' });
      toast.success('Testimonial deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete testimonial');
    },
  });
}
