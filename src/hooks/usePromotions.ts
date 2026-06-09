import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promotionService } from '@/lib/apiService';
import { Promotion } from '@/types/promotion';
import { toast } from 'sonner';
import { ErrorResponse } from '@/types/auth';

export function usePromotions() {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      try {
        return await promotionService.getAll();
      } catch (error: unknown) {
        // Check if it's an authentication error
        if ((error as ErrorResponse)?.code === 'PGRST301' ||
            (error as Error).message?.includes('401') ||
            (error as Error).message?.includes('unauthorized')) {
          throw new Error('Authentication required. Please log in to access promotions.');
        }
        throw error;
      }
    },
    retry: (failureCount, error: unknown) => {
      // Don't retry authentication errors
      if ((error as Error).message?.includes('Authentication required')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useActivePromotions() {
  return useQuery({
    queryKey: ['promotions', 'active'],
    queryFn: async () => {
      try {
        return await promotionService.getActive();
      } catch (error: unknown) {
        // Check if it's an authentication error
        if ((error as ErrorResponse)?.code === 'PGRST301' ||
            (error as Error).message?.includes('401') ||
            (error as Error).message?.includes('unauthorized')) {
          throw new Error('Authentication required. Please log in to access promotions.');
        }
        throw error;
      }
    },
    retry: (failureCount, error: unknown) => {
      // Don't retry authentication errors
      if ((error as Error).message?.includes('Authentication required')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promotion: Omit<Promotion, 'id' | 'created_at'>) =>
      promotionService.create(promotion),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'promotions' });
      toast.success('Promotion created successfully');
    },
    onError: () => {
      toast.error('Failed to create promotion');
    },
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, promotion }: { id: string; promotion: Partial<Promotion> }) =>
      promotionService.update(id, promotion),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'promotions' });
      toast.success('Promotion updated successfully');
    },
    onError: () => {
      toast.error('Failed to update promotion');
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promotionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'promotions' });
      toast.success('Promotion deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete promotion');
    },
  });
}