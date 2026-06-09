import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packageService } from '@/lib/apiService';
import { TravelPackage } from '@/types/package';
import { toast } from 'sonner';
import { ErrorResponse } from '@/types/auth';

export function usePackagesAdmin() {
  return useQuery<TravelPackage[], Error>({
    queryKey: ['packages'],
    queryFn: async () => {
      try {
        return await packageService.getAll();
      } catch (error: unknown) {
        if ((error as ErrorResponse)?.code === 'PGRST301' ||
            (error as Error).message?.includes('401') ||
            (error as Error).message?.includes('unauthorized')) {
          throw new Error('Authentication required. Please log in to access packages.');
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

export function useCreatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pkg: Omit<TravelPackage, 'id' | 'created_at'>) => packageService.create(pkg),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'packages' });
      toast.success('Package created successfully');
    },
    onError: () => {
      toast.error('Failed to create package');
    },
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, pkg }: { id: string; pkg: Partial<TravelPackage> }) => packageService.update(id, pkg),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'packages' });
      toast.success('Package updated successfully');
    },
    onError: () => {
      toast.error('Failed to update package');
    },
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => packageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'packages' });
      toast.success('Package deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete package');
    },
  });
}
