import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enquiryService } from '@/lib/apiService';
import { Enquiry } from '@/types/enquiry';
import { toast } from 'sonner';
import { ErrorResponse } from '@/types/auth';

export function useEnquiries() {
  return useQuery({
    queryKey: ['enquiries'],
    queryFn: async () => {
      try {
        return await enquiryService.getAll();
      } catch (error: unknown) {
        // Check if it's an authentication error
        if ((error as ErrorResponse)?.code === 'PGRST301' ||
            (error as Error).message?.includes('401') ||
            (error as Error).message?.includes('unauthorized')) {
          throw new Error('Authentication required. Please log in to access enquiries.');
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

export function useCreateEnquiry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (enquiry: Omit<Enquiry, 'id' | 'created_at' | 'status'>) => {
      // Create the enquiry on the server; server will handle email notifications
      const createdEnquiry = await enquiryService.create(enquiry);
      return createdEnquiry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiry submitted successfully! We will contact you soon.');
    },
    onError: () => {
      toast.error('Failed to submit enquiry. Please try again.');
    },
  });
}

export function useUpdateEnquiryStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'new' | 'replied' }) =>
      enquiryService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiry status updated');
    },
    onError: () => {
      toast.error('Failed to update enquiry status');
    },
  });
}

export function useDeleteEnquiry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => enquiryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiry records cleared');
    },
    onError: () => {
      toast.error('Failed to delete enquiry');
    },
  });
}