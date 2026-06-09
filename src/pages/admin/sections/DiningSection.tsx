"use client";

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Coffee, Plus, X, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { uploadImage, isValidImageFile } from '@/lib/cloudinaryService';
import type { Restaurant, RestaurantSchedule } from '@/types/dining';

export default function DiningSection() {
   const { control, register, setValue, watch, getValues } = useFormContext();

   const { fields: restaurantFields, append: appendRestaurant, remove: removeRestaurant } = useFieldArray({
      control,
      name: 'dining.restaurants',
   });

   const { fields: breakfastFields, append: appendBreakfast, remove: removeBreakfast } = useFieldArray({
      control,
      name: 'dining.breakfast_types',
   });

   const dining = watch('dining') || {};

   // Helper to add schedule for a specific restaurant index
   const addSchedule = (index: number) => {
      const schedules = (getValues(`dining.restaurants.${index}.schedules`) as RestaurantSchedule[]) || [];
      setValue(`dining.restaurants.${index}.schedules`, [
        ...schedules,
        { label: '', start: '', end: '' },
      ] as any);
   };

   const removeSchedule = (index: number, schedIndex: number) => {
      const schedules = (getValues(`dining.restaurants.${index}.schedules`) as RestaurantSchedule[]) || [];
      const updated = schedules.filter((_: RestaurantSchedule, i: number) => i !== schedIndex);
      setValue(`dining.restaurants.${index}.schedules`, updated as any);
   };

   return (
      <div className="space-y-8">
         {/* Culinary Heading Customization */}
         <Card className="rounded-[2.5rem] border-0 shadow-lg overflow-hidden bg-white">
            <div className="p-10 space-y-8">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-amber-50 rounded-lg flex items-center justify-center">
                     <Coffee className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                     <h3 className="font-serif text-2xl font-bold">Dining & Pantry</h3>
                     <p className="text-slate-500 text-sm">Manage resort dining, restaurant profiles, breakfast options, and bar details.</p>
                  </div>
               </div>

               {/* Culinary Heading Customization */}
               <div className="grid grid-cols-1 gap-6 rounded-2xl bg-amber-50/50 p-6 border border-amber-100">
                  <div className="space-y-2">
                     <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-500">Section Label</Label>
                     <Input
                        {...register('dining.section_label')}
                        placeholder="Culinary"
                        className="rounded-xl border-slate-200 bg-white focus:border-amber-500 h-12"
                     />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-500">Main Heading</Label>
                        <Input
                           {...register('dining.heading_main')}
                           placeholder="Island"
                           className="rounded-xl border-slate-200 bg-white focus:border-amber-500 h-12"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-500">Italic Heading</Label>
                        <Input
                           {...register('dining.heading_italic')}
                           placeholder="Flavors"
                           className="rounded-xl border-slate-200 bg-white focus:border-amber-500 h-12"
                        />
                     </div>
                  </div>
                  {(watch('dining.heading_main') || watch('dining.heading_italic')) && (
                     <div className="mt-2 p-4 bg-white rounded-xl border border-amber-200">
                        <p className="text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-3">Heading Preview</p>
                        <h2 className="font-serif text-3xl text-slate-900 leading-tight">
                           {watch('dining.heading_main') || 'Island'} <span className="italic text-amber-600/40 font-light">
                              {watch('dining.heading_italic') || 'Flavors'}
                           </span>
                        </h2>
                     </div>
                  )}
               </div>

               <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Dining Hero Image URL</Label>
                        <Input
                           {...register('dining.hero_image_url')}
                           placeholder="https://images.unsplash.com/food-hero.jpg"
                           className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-amber-500 h-12 px-6"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Dining Main Description</Label>
                        <Textarea
                           {...register('dining.main_description')}
                           rows={5}
                           placeholder="Describe the resort's culinary philosophy, signature dining experiences, and island flavours."
                           className="rounded-[2rem] border-slate-100 bg-slate-50 focus:bg-white focus:border-amber-500 p-6 leading-relaxed resize-none"
                        />
                     </div>
                     {watch('dining.hero_image_url') && (
                        <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-50">
                           <img
                              src={watch('dining.hero_image_url')}
                              alt="Dining hero preview"
                              className="w-full h-64 object-cover"
                           />
                        </div>
                     )}
                  </div>
               </div>

               {/* Restaurant Cards */}
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="font-serif text-xl font-bold">Restaurants</h3>
                        <p className="text-slate-500 text-sm">Add each dining outlet with type, cuisine, images, and operating schedules.</p>
                     </div>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => appendRestaurant({ name: '', type: 'Signature Dining', cuisine: '', images: [], schedules: [{ label: 'Daily', start: '', end: '' }], menu_link: '' })}
                        className="rounded-full border-slate-200 text-xs font-bold uppercase tracking-widest"
                     >
                        <Plus className="h-3 w-3 mr-2" /> Add Restaurant
                     </Button>
                  </div>

                  <div className="space-y-4">
                     {restaurantFields.map((field, index) => (
                        <div key={field.id} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                           <div className="flex items-center justify-between gap-4 mb-4">
                              <div className="text-sm font-semibold text-slate-900">Restaurant {index + 1}</div>
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeRestaurant(index)}>
                                 <X className="h-4 w-4" />
                              </Button>
                           </div>
                           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                 <Label>Name *</Label>
                                 <Input
                                    {...register(`dining.restaurants.${index}.name` as any)}
                                    placeholder="Ocean Grill"
                                    className="rounded-xl border-slate-200 bg-white h-12"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label>Type *</Label>
                                 <Input
                                    {...register(`dining.restaurants.${index}.type` as any)}
                                    placeholder="Signature Dining"
                                    className="rounded-xl border-slate-200 bg-white h-12"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label>Cuisine *</Label>
                                 <Input
                                    {...register(`dining.restaurants.${index}.cuisine` as any)}
                                    placeholder="Seafood"
                                    className="rounded-xl border-slate-200 bg-white h-12"
                                 />
                              </div>

                              {/* Restaurant Images - full width */}
                              <div className="lg:col-span-3 space-y-3">
                                 <Label>Restaurant Images</Label>
                                 <div className="grid grid-cols-1 gap-3">
                                    {/* Image URL Textarea */}
                                    {(() => {
                                      const rawImages = watch(`dining.restaurants.${index}.images`);
                                      const textareaValue = Array.isArray(rawImages)
                                        ? rawImages.join('\n')
                                        : typeof rawImages === 'string'
                                          ? rawImages
                                          : '';
                                      return (
                                        <Textarea
                                          {...register(`dining.restaurants.${index}.images` as any)}
                                          placeholder="Paste image URLs, one per line or comma separated..."
                                          rows={2}
                                          value={textareaValue}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const images = value
                                              .split(/[\n,]+/)
                                              .map((url: string) => url.trim())
                                              .filter(Boolean);
                                            setValue(`dining.restaurants.${index}.images`, images as any);
                                          }}
                                          className="rounded-xl border-slate-200 bg-white"
                                        />
                                      );
                                    })()}

                                   {/* Image Preview */}
                                   {(() => {
                                     const imgs = watch(`dining.restaurants.${index}.images`) as string[] | string | undefined;
                                     const normalizedImgs = Array.isArray(imgs)
                                       ? imgs
                                       : typeof imgs === 'string'
                                         ? imgs.split(/[\n,]+/).map((url: string) => url.trim()).filter(Boolean)
                                         : [];
                                     return normalizedImgs.length > 0 ? (
                                       <div className="flex flex-wrap gap-2 mt-2">
                                         {normalizedImgs.map((imgUrl: string, imgIdx: number) => (
                                           <div key={imgIdx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group">
                                             <img
                                               src={imgUrl}
                                               alt={`Restaurant image ${imgIdx + 1}`}
                                               className="w-full h-full object-cover"
                                               onError={(e) => {
                                                 (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                                               }}
                                             />
                                             <button
                                               type="button"
                                               onClick={() => {
                                                 const current = watch(`dining.restaurants.${index}.images`);
                                                 let arr: string[];
                                                 if (Array.isArray(current)) {
                                                   arr = current.filter((_: string, i: number) => i !== imgIdx);
                                                 } else if (typeof current === 'string') {
                                                   arr = current.split(/[\n,]+/).map((s: string) => s.trim()).filter(Boolean).filter((_: string, i: number) => i !== imgIdx);
                                                 } else {
                                                   arr = [];
                                                 }
                                                 setValue(`dining.restaurants.${index}.images`, arr as any);
                                               }}
                                               className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                             >
                                               <X className="h-3 w-3" />
                                             </button>
                                           </div>
                                         ))}
                                       </div>
                                      ) : null;
                                    })()}

                                    {/* Upload Button */}
                                    <div className="relative">
                                       <input
                                          type="file"
                                          multiple
                                          accept="image/*"
                                          onChange={async (e) => {
                                            const files = e.target.files;
                                            if (!files || files.length === 0) return;
                                            try {
                                              const newImages: string[] = [];
                                              for (let i = 0; i < files.length; i++) {
                                                const file = files[i];
                                                if (!isValidImageFile(file)) {
                                                  alert('Please upload valid image files (max 10MB, JPEG/PNG/WebP)');
                                                  return;
                                                }
                                                try {
                                                  const response = await uploadImage(file);
                                                  newImages.push(response.secure_url);
                                                } catch (err) {
                                                  alert('Failed to upload one or more images');
                                                  return;
                                                }
                                              }
                                              const current = watch(`dining.restaurants.${index}.images`) as string[] || [];
                                              setValue(`dining.restaurants.${index}.images`, [...current, ...newImages] as any);
                                            } catch (error) {
                                              alert('Failed to upload images');
                                            }
                                          }}
                                          className="hidden"
                                          id={`restaurant-upload-${index}`}
                                       />
                                       <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => document.getElementById(`restaurant-upload-${index}`)?.click()}
                                          className="w-full"
                                       >
                                          <Upload className="h-4 w-4 mr-2" />
                                          Upload Images
                                       </Button>
                                       <p className="text-[10px] text-slate-500 mt-1">Max 10MB, JPEG/PNG/WebP. Images upload to Cloudinary.</p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Dynamic Schedules Section */}
                           <div className="mt-6 pt-4 border-t border-slate-200">
                              <div className="flex items-center justify-between mb-3">
                                 <h4 className="text-sm font-semibold text-slate-700">Operating Schedules *</h4>
                                 <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addSchedule(index)}
                                    className="rounded-full text-xs"
                                 >
                                    <Plus className="h-3 w-3 mr-1" /> Add Schedule
                                 </Button>
                              </div>

                              {(watch(`dining.restaurants.${index}.schedules`) || []).map((schedule: any, schedIdx: number) => (
                                 <div key={schedIdx} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-3 bg-white rounded-lg border border-slate-100">
                                    <Input
                                       {...register(`dining.restaurants.${index}.schedules.${schedIdx}.label` as any)}
                                       placeholder="Label (e.g., Lunch)"
                                       className="rounded-lg border-slate-200 bg-white h-10 text-sm"
                                    />
                                    <Input
                                       {...register(`dining.restaurants.${index}.schedules.${schedIdx}.start` as any)}
                                       placeholder="HH:MM (e.g., 12:00)"
                                       className="rounded-lg border-slate-200 bg-white h-10 text-sm"
                                    />
                                    <Input
                                       {...register(`dining.restaurants.${index}.schedules.${schedIdx}.end` as any)}
                                       placeholder="HH:MM (e.g., 14:30)"
                                       className="rounded-lg border-slate-200 bg-white h-10 text-sm"
                                    />
                                    <Button
                                       type="button"
                                       size="sm"
                                       variant="ghost"
                                       onClick={() => removeSchedule(index, schedIdx)}
                                       className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                       <X className="h-4 w-4" />
                                    </Button>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Breakfast Options */}
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="font-serif text-xl font-bold">Breakfast Options</h3>
                        <p className="text-slate-500 text-sm">Capture breakfast packages and menu highlights.</p>
                     </div>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => appendBreakfast({ name: '', items: [] })}
                        className="rounded-full border-slate-200 text-xs font-bold uppercase tracking-widest"
                     >
                        <Plus className="h-3 w-3 mr-2" /> Add Breakfast
                     </Button>
                  </div>

                  <div className="space-y-4">
                     {breakfastFields.map((field, index) => (
                        <div key={field.id} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                           <div className="flex items-center justify-between gap-4 mb-4">
                              <div className="text-sm font-semibold text-slate-900">Option {index + 1}</div>
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeBreakfast(index)}>
                                 <X className="h-4 w-4" />
                              </Button>
                           </div>
                           <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-2">
                                 <Label>Name</Label>
                                 <Input
                                    {...register(`dining.breakfast_types.${index}.name` as any)}
                                    placeholder="Continental Breakfast"
                                    className="rounded-xl border-slate-200 bg-white h-12"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label>Items (comma separated)</Label>
                                 <Textarea
                                    value={(watch(`dining.breakfast_types.${index}.items`) as string[] || []).join(', ')}
                                    onChange={(e) => {
                                       const items = e.target.value
                                          .split(',')
                                          .map((item: string) => item.trim())
                                          .filter(Boolean);
                                       setValue(`dining.breakfast_types.${index}.items`, items);
                                    }}
                                    placeholder="Croissants, Fruit, Coffee, Toast"
                                    rows={2}
                                    className="rounded-[2rem] border-slate-200 bg-white p-4"
                                 />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </Card>

         {/* Bar Info Section */}
         <Card className="rounded-[2.5rem] border-0 shadow-lg overflow-hidden bg-white">
            <div className="p-10 space-y-6">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center">
                     <Coffee className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                     <h3 className="font-serif text-2xl font-bold">Bar Information</h3>
                     <p className="text-slate-500 text-sm">Share bar specialties and whether room service is available.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>Section Header</Label>
                     <Input
                        {...register('dining.bar_info.section_label')}
                        placeholder="Mixology & Spirits"
                        className="rounded-xl border-slate-200 bg-white h-12"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>Bar Name</Label>
                     <Input
                        {...register('dining.bar_info.name')}
                        placeholder="The Island Bar"
                        className="rounded-xl border-slate-200 bg-white h-12"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>Hours</Label>
                     <Input
                        {...register('dining.bar_info.hours')}
                        placeholder="11:00 - 23:00"
                        className="rounded-xl border-slate-200 bg-white h-12"
                     />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                     <Label>Specialties</Label>
                     <Textarea
                        {...register('dining.bar_info.specialties')}
                        placeholder="Tropical mojitos, signature island punch..."
                        rows={3}
                        className="rounded-[2rem] border-slate-200 bg-white p-4"
                     />
                  </div>
                  <div className="flex items-center gap-3 md:col-span-2">
                     <Checkbox
                        checked={!!watch('dining.room_service')}
                        onCheckedChange={(checked) => setValue('dining.room_service', !!checked)}
                     />
                     <Label>Room service available</Label>
                  </div>
               </div>
            </div>
         </Card>
      </div>
   );
}
