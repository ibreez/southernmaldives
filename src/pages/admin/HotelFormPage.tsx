"use client";

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import {
   Save, ArrowLeft, Layout, Building2, Sparkles, Image as ImageIcon,
   Coffee, MapPin, CheckCircle2, AlertCircle, Eye, ChevronRight,
   Settings2, Search, ExternalLink, History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnimatePresence } from 'framer-motion';

import AdminLayout from '@/components/AdminLayout';
import AccommodationManager from '@/components/AccommodationManager';
import { useDetailedHotel, useUpdateHotel, useCreateDetailedHotel } from '@/hooks/useHotels';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Section Components
import BasicInfoSection from './sections/BasicInfoSection';
import MediaManagerSection from './sections/MediaManagerSection';
import AccommodationSection from './sections/AccommodationSection';
import DiningSection from './sections/DiningSection';
import AmenitySection from './sections/AmenitySection';

export default function HotelFormPage() {
   const { id } = useParams();
   const navigate = useNavigate();
   const isEditMode = !!id;
   const [activeSection, setActiveSection] = useState('identity');

   const { data: hotelData, isLoading: isFetching } = useDetailedHotel(id || '');
   const updateHotel = useUpdateHotel();
   const createHotel = useCreateDetailedHotel();

     const methods = useForm({
        defaultValues: {
           star_rating: 5,
           images: [''],
           nearby_attractions: [{ name: '', distance: '', type: 'Beach' }],
           rooms: [],
           amenities: [],
           distance_from_airport: null,
           guest_rating: null,
           hide_culinary_section: false,
           dining: {
              main_description: '',
              hero_image_url: '',
              section_label: 'Culinary',
              heading_main: 'Island',
              heading_italic: 'Flavors',
              restaurants: [{ name: '', type: 'Signature Dining', cuisine: '', images: [], schedules: [{ label: 'Daily', start: '', end: '' }] }],
              breakfast_types: [],
              bar_info: { section_label: '', name: '', hours: '', specialties: '' },
              room_service: false,
           },
        },
     });

   const { reset } = methods;

     // Reset form when hotel data loads
     useEffect(() => {
        if (hotelData?.hotel) {
           reset({
              ...hotelData.hotel,
              rooms: hotelData.rooms || [],
              amenities: hotelData.amenities || [],
              distance_from_airport: hotelData.hotel?.distance_from_airport ?? null,
              guest_rating: hotelData.hotel?.guest_rating ?? null,
              hide_culinary_section: hotelData.hotel?.hide_culinary_section ?? false,
              dining: {
                 main_description: hotelData.dining?.main_description || '',
                 hero_image_url: hotelData.dining?.hero_image_url || '',
                 section_label: hotelData.dining?.section_label || '',
                 heading_main: hotelData.dining?.heading_main || '',
                 heading_italic: hotelData.dining?.heading_italic || '',
                 restaurants: hotelData.dining?.restaurants?.length
                    ? hotelData.dining.restaurants
                    : [{ name: '', type: 'Signature Dining', cuisine: '', images: [], schedules: [{ label: 'Daily', start: '', end: '' }] }],
                 breakfast_types: hotelData.dining?.breakfast_types || [],
                 bar_info: {
                    section_label: hotelData.dining?.bar_info?.section_label || '',
                    name: hotelData.dining?.bar_info?.name || '',
                    hours: hotelData.dining?.bar_info?.hours || '',
                    specialties: hotelData.dining?.bar_info?.specialties || '',
                 },
                 room_service: hotelData.dining?.room_service ?? false,
              },
           });
        }
     }, [hotelData, reset]);

   const sections = [
      { id: 'identity', label: 'Property Identity', icon: Layout, description: 'Basic name, atoll, and description' },
      { id: 'accommodation', label: 'Suites & Villas', icon: Building2, description: 'Manage room types and inventory' },
      { id: 'amenities', label: 'Resort Features', icon: Sparkles, description: 'Pools, Spa, and guest services' },
      { id: 'media', label: 'Gallery & Video', icon: ImageIcon, description: 'High-res marketing assets' },
      { id: 'dining', label: 'Dining Collection', icon: Coffee, description: 'Restaurants and bars' },
      { id: 'location', label: 'Geography', icon: MapPin, description: 'Transfer details and coordinates' },
   ];

   const onSubmit = async (data: any) => {
      const promise = id
         ? updateHotel.mutateAsync({ id, hotel: data })
         : createHotel.mutateAsync(data);

      toast.promise(promise, {
         loading: 'Syncing content to global servers...',
         success: 'Resort profile updated live.',
         error: 'Sync failed. Please check connection.',
      });
   };

   // Compute property health score
   const completionPercentage = useMemo(() => {
      const watched = methods.watch();
      const checks = [
         !!watched.name,
         !!watched.location,
         !!watched.price,
         !!watched.description,
         (watched.images || []).filter((url: string) => url?.trim()).length >= 3,
         (watched.rooms || []).length > 0,
         (watched.amenities || []).length >= 5,
      ];
      return Math.round((checks.filter(Boolean).length / checks.length) * 100);
   }, [methods.watch()]);

   return (
      <AdminLayout>
         {isEditMode && isFetching ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
               <div className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
               <p className="font-serif italic text-slate-400">Loading resort data...</p>
            </div>
         ) : (
            <FormProvider {...methods}>
               <div className="flex flex-col min-h-screen -mt-8 -mx-8">

               {/* 1. Global Workspace Header */}
               <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                     </Button>
                     <div className="h-10 w-px bg-slate-200" />
                     <div>
                        <div className="flex items-center gap-3">
                           <h1 className="text-xl font-serif font-bold text-slate-900">
                              {methods.watch('name') || 'Unnamed Property'}
                           </h1>
                           <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 uppercase text-[9px] tracking-widest font-bold">
                              Draft Mode
                           </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                           <History className="h-3 w-3" /> Last edited 2 mins ago by Admin
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <Button variant="ghost" className="text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest">
                                 <Eye className="h-4 w-4 mr-2" /> Preview Live
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>View this property as guests see it</p>
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>

                     <Button
                        onClick={methods.handleSubmit(onSubmit)}
                        className="bg-[#022c22] hover:bg-black text-white px-8 rounded-full shadow-lg shadow-emerald-900/10"
                     >
                        <Save className="h-4 w-4 mr-2" />
                        Publish Changes
                     </Button>
                  </div>
               </div>

               <div className="flex flex-1 overflow-hidden">

                  {/* 2. Management Navigation Sidebar */}
                  <aside className="w-80 border-r border-slate-100 bg-slate-50/50 p-6 space-y-8 overflow-y-auto">
                     {/* Section Navigation */}
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">Navigation</label>
                        <nav className="space-y-1">
                           {sections.map((section) => (
                              <button
                                 key={section.id}
                                 onClick={() => setActiveSection(section.id)}
                                 className={cn(
                                    "w-full flex items-start gap-4 p-4 rounded-2xl transition-all text-left group",
                                    activeSection === section.id
                                       ? "bg-white shadow-sm ring-1 ring-slate-200"
                                       : "hover:bg-slate-100"
                                 )}
                              >
                                 <div className={cn(
                                    "p-2 rounded-xl transition-colors",
                                    activeSection === section.id ? "bg-emerald-600 text-white" : "bg-white text-slate-400 group-hover:text-slate-600"
                                 )}>
                                    <section.icon className="h-4 w-4" />
                                 </div>
                                 <div>
                                    <p className={cn("text-sm font-bold", activeSection === section.id ? "text-slate-900" : "text-slate-500")}>
                                       {section.label}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{section.description}</p>
                                 </div>
                              </button>
                           ))}
                        </nav>
                     </div>

                     {/* 3. Property Health Card */}
                     <div className="p-6 rounded-[2rem] bg-gradient-to-br from-emerald-900 to-teal-950 text-white relative overflow-hidden">
                        <div className="relative z-10">
                           <div className="flex justify-between items-end mb-4">
                              <h4 className="text-xs font-bold uppercase tracking-widest">Property Health</h4>
                              <span className="text-2xl font-serif">{completionPercentage}%</span>
                           </div>
                           <Progress value={completionPercentage} className="h-1.5 bg-white/10" />
                           <p className="text-[10px] text-emerald-200/60 mt-4 leading-relaxed">
                              {completionPercentage < 50 && 'Add more content to improve visibility.'}
                              {completionPercentage >= 50 && completionPercentage < 80 && 'Almost there! Add a few more details.'}
                              {completionPercentage >= 80 && 'Great job! Your profile looks complete.'}
                           </p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                           <Sparkles className="h-24 w-24" />
                        </div>
                     </div>
                  </aside>

                  {/* 4. Active Content Area */}
                  <main className="flex-1 bg-white overflow-y-auto p-12">
                     <div className="max-w-4xl mx-auto">
                        <div className="mb-12">
                           <h2 className="text-3xl font-serif font-bold text-slate-900 capitalize">
                              {activeSection.replace('-', ' ')}
                           </h2>
                           <p className="text-slate-500 mt-2 font-light italic">
                              Configure the details that appear on the guest-facing storefront.
                           </p>
                        </div>

                        <AnimatePresence mode="wait">
                           {activeSection === 'identity' && <BasicInfoSection key="identity" />}
                           {activeSection === 'accommodation' && <AccommodationSection key="accommodation" />}
                           {activeSection === 'amenities' && <AmenitySection key="amenities" />}
                           {activeSection === 'media' && <MediaManagerSection key="media" />}
                           {activeSection === 'dining' && <DiningSection key="dining" />}
                           {activeSection === 'location' && (
                              <div className="p-12 text-center text-slate-400">
                                 <MapPin className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                 <p>Location configuration coming soon</p>
                              </div>
                           )}
                        </AnimatePresence>
                       </div>
                    </main>
               </div>
            </div>
            </FormProvider>
         )}
      </AdminLayout>
   );
}