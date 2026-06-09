import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SiteSettingsState {
  showInstagramSection: boolean;
  whatsappNumber: string;
  setShowInstagramSection: (show: boolean) => void;
  setWhatsappNumber: (number: string) => void;
}

export const useSiteSettingsStore = create<SiteSettingsState>()(
  persist(
    (set) => ({
      showInstagramSection: true,
      whatsappNumber: '+960 9495654',
      setShowInstagramSection: (show) => set({ showInstagramSection: show }),
      setWhatsappNumber: (number) => set({ whatsappNumber: number }),
    }),
    {
      name: 'site-settings-storage',
    }
  )
);