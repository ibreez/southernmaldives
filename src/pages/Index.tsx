import { useEnquiryModalStore } from '@/stores/enquiryModalStore';
import { useSiteSettingsStore } from '@/stores/siteSettingsStore';
import { Hotel } from '@/types/hotel';
import { useHotels } from '@/hooks/useHotels';
import { useActivePromotions } from '@/hooks/usePromotions';
import { useTestimonials } from '@/hooks/useTestimonials';
import HeroSection from '@/components/sections/HeroSection';
import EmeraldEdge from '@/components/sections/EmeraldEdge';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import FeaturedHotels from '@/components/sections/FeaturedHotels';
import PromotionsSection from '@/components/sections/PromotionsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import InstagramGallery from '@/components/InstagramGallery';
import CTASection from '@/components/sections/CTASection';

export default function Index() {
  const { data: hotels = [], isLoading: hotelsLoading } = useHotels();
  const { data: promotions = [], isLoading: promotionsLoading } = useActivePromotions();

  const openEnquiryModal = useEnquiryModalStore((state) => state.open);

  const handleEnquire = (hotel: Hotel) => {
    openEnquiryModal(hotel);
  };

  const featuredHotels = hotels.slice(0, 6);
  const { showInstagramSection } = useSiteSettingsStore();
  const { data: testimonials = [], isLoading: testimonialsLoading } = useTestimonials();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <EmeraldEdge />
      <WhyChooseUs />
      <FeaturedHotels hotels={featuredHotels} isLoading={hotelsLoading} onEnquire={handleEnquire} />
      <PromotionsSection promotions={promotions} isLoading={promotionsLoading} />
      <TestimonialsSection testimonials={testimonials} isLoading={testimonialsLoading} />
      {showInstagramSection && <InstagramGallery />}
      <CTASection />
    </div>
  );
}