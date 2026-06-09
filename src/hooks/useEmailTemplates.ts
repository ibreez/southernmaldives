import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { emailTemplateService } from '@/lib/apiService';
import { EmailTemplate } from '@/types/emailTemplate';

export function useEmailTemplates() {
  return useQuery<EmailTemplate[]>({
    queryKey: ['emailTemplates'],
    queryFn: () => emailTemplateService.getAll(),
    staleTime: 1000 * 60,
  });
}

export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, changes }: { key: string; changes: Partial<EmailTemplate> }) =>
      emailTemplateService.update(key, changes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success('Email template saved successfully');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to save email template';
      toast.error(message);
      throw error;
    },
  });
}

export function useSmtpTest() {
  return useMutation({
    mutationFn: (recipient?: string) => emailTemplateService.testSmtp(recipient),
    onSuccess: () => {
      toast.success('SMTP connection is valid');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'SMTP connection test failed';
      toast.error(message);
      throw error;
    },
  });
}
