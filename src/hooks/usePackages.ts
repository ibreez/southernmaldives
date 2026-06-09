import { useQuery } from '@tanstack/react-query';
import { getPackages } from '@/hooks/packages';
import type { TravelPackage } from '@/types/package';

export function usePackages() {
  return useQuery<TravelPackage[], Error>({
    queryKey: ['packages'],
    queryFn: getPackages,
    retry: (failureCount) => failureCount < 2,
    staleTime: 1000 * 60 * 3,
  });
}
