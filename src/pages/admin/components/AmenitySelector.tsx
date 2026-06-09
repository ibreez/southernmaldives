"use client";

import { useState, useMemo } from 'react';
import { useFieldArray } from 'react-hook-form';
import {
   Sparkles, Wifi, Waves, Dumbbell, Car, Wind, Lock, Scissors,
   Droplet, Coffee, Phone, Tv, Home, Umbrella, Sofa, Star as StarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AmenitySelectorProps {
   control: any;
   setValue: any;
   watch: any;
}

// Icon mapping
const iconComponents: Record<string, any> = {
   wifi: Wifi,
   pool: Waves,
   spa: Sparkles,
   fitness: Dumbbell,
   beach: StarIcon,
   transport: Car,
   wind: Wind,
   lock: Lock,
   scissors: Scissors,
   droplet: Droplet,
   coffee: Coffee,
   phone: Phone,
   tv: Tv,
   home: Home,
   umbrella: Umbrella,
   sofa: Sofa,
   sparkles: Sparkles,
};

// Predefined amenity options organized by category
const amenityOptions = [
   { label: 'Free Wi-Fi', value: 'Free Wi-Fi', category: 'room', icon_name: 'wifi' },
   { label: 'Air Conditioning', value: 'Air Conditioning', category: 'room', icon_name: 'wind' },
   { label: 'In-room Safe', value: 'In-room Safe', category: 'room', icon_name: 'lock' },
   { label: 'Hair Dryer', value: 'Hair Dryer', category: 'room', icon_name: 'scissors' },
   { label: 'Iron & Board', value: 'Iron & Board', category: 'room', icon_name: 'sparkles' },
   { label: 'Hot & Cold Water', value: 'Hot & Cold Water', category: 'room', icon_name: 'droplet' },
   { label: 'TV', value: 'TV', category: 'room', icon_name: 'tv' },
   { label: 'Mini Fridge', value: 'Mini Fridge', category: 'room', icon_name: 'sparkles' },
   { label: 'Telephone', value: 'Telephone', category: 'room', icon_name: 'phone' },
   { label: 'Veranda', value: 'Veranda', category: 'room', icon_name: 'home' },
   { label: 'Tea & Coffee', value: 'Tea & Coffee', category: 'dining', icon_name: 'coffee' },
   { label: 'Infinity Pool', value: 'Infinity Pool', category: 'wellness', icon_name: 'pool' },
   { label: 'Spa & Wellness', value: 'Spa & Wellness', category: 'wellness', icon_name: 'spa' },
   { label: 'Gym & Fitness', value: 'Gym & Fitness', category: 'wellness', icon_name: 'fitness' },
   { label: 'Private Beach', value: 'Private Beach', category: 'beach', icon_name: 'beach' },
   { label: 'Beach Towels', value: 'Beach Towels', category: 'beach', icon_name: 'umbrella' },
   { label: 'Outdoor Seating', value: 'Outdoor Seating', category: 'beach', icon_name: 'sofa' },
   { label: 'Airport Transfer', value: 'Airport Transfer', category: 'transport', icon_name: 'transport' },
];

const amenityCategories = [
   { id: 'room', label: 'Room Comforts' },
   { id: 'wellness', label: 'Wellness & Leisure' },
   { id: 'beach', label: 'Beach & Outdoor' },
   { id: 'dining', label: 'Dining & Pantry' },
   { id: 'transport', label: 'Transport & Services' },
];

export default function AmenitySelector({ control, setValue, watch }: AmenitySelectorProps) {
   const [customAmenity, setCustomAmenity] = useState('');
   const [iconSearch, setIconSearch] = useState('');
   const [activeAmenityIndex, setActiveAmenityIndex] = useState<number | null>(null);
   const [activeAmenityCategory, setActiveAmenityCategory] = useState('room');

   const { fields: amenityFields, append: appendAmenity, remove: removeAmenity } = useFieldArray({
      control,
      name: 'amenities' as any,
   });

   const amenities = watch('amenities') || [];

   const getAmenityIconComponent = (iconName: string) => {
      const Icon = iconComponents[iconName] || Sparkles;
      return <Icon className="h-4 w-4" />;
   };

   const iconLibrary = [
      { label: 'Wi-Fi', icon_name: 'wifi' },
      { label: 'Pool', icon_name: 'pool' },
      { label: 'Spa', icon_name: 'spa' },
      { label: 'Fitness', icon_name: 'fitness' },
      { label: 'Beach', icon_name: 'beach' },
      { label: 'Transport', icon_name: 'transport' },
      { label: 'Air', icon_name: 'wind' },
      { label: 'Safe', icon_name: 'lock' },
      { label: 'Scissors', icon_name: 'scissors' },
      { label: 'Hot Water', icon_name: 'droplet' },
      { label: 'Coffee', icon_name: 'coffee' },
      { label: 'Phone', icon_name: 'phone' },
      { label: 'TV', icon_name: 'tv' },
      { label: 'Home', icon_name: 'home' },
      { label: 'Umbrella', icon_name: 'umbrella' },
      { label: 'Sofa', icon_name: 'sofa' },
      { label: 'Sparkles', icon_name: 'sparkles' },
   ];

   const filteredIconLibrary = iconLibrary.filter((item) =>
      item.label.toLowerCase().includes(iconSearch.trim().toLowerCase()) ||
      item.icon_name.toLowerCase().includes(iconSearch.trim().toLowerCase())
   );

   const categoryOptions = amenityOptions.filter((option) => option.category === activeAmenityCategory);

   const handleAddCustomAmenity = () => {
      const text = customAmenity.trim();
      if (!text) return;
      const exists = amenities.some((item: any) => item?.amenity_name?.toLowerCase() === text.toLowerCase());
      if (exists) {
         setCustomAmenity('');
         return;
      }
      appendAmenity({ amenity_name: text, category: 'custom', icon_name: 'sparkles', is_featured: false });
      setCustomAmenity('');
   };

   const toggleAmenity = (option: { label: string; value: string; category: string; icon_name: string }) => {
      const index = amenityFields.findIndex(
         (field) => field.amenity_name?.toLowerCase() === option.value.toLowerCase()
      );
      if (index >= 0) {
         removeAmenity(index);
      } else {
         appendAmenity({
            amenity_name: option.value,
            category: option.category,
            icon_name: option.icon_name,
            is_featured: true,
         });
      }
   };

   return (
      <Card className="rounded-[2.5rem] border-0 shadow-lg overflow-hidden bg-white">
         <div className="p-10 space-y-8">
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
               </div>
               <div>
                  <h3 className="font-serif text-2xl font-bold">Resort Features & Amenities</h3>
                  <p className="text-slate-500 text-sm">Select common resort highlights or add your own bespoke luxury offerings.</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                     {amenityCategories.map((category) => (
                        <button
                           key={category.id}
                           type="button"
                           onClick={() => setActiveAmenityCategory(category.id)}
                           className={cn(
                              "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition",
                              activeAmenityCategory === category.id
                                 ? 'border-emerald-500 bg-emerald-600 text-white'
                                 : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                           )}
                        >
                           {category.label}
                        </button>
                     ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {categoryOptions.map((option) => {
                        const selected = amenities.some(
                           (item: any) => item?.amenity_name?.toLowerCase() === option.value.toLowerCase()
                        );
                        return (
                           <button
                              key={option.value}
                              type="button"
                              onClick={() => toggleAmenity(option)}
                              className={cn(
                                 "rounded-3xl border px-4 py-4 text-left transition",
                                 selected
                                    ? 'border-emerald-400 bg-emerald-50 shadow-sm'
                                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                              )}
                           >
                              <div className="flex items-center justify-between gap-3">
                                 <div>
                                    <p className="font-semibold text-slate-900">{option.label}</p>
                                    <p className="text-xs text-slate-500 mt-1">{option.category}</p>
                                 </div>
                                 <div className={cn(
                                    "h-9 w-9 rounded-2xl flex items-center justify-center",
                                    selected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                                 )}>
                                    {getAmenityIconComponent(option.icon_name)}
                                 </div>
                              </div>
                           </button>
                        );
                     })}
                  </div>
               </div>

               <div className="space-y-3">
                  <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Add a Custom Amenity</Label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                     <Input
                        value={customAmenity}
                        onChange={(e) => setCustomAmenity(e.target.value)}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomAmenity();
                           }
                        }}
                        placeholder="Sunset Yoga Pavilion, Private Butler Service, Overwater Spa"
                        className="rounded-2xl border-slate-200 bg-slate-50 focus:border-emerald-500 h-12"
                     />
                     <Button type="button" onClick={handleAddCustomAmenity} className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white h-12 whitespace-nowrap">
                        Add Amenity
                     </Button>
                  </div>
                  <p className="text-xs text-slate-400">Press Enter or click Add Amenity to save a custom luxury feature.</p>
               </div>

               {amenityFields.length > 0 && (
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <h4 className="text-lg font-semibold text-slate-900">Selected Amenities</h4>
                           <p className="text-sm text-slate-500">Mark the most important features as Featured and customize icons directly.</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{amenityFields.length} items</span>
                     </div>
                     <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {amenityFields.map((field: any, index: number) => (
                           <div
                              key={field.id}
                              className={cn(
                                 "rounded-[2rem] border px-4 py-4 transition-all",
                                 activeAmenityIndex === index
                                    ? 'border-emerald-400 bg-emerald-50/70 shadow-lg'
                                    : 'border-slate-200 bg-slate-50'
                              )}
                           >
                              <div className="flex items-start justify-between gap-3">
                                 <div className="flex items-center gap-3">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                       {getAmenityIconComponent(field.icon_name || 'sparkles')}
                                    </span>
                                    <div>
                                       <p className="font-semibold text-slate-900">{field.amenity_name}</p>
                                       <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{field.category || 'Feature'}</p>
                                    </div>
                                 </div>
                                 <button type="button" onClick={() => removeAmenity(index)} className="text-slate-400 hover:text-red-500">
                                    <span className="sr-only">Remove</span>
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                 </button>
                              </div>

                              <div className="mt-4 flex flex-wrap items-center gap-4">
                                 <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                                    <Checkbox
                                       checked={!!field.is_featured}
                                       onCheckedChange={(checked) => setValue(`amenities.${index}.is_featured`, !!checked)}
                                    />
                                    Featured
                                 </label>
                                 <button
                                    type="button"
                                    onClick={() => setActiveAmenityIndex(index)}
                                    className={cn(
                                       "rounded-full border px-4 py-2 text-sm font-semibold transition",
                                       activeAmenityIndex === index
                                          ? 'border-emerald-500 bg-emerald-600 text-white'
                                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                                    )}
                                 >
                                    Change Icon
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>

                     {activeAmenityIndex !== null && (
                        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                 <h5 className="text-sm font-semibold text-slate-900">Icon library</h5>
                                 <p className="text-xs text-slate-500">Search and assign a new icon for the highlighted amenity.</p>
                              </div>
                              <Input
                                 value={iconSearch}
                                 onChange={(event) => setIconSearch(event.target.value)}
                                 placeholder="Search icons"
                                 className="max-w-sm rounded-2xl border-slate-200 bg-white focus:border-emerald-500"
                              />
                           </div>
                           <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                              {filteredIconLibrary.map((icon) => (
                                 <button
                                    key={icon.icon_name}
                                    type="button"
                                    onClick={() => {
                                       setValue(`amenities.${activeAmenityIndex}.icon_name`, icon.icon_name);
                                    }}
                                    className="group rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                                 >
                                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-700">
                                       {getAmenityIconComponent(icon.icon_name)}
                                    </span>
                                    <span className="mt-2 block truncate text-[0.65rem] text-center uppercase tracking-[0.15em] text-slate-500 group-hover:text-emerald-700">
                                       {icon.label}
                                    </span>
                                 </button>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               )}
            </div>
         </div>
      </Card>
   );
}
