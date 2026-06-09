import { useEnquiryModalStore } from '@/stores/enquiryModalStore';
import ConciergeStepper from './ConciergeStepper';

export default function EnquiryModal() {
  const { isOpen, hotel, close } = useEnquiryModalStore();

  return (
    <ConciergeStepper
      isOpen={isOpen}
      onClose={close}
      preselectedHotel={hotel}
    />
  );
}