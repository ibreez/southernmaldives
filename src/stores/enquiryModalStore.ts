import { create } from 'zustand';
import { Hotel } from '@/types/hotel';

interface EnquiryModalState {
  isOpen: boolean;
  hotel: Hotel | null;
  open: (hotel?: Hotel | null) => void;
  close: () => void;
}

export const useEnquiryModalStore = create<EnquiryModalState>((set) => ({
  isOpen: false,
  hotel: null,
  open: (hotel = null) => set({ isOpen: true, hotel }),
  close: () => set({ isOpen: false, hotel: null }),
}));
