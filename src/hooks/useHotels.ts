import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelService } from '@/lib/hotelService';
import type { Hotel } from '@/types/hotel';
import { toast } from 'sonner';
import { ErrorResponse } from '@/types/auth';

export function useHotels() {
  return useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      try {
        return await hotelService.getAllHotels();
      } catch (error: unknown) {
        // Check if it's an authentication error
        if ((error as ErrorResponse)?.code === 'PGRST301' ||
            (error as Error).message?.includes('401') ||
            (error as Error).message?.includes('unauthorized')) {
          throw new Error('Authentication required. Please log in to access hotels.');
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

export function useHotel(id: string) {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelService.getHotelById(id),
    enabled: !!id,
  });
}

export function useDetailedHotel(id: string) {
  return useQuery({
    queryKey: ['hotel', 'detailed', id],
    queryFn: () => hotelService.getHotelDetails(id),
    enabled: !!id,
  });
}

export function useCreateDetailedHotel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (hotel: Partial<Hotel>) => hotelService.createDetailedHotel(hotel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hotel created successfully');
    },
    onError: (e) => {
      console.error(e)
      toast.error('Failed to create hotel');
    },
  });
}

export function useUpdateHotel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, hotel }: { id: string; hotel: Partial<Hotel> }) =>
      hotelService.updateHotel(id, hotel),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotel', (data as Hotel).id] });
      queryClient.invalidateQueries({ queryKey: ['hotel', 'detailed', (data as Hotel).id] });
      toast.success('Hotel updated successfully');
    },
    onError: (e) => {
      console.error('Update error:', e)
      toast.error('Failed to update hotel');
    },
  });
}

export function useUpdateDetailedHotel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, hotel }: { id: string; hotel: Partial<Hotel> }) =>
      hotelService.updateDetailedHotel(id, hotel),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotel', 'detailed', data.id] });
      toast.success('Hotel updated successfully');
    },
    onError: (e) => {
      console.error('Detailed update error:', e)
      toast.error('Failed to update hotel');
    },
  });
}

export function useDeleteHotel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => hotelService.deleteHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hotel deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete hotel');
    },
  });
}
