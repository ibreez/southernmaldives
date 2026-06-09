import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instagramFeedService } from '@/lib/apiService';
import { InstagramFeed } from '@/types/instagramFeed';
import { toast } from 'sonner';
import { ErrorResponse } from '@/types/auth';

export function useInstagramFeeds() {
  return useQuery({
    queryKey: ['instagram-feeds'],
    queryFn: async () => {
      try {
        return await instagramFeedService.getAll();
      } catch (error: unknown) {
        if ((error as ErrorResponse)?.code === 'PGRST301' ||
            (error as Error)?.message?.includes('401') ||
            (error as Error)?.message?.includes('unauthorized')) {
          throw new Error('Authentication required. Please log in to access Instagram feeds.');
        }
        throw error;
      }
    },
    retry: (failureCount, error: unknown) => {
      if ((error as Error)?.message?.includes('Authentication required')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useActiveInstagramFeeds() {
  return useQuery({
    queryKey: ['instagram-feeds', 'active'],
    queryFn: async () => {
      try {
        return await instagramFeedService.getActive();
      } catch (error: unknown) {
        if ((error as ErrorResponse)?.code === 'PGRST301' ||
            (error as Error)?.message?.includes('401') ||
            (error as Error)?.message?.includes('unauthorized')) {
          throw new Error('Authentication required. Please log in to access Instagram feeds.');
        }
        throw error;
      }
    },
    retry: (failureCount, error: unknown) => {
      if ((error as Error)?.message?.includes('Authentication required')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useCreateInstagramFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feed: Omit<InstagramFeed, 'id' | 'created_at'>) =>
      instagramFeedService.create(feed),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'instagram-feeds' });
      toast.success('Instagram post added successfully');
    },
    onError: () => {
      toast.error('Failed to add Instagram post');
    },
  });
}

export function useUpdateInstagramFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, feed }: { id: string; feed: Partial<InstagramFeed> }) =>
      instagramFeedService.update(id, feed),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'instagram-feeds' });
      toast.success('Instagram post updated successfully');
    },
    onError: () => {
      toast.error('Failed to update Instagram post');
    },
  });
}

export function useDeleteInstagramFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => instagramFeedService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'instagram-feeds' });
      toast.success('Instagram post deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete Instagram post');
    },
  });
}

export function useReorderInstagramFeeds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: { id: string; display_order: number }[]) =>
      instagramFeedService.reorder(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'instagram-feeds' });
      toast.success('Instagram posts reordered successfully');
    },
    onError: () => {
      toast.error('Failed to reorder Instagram posts');
    },
  });
}