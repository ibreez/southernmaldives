import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, Star, MapPin, Wifi, Car, UtensilsCrossed,
  Waves, Dumbbell, Sparkles, Baby, Clock, Users,
  DollarSign, CheckCircle2, Info, ChevronRight, Share2,
  Wind, Lock, Scissors, Coffee, Phone, Tv, Home, Umbrella, Droplet, Sofa, ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDetailedHotel } from '@/hooks/useHotels';
import { useEnquiryModalStore } from '@/stores/enquiryModalStore';
import { SecondaryNav } from '@/components/SecondaryNav';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: hotelDetails, isLoading, error } = useDetailedHotel(id || '');
  const hotel = hotelDetails?.hotel;
  const openEnquiryModal = useEnquiryModalStore((state) => state.open);

  const sections = [
    { id: 'overview', label: 'The Vision' },
    { id: 'rooms', label: 'Accommodations' },
    { id: 'amenities', label: 'The Details' },
    { id: 'dining', label: 'Culinary' },
    { id: 'policies', label: 'Guest Notes' },
  ];

   const amenityGroupMap: Record<string, string> = {
     wifi: 'In-Room Comforts',
     room: 'In-Room Comforts',
     comfort: 'In-Room Comforts',
     security: 'In-Room Comforts',
     bathroom: 'In-Room Comforts',
     beverage: 'Dining & Pantry',
     dining: 'Dining & Pantry',
     coffee: 'Dining & Pantry',
     tea: 'Dining & Pantry',
     spa: 'Wellness & Fitness',
     fitness: 'Wellness & Fitness',
     pool: 'Wellness & Fitness',
     beach: 'Beach & Outdoor',
     outdoor: 'Beach & Outdoor',
     transport: 'Transportation & Services',
     custom: 'Additional Luxuries',
   };

   const getAmenityGroup = (amenity: { category?: string; amenity_name?: string; icon_name?: string }) => {
     const category = (amenity.category || amenity.icon_name || amenity.amenity_name || '').toString().toLowerCase();
     if (category.includes('pool') || category.includes('spa') || category.includes('fitness') || category.includes('gym') || category.includes('wellness')) {
       return 'Wellness & Fitness';
     }
     if (category.includes('room') || category.includes('comfort') || category.includes('safe') || category.includes('coffee') || category.includes('wifi') || category.includes('tv') || category.includes('veranda') || category.includes('mini') || category.includes('hair') || category.includes('iron')) {
       return 'In-Room Comforts';
     }
     if (category.includes('beach') || category.includes('outdoor') || category.includes('towel') || category.includes('sand')) {
       return 'Beach & Outdoor';
     }
     if (category.includes('transport') || category.includes('airport') || category.includes('transfer') || category.includes('shuttle')) {
       return 'Transportation & Services';
     }
     if (category.includes('restaurant') || category.includes('dining') || category.includes('food') || category.includes('bar') || category.includes('tea')) {
       return 'Dining & Pantry';
     }
     return amenityGroupMap[category] || 'Additional Luxuries';
   };

   const groupedAmenities = hotelDetails?.amenities?.reduce((acc: Record<string, any[]>, amenity) => {
     const group = getAmenityGroup(amenity);
     acc[group] = acc[group] || [];
     acc[group].push(amenity);
     return acc;
   }, {} as Record<string, any[]>) || {};

   useEffect(() => {
     const ctx = gsap.context(() => {
       const sections = document.querySelectorAll('.reveal-section');
       sections.forEach((section) => {
         const header = section.querySelector('.reveal-header');
         const items = section.querySelectorAll('.reveal-item');
 
         if (header) {
           gsap.from(header, {
             opacity: 0,
             y: 30,
             duration: 0.8,
             ease: 'power3.out',
             scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' },
           });
         }
 
         gsap.from(items, {
           opacity: 0,
           y: 20,
           scale: 0.95,
           duration: 0.6,
           stagger: 0.08,
           ease: 'power3.out',
           scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' },
         });
       });
     });
 
     return () => ctx.revert();
   }, [hotelDetails?.amenities, hotelDetails?.rooms, hotelDetails?.dining?.restaurants, hotelDetails?.dining?.breakfast_types]);

  const getAmenityIcon = (amenity: { category?: string; amenity_name?: string; icon_name?: string }) => {
    const text = (amenity.icon_name || amenity.category || amenity.amenity_name || '').toString().toLowerCase();
    if (text.includes('wifi') || text.includes('wi-fi')) return <Wifi className="h-5 w-5" />;
    if (text.includes('air') && text.includes('condition')) return <Wind className="h-5 w-5" />;
    if (text.includes('safe')) return <Lock className="h-5 w-5" />;
    if (text.includes('hair')) return <Scissors className="h-5 w-5" />;
    if (text.includes('iron')) return <Sparkles className="h-5 w-5" />;
    if (text.includes('hot') && text.includes('cold')) return <Droplet className="h-5 w-5" />;
    if (text.includes('tea') || text.includes('coffee')) return <Coffee className="h-5 w-5" />;
    if (text.includes('telephone') || text.includes('phone')) return <Phone className="h-5 w-5" />;
    if (text.includes('fridge')) return <Sparkles className="h-5 w-5" />;
    if (text.includes('tv') || text.includes('television')) return <Tv className="h-5 w-5" />;
    if (text.includes('veranda') || text.includes('balcony')) return <Home className="h-5 w-5" />;
    if (text.includes('outdoor') || text.includes('seating')) return <Sofa className="h-5 w-5" />;
    if (text.includes('towel')) return <Umbrella className="h-5 w-5" />;
    if (text.includes('pool')) return <Waves className="h-5 w-5" />;
    if (text.includes('spa') || text.includes('wellness')) return <Sparkles className="h-5 w-5" />;
    if (text.includes('gym') || text.includes('fitness') || text.includes('workout')) return <Dumbbell className="h-5 w-5" />;
    if (text.includes('restaurant') || text.includes('dining') || text.includes('food')) return <UtensilsCrossed className="h-5 w-5" />;
    if (text.includes('airport') || text.includes('transfer') || text.includes('shuttle') || text.includes('transport')) return <Car className="h-5 w-5" />;
    if (text.includes('beach') || text.includes('private beach') || text.includes('shore')) return <Star className="h-5 w-5" />;
    if (text.includes('family') || text.includes('kids') || text.includes('child')) return <Baby className="h-5 w-5" />;
    if (text.includes('bar') || text.includes('cocktail')) return <DollarSign className="h-5 w-5" />;
    if (text.includes('concierge') || text.includes('service')) return <CheckCircle2 className="h-5 w-5" />;
    if (text.includes('umbrella')) return <Umbrella className="h-5 w-5" />;
    if (text.includes('sofa') || text.includes('seating')) return <Sofa className="h-5 w-5" />;
    return <Sparkles className="h-5 w-5" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-t-2 border-emerald-600 rounded-full animate-spin" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-800/60">Loading Sanctuary</span>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="space-y-6 max-w-md">
          <h1 className="font-serif text-3xl text-slate-900">Destination Unknown</h1>
          <p className="text-slate-500 font-light italic">The island you seek is currently beyond the horizon.</p>
          <Button asChild variant="outline" className="rounded-none border-emerald-900 text-emerald-900 hover:bg-emerald-50 px-10">
            <Link to="/hotels">Return to Collection</Link>
          </Button>
        </div>
      </div>
    );
  }

  const galleryImages: string[] =
    (hotelDetails?.gallery ?? []).map((g: any) => g.image_url).filter(Boolean).length > 0
      ? hotelDetails.gallery.map((g: any) => g.image_url).filter(Boolean)
      : (hotel.images ?? []).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <HeroGallery
        images={galleryImages}
        hotelName={hotel.name}
        location={hotel.location}
        starRating={hotel.star_rating}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-32">
              <SecondaryNav sections={sections} />
              <div className="mt-12 pt-12 border-t border-emerald-50">
                <p className="text-[10px] uppercase tracking-widest text-emerald-800/40 mb-4">Starting At</p>
                <p className="text-3xl font-serif text-emerald-900">${hotel.price}</p>
                 <p className="text-[10px] text-slate-400 uppercase tracking-tighter mt-1">Per Night</p>
               </div>
             </div>
           </div>

          <div className="lg:col-span-10 space-y-40">
             <section id="overview" className="scroll-mt-32 reveal-section">
                 <div className="grid grid-cols-1 md:grid-cols-10 gap-12 items-start">
                     <div className="md:col-span-4">
                         <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-bold block mb-6 reveal-header">The Vision</span>
                         <h2 className="font-serif text-5xl text-slate-900 leading-tight reveal-item">
                             {hotel.vision_main_text || 'Pristine'} <span className="italic text-emerald-600/70 font-light">{hotel.vision_italic_text || 'Elegance'}</span>
                         </h2>
                     </div>
                     <div className="md:col-span-6 pt-4">
                         <div className="prose prose-slate max-w-none reveal-item">
                             <p className="text-xl text-emerald-900/60 leading-relaxed font-light italic mb-10">
                                 Discover paradise in the heart of the Maldives, where turquoise waters meet pristine white sands.
                             </p>
                             <div className="text-slate-600 leading-relaxed text-lg font-light space-y-6 reveal-item">
                                 {hotel.long_description || hotel.description}
                             </div>
                         </div>
                     </div>
                 </div>

                 <div className="mt-24 grid grid-cols-2 md:grid-cols-4 border-y border-emerald-50 divide-x divide-emerald-50 reveal-item">
                     {[
                         { label: 'Proximity', value: `${hotel.distance_from_airport}km`, sub: 'From Airport' },
                         { label: 'Rating', value: `${hotel.guest_rating}/5`, sub: 'Guest Satisfaction' },
                         { label: 'Category', value: hotel.category, sub: 'Resort Type' },
                         { label: 'Service', value: 'Butler', sub: 'On-Call 24/7' },
                     ].map((stat, i) => (
                         <div key={i} className="py-12 px-8 text-center md:text-left hover:bg-emerald-50/30 transition-colors reveal-item">
                             <p className="text-[9px] uppercase tracking-[0.3em] text-emerald-800/40 mb-2">{stat.label}</p>
                             <p className="text-2xl font-serif text-slate-900 mb-1">{stat.value}</p>
                             <p className="text-[10px] text-slate-400 uppercase tracking-widest">{stat.sub}</p>
                         </div>
                     ))}
                 </div>
             </section>

             <section id="rooms" className="scroll-mt-32 reveal-section">
                 <div className="flex flex-col items-center text-center mb-20">
                   <span className="text-[10px] uppercase tracking-[0.6em] text-emerald-700 font-bold mb-4 reveal-header">Accommodations</span>
                   <h2 className="font-serif text-5xl md:text-7xl text-slate-900 tracking-tight reveal-item">Our <span className="italic font-light text-emerald-600/40">Rooms</span></h2>
                 </div>

                 {hotelDetails?.rooms?.length ? (
                   <div className="space-y-32">
                     {hotelDetails.rooms.map((room, idx) => (
                       <div key={room.id} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center reveal-item`}>
                         <div className="w-full md:w-3/5 aspect-[4/3] overflow-hidden bg-slate-100 relative group">
                           <div className="absolute inset-0 bg-emerald-900/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                           <img
                             src={room.images?.[0] || '/assets/room-placeholder.jpg'}
                             alt={room.room_name}
                             className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                           />
                         </div>
                         <div className="w-full md:w-2/5 space-y-6">
                           <span className="text-[10px] uppercase tracking-[0.4em] text-emerald-800/40">{room.room_type || 'Villa'}</span>
                           <h3 className="font-serif text-4xl text-slate-900 leading-tight">{room.room_name}</h3>
                           <p className="text-slate-500 font-light leading-relaxed text-lg">
                                 {room.description || 'A masterpiece of island architecture, offering unhindered views of the Indian Ocean and personalized luxury at every turn.'}
                           </p>
                           <div className="pt-6 grid grid-cols-2 gap-y-4 gap-x-8 border-t border-emerald-50">
                                 <div>
                                     <p className="text-[9px] uppercase tracking-widest text-slate-400">Capacity</p>
                                     <p className="text-sm font-medium">{room.max_guests} Guests</p>
                                 </div>
                                 <div>
                                     <p className="text-[9px] uppercase tracking-widest text-slate-400">Size</p>
                                     <p className="text-sm font-medium">{room.room_size || '120'} m²</p>
                                 </div>
                                 <div className="col-span-2">
                                     <p className="text-[9px] uppercase tracking-widest text-emerald-800/40">Nightly</p>
                                     <p className="text-xl font-serif text-emerald-700">${room.price}</p>
                                 </div>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="py-20 text-center border border-dashed border-emerald-100 reveal-item">
                     <p className="font-serif italic text-emerald-800/30 text-2xl">Refining our villas...</p>
                   </div>
                 )}
             </section>

               <section id="amenities" className="scroll-mt-32 py-24 reveal-section">
                 <div className="max-w-7xl mx-auto">
                   <div className="flex flex-col items-center text-center mb-20">
                     <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-bold mb-4 reveal-header">
                       The Guest Experience
                     </span>
                     <h2 className="font-serif text-5xl md:text-[56px] tracking-tight mb-6 text-slate-900 reveal-item">
                       Exclusive <span className="italic font-light text-emerald-600/40">Amenities</span>
                     </h2>
                     <div className="w-12 h-px bg-emerald-100 reveal-item" />
                   </div>

                   <div className="space-y-24 reveal-item">
                     {Object.entries(groupedAmenities).map(([group, items]) => (
                       <div key={group} className="amenity-group reveal-item">
                         <div className="group-header flex items-center gap-6 mb-10">
                           <h3 className="font-mono text-[10px] uppercase tracking-[0.08em] whitespace-nowrap text-slate-400">
                             {group}
                           </h3>
                           <div className="flex-grow h-px bg-emerald-50" />
                         </div>

                         <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
                           {(items as any[]).map((amenity, idx) => (
                             <div
                               key={idx}
                               className="amenity-item group flex flex-col items-center text-center p-4 reveal-item"
                             >
                               <div
                                 className="mb-4 flex items-center justify-center w-20 h-20 rounded-full border transition-all duration-500"
                                 style={{
                                   borderColor: amenity.is_featured ? 'rgba(5, 150, 105, 0.2)' : 'transparent',
                                   color: amenity.is_featured ? '#047857' : 'rgba(15, 23, 42, 0.25)',
                                 }}
                               >
                                 <div className="scale-[1.35]">{getAmenityIcon(amenity)}</div>
                               </div>
                               <h4
                                 className="font-mono text-[11px] tracking-[0.06em] uppercase transition-colors duration-300"
                                 style={{ color: amenity.is_featured ? '#0f172a' : '#94a3b8' }}
                               >
                                 {amenity.amenity_name}
                               </h4>
                             </div>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </section>

               {!hotel.hide_culinary_section && (
                 <>
               <section id="dining" className="scroll-mt-32 reveal-section">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-40 reveal-item">
                      <div className="order-2 md:order-1">
                          <div className="inline-flex items-center gap-4 mb-8 reveal-item">
                             <div className="h-px w-8 bg-emerald-600" />
                             <span className="text-[10px] uppercase tracking-[0.6em] text-emerald-700 font-bold">
                                 {hotelDetails?.dining?.section_label || 'Culinary'}
                             </span>
                          </div>
                          <h2 className="font-serif text-6xl lg:text-7xl text-slate-900 leading-[1.1] mb-8 reveal-item">
                              {hotelDetails?.dining?.heading_main || 'Island'} <br />
                              <span className="italic text-emerald-600/40 font-light ml-12">
                                  {hotelDetails?.dining?.heading_italic || 'Flavors'}
                              </span>
                          </h2>
                          <div className="relative">
                             <p className="text-emerald-900/60 font-light text-xl leading-relaxed italic max-w-md reveal-item">
                                 {hotelDetails?.dining?.main_description || "A curated journey through international palettes and local Maldivian spices, set against the backdrop of the Indian Ocean."}
                             </p>
                          </div>
                      </div>
                     <div className="order-1 md:order-2 aspect-[4/5] bg-emerald-50/30 relative overflow-hidden group shadow-2xl reveal-item">
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700 z-10" />
                          <img 
                            src={hotelDetails?.dining?.hero_image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80"} 
                            alt="Culinary Experience" 
                            className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100"
                            loading="lazy"
                          />
                          <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/90 backdrop-blur-md z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                             <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-800/60 mb-2">Refined Flavors</p>
                             <p className="font-serif text-2xl text-slate-900">Where Taste Meets Elegance.</p>
                          </div>
                     </div>
                 </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 mb-40 reveal-item">
                      {hotelDetails?.dining?.restaurants?.map((rest, i) => {
                        const imagesArray = Array.isArray(rest.images)
                          ? rest.images
                          : typeof rest.images === 'string'
                            ? rest.images.split(/[\n,]+/).map((url: string) => url.trim()).filter(Boolean)
                            : [];
                        const imageSrc = imagesArray[0] || `https://images.unsplash.com/photo-${['1514362545857-3bc16c4c7d1b', '1559339352-11d035aa65de', '1550966841-3ee71a097083'][i % 3]}?auto=format&fit=crop&q=80`;
                        return (
                          <div key={rest.id || i} className="group cursor-default reveal-item">
                            <div className="relative aspect-[16/10] overflow-hidden mb-8 bg-slate-100">
                              <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                              <img
                                src={imageSrc}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt={rest.name}
                              />
                              <div className="absolute top-4 right-4 z-20">
                                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                  <UtensilsCrossed className="h-4 w-4 text-emerald-800" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-[9px] uppercase tracking-[0.3em] text-emerald-700 font-bold mb-1">{rest.type || 'Signature Dining'}</p>
                                  <h4 className="font-serif text-3xl text-slate-900 group-hover:text-emerald-700 transition-colors duration-300">{rest.name}</h4>
                                </div>
                              </div>
                              <div className="h-px w-12 bg-emerald-100 group-hover:w-full transition-all duration-700" />
                              <p className="text-slate-500 text-sm font-light leading-relaxed">
                                A harmonious blend of <span className="text-slate-800 font-medium">{rest.cuisine}</span> artistry.
                              </p>
                              {rest.schedules && rest.schedules.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {rest.schedules.map((schedule, schedIdx) => (
                                    <p key={schedIdx} className="flex items-center gap-2 italic text-xs text-slate-500">
                                      <Clock className="h-3 w-3" />
                                      {schedule.label}: {schedule.start} - {schedule.end}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                     </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                     <div className="lg:col-span-7">
                         <div className="mb-12">
                             <span className="text-[10px] uppercase tracking-[0.6em] text-emerald-700 font-bold block mb-4 reveal-header">The First Meal</span>
                             <h3 className="font-serif text-5xl text-slate-900 reveal-item">Morning <span className="italic font-light text-emerald-600/40">Awakenings</span></h3>
                         </div>
                         
                         <div className="grid gap-8 opacity-100">
                             {hotelDetails?.dining?.breakfast_types?.length > 0 ? (
                               hotelDetails.dining.breakfast_types.map((breakfast, idx) => (
                                 <div key={breakfast.id || idx} className="relative group p-8 border border-emerald-50 hover:border-emerald-200 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-900/5 overflow-hidden">
                                     <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                         <Coffee className="h-24 w-24" />
                                     </div>
                                     <div className="relative z-10">
                                         <div className="flex items-center gap-4 mb-4">
                                             <h4 className="font-serif text-2xl text-slate-900">{breakfast.name || 'Continental Selection'}</h4>
                                             {breakfast.included_in_room_rate && (
                                                 <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none text-[8px] uppercase tracking-widest px-3">Complimentary</Badge>
                                             )}
                                         </div>
                                         <p className="text-slate-500 font-light leading-relaxed max-w-lg mb-6 text-sm">
                                             {(breakfast.items || []).join(', ') || 'A curated selection of international morning favorites and tropical Maldivian fruits.'}
                                         </p>
                                         <div className="h-px w-full bg-emerald-50 group-hover:bg-emerald-100 transition-colors" />
                                     </div>
                                 </div>
                               ))
                             ) : (
                               <div className="p-8 border border-emerald-50 text-slate-500">Breakfast options are being prepared for your stay.</div>
                             )}
                         </div>
                     </div>

                      {hotelDetails?.dining?.bar_info?.name && (
                        <div className="lg:col-span-5 bg-slate-900 p-12 text-white relative overflow-hidden shadow-2xl rounded-[2rem] reveal-item">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                            
                            <div className="relative z-10 space-y-12">
                                <div>
                                    <span className="text-[10px] uppercase tracking-[0.6em] text-emerald-400 font-bold block mb-6 reveal-header">
                                      {hotelDetails?.dining?.bar_info?.section_label || 'Mixology & Spirits'}
                                    </span>
                                    <div className="flex items-baseline gap-4 mb-4">
                                        <h3 className="font-serif text-4xl">{hotelDetails?.dining?.bar_info?.name || 'The Twilight Bar'}</h3>
                                        <Wind className="h-4 w-4 text-emerald-400/40" />
                                    </div>
                                    <p className="text-slate-400 font-light text-sm leading-relaxed italic mb-8">
                                        {hotelDetails?.dining?.bar_info?.specialties || "Sunset cocktails and rare vintages served in an atmosphere of refined tropical elegance."}
                                    </p>
                                    <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                                        {hotelDetails?.dining?.bar_info?.hours && (
                                          <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {hotelDetails.dining.bar_info.hours}</span>
                                        )}
                                    </div>
                                </div>

                                <Separator className="bg-white/10 reveal-item" />

                                {hotelDetails?.dining?.room_service && (
                                  <div className="space-y-6 reveal-item">
                                      <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Service Notes</p>
                                      <div className="flex items-start gap-4 group">
                                          <div className="p-3 bg-white/5 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                          </div>
                                          <div>
                                              <p className="text-sm font-medium">In-Villa Dining</p>
                                              <p className="text-xs text-slate-400 font-light mt-1">
                                                Available 24 hours a day for your convenience.
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                                )}
                            </div>
                        </div>
                      )}
                  </div>
                 </section>
                 </>
               )}

             <section id="policies" className="scroll-mt-32 pb-40 reveal-section">
                 <div className="flex items-center gap-8 mb-20 reveal-item">
                     <h2 className="font-serif text-4xl text-slate-900">Guest <span className="italic text-emerald-600/40">Notes</span></h2>
                     <div className="h-[0.5px] flex-1 bg-emerald-50" />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-16 reveal-item">
                     <div className="md:col-span-4 space-y-12">
                         <div>
                             <p className="text-[10px] uppercase tracking-widest text-emerald-800/40 mb-4 reveal-header">Arrival</p>
                             <p className="text-3xl font-serif text-slate-900 reveal-item">{hotelDetails?.policies?.check_in || '14:00'}</p>
                         </div>
                         <div>
                             <p className="text-[10px] uppercase tracking-widest text-emerald-800/40 mb-4 reveal-header">Departure</p>
                             <p className="text-3xl font-serif text-slate-900 reveal-item">{hotelDetails?.policies?.check_out || '12:00'}</p>
                         </div>
                     </div>
                     <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-12 reveal-item">
                         {[
                           { label: 'Cancellation', val: hotelDetails?.policies?.cancellation_policy },
                           { label: 'Children', val: hotelDetails?.policies?.child_policy },
                           { label: 'Pets', val: hotelDetails?.policies?.pet_policy },
                           { label: 'Smoking', val: hotelDetails?.policies?.smoking_policy }
                         ].map((p, i) => (
                           <div key={i} className="space-y-3 reveal-item">
                             <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-700">{p.label}</p>
                             <p className="text-sm text-slate-500 leading-relaxed font-light">{p.val || 'Standard luxury resort protocols apply.'}</p>
                           </div>
                         ))}
                     </div>
                 </div>
             </section>
          </div>
        </div>
      </div>

      <div className="fixed bottom-12 right-12 z-50">
          <button 
            onClick={() => openEnquiryModal(hotel)}
            className="bg-emerald-950 text-white w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-2xl hover:bg-emerald-800 transition-all duration-500 group scale-100 hover:scale-110"
          >
              <Sparkles className="h-5 w-5 mb-1 text-emerald-400 group-hover:animate-pulse" />
              <span className="text-[8px] uppercase tracking-tighter font-black">Enquire</span>
          </button>
      </div>

       <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-emerald-50 p-6 z-50 flex items-center justify-between">
           <div>
             <p className="text-[8px] uppercase tracking-widest text-emerald-800/40">Nightly</p>
             <p className="text-xl font-serif text-emerald-900">${hotel.price}</p>
           </div>
           <Button onClick={() => openEnquiryModal(hotel)} className="rounded-none bg-emerald-900 hover:bg-emerald-800 px-8 py-6 h-auto text-[10px] uppercase tracking-widest">
             Check Availability
           </Button>
       </div>
    </div>
   );
 }

interface HeroGalleryProps {
  images: string[];
  hotelName: string;
  location: string;
  starRating: number;
}

function HeroGallery({ images, hotelName, location, starRating }: HeroGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = (index: number) => {
    if (index === activeIndex || transitioning) return;
    setTransitioning(true);
    setPrevIndex(activeIndex);
    setActiveIndex(index);
    setTimeout(() => {
      setPrevIndex(null);
      setTransitioning(false);
    }, 700);
  };

  const goPrev = () => goTo((activeIndex - 1 + images.length) % images.length);
  const goNext = () => goTo((activeIndex + 1) % images.length);

  const fallback = '/assets/hero-tropical-beach-sunset.jpg';
  const displayImages = images.length > 0 ? images : [fallback];

  return (
    <div className="w-full bg-[#1A1F1D] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-20 border-b border-emerald-500/5" />

      <div className="relative w-full h-[75vh] lg:h-[85vh] overflow-hidden group/hero">
        
        {prevIndex !== null && (
          <img
            key={`prev-${prevIndex}`}
            src={displayImages[prevIndex]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-700 ease-out opacity-0"
          />
        )}

        <img
          key={`active-${activeIndex}`}
          src={displayImages[activeIndex]}
          alt={`${hotelName} — image ${activeIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] ease-out scale-100 group-hover/hero:scale-105"
          style={{
            zIndex: 2,
            animation: 'heroFadeIn 800ms cubic-bezier(0.25, 1, 0.5, 1) forwards',
          }}
        />

        {/* ── Optimized Lightweight Gradient ── */}
        {/* We use a multi-stop transparent-to-dark gradient that only appears in the bottom 40% */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#0B1310]/90 via-[#0B1310]/20 to-transparent to-40%" />

        <div className="absolute bottom-0 inset-x-0 z-30 pb-12 pt-32 px-6 lg:px-12">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.6em] text-emerald-400/90 font-bold">
                  Maldives Exclusive
                </span>
                <span className="w-8 h-px bg-emerald-500/20" />
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-white tracking-tight leading-none drop-shadow-sm">
                {hotelName}
              </h1>
              
              <div className="flex items-center gap-4 pt-2 text-white/70">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="p-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.25em] font-light transition-colors group-hover:text-white">
                    {location}
                  </span>
                </div>
                
                <div className="h-3 w-px bg-emerald-500/20" />
                
                <div className="flex items-center gap-1.5 bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-500/10">
                  {Array.from({ length: starRating }).map((_, i) => (
                    <Star key={i} className="h-2.5 w-2.5 fill-emerald-400 text-emerald-400" />
                  ))}
                </div>
              </div>
            </div>

            {displayImages.length > 1 && (
              <div className="hidden md:flex items-baseline font-mono text-xs text-white/40 tracking-[0.3em] gap-3">
                <span className="text-emerald-400 text-xl font-light">{String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="opacity-20">/</span>
                <span>{String(displayImages.length).padStart(2, '0')}</span>
              </div>
            )}

          </div>
        </div>

        {displayImages.length > 1 && (
          <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30">
            <button
              onClick={goPrev}
              className="bg-white/5 hover:bg-emerald-900/80 border border-white/10 hover:border-emerald-500/50 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-md hover:scale-110 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="bg-white/5 hover:bg-emerald-900/80 border border-white/10 hover:border-emerald-500/50 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-md hover:scale-110 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="bg-[#0A0F0D] border-t border-white/5 px-6 lg:px-12 py-6 relative z-30">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex gap-5 overflow-x-auto scrollbar-hide py-1 mask-edge-fade">
              {displayImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="flex-shrink-0 relative group outline-none focus:outline-none"
                  aria-label={`View image ${i + 1}`}
                >
                  <div
                    className={`w-28 h-16 md:w-40 md:h-24 overflow-hidden rounded-sm transition-all duration-700 relative ${
                      i === activeIndex 
                        ? 'ring-1 ring-emerald-400/60 ring-offset-4 ring-offset-[#0A0F0D] opacity-100 scale-105' 
                        : 'opacity-30 hover:opacity-70 grayscale-[40%] hover:grayscale-0'
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: scale(1.03); }
          to   { opacity: 1; transform: scale(1); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-edge-fade {
          mask-image: linear-gradient(to right, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, black 90%, transparent 100%);
        }
      `}</style>
    </div>
  );
}