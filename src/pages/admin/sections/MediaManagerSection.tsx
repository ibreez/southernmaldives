"use client";

import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { Plus, Trash2, Image as ImageIcon, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function MediaManagerSection() {
   const { control, register, watch, formState: { errors } } = useFormContext();

   const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
      control,
      name: 'images' as any,
   });

   const images = watch('images') || [];

   return (
      <div className="space-y-8">
         <Card className="rounded-[2.5rem] border-0 shadow-lg overflow-hidden bg-white">
            <div className="p-10 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-indigo-600" />
                     </div>
                     <h3 className="font-serif text-2xl font-bold">Visual Collection</h3>
                  </div>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => appendImage('')}
                     className="rounded-full border-slate-200 text-xs font-bold uppercase tracking-widest"
                  >
                     <Plus className="h-3 w-3 mr-2" /> Add Image URL
                  </Button>
               </div>

               {/* Cinemagraph Section */}
               <div className="group relative bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:border-emerald-200 transition-all">
                  <div className="space-y-2">
                     <Label className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Video className="h-3 w-3" />
                        Cinemagraph URL (Optional)
                     </Label>
                     <div className="flex gap-4 flex-col md:flex-row md:items-start">
                        <div className="flex-1 space-y-2 w-full">
                           <Input
                              {...register('cinemagraph_url', {
                                 validate: (value) => {
                                    if (!value) return true;
                                    if (!value.endsWith('.mp4') && !value.endsWith('.webm') && !value.includes('cloudinary')) {
                                       return 'Cinemagraph must be a .mp4, .webm, or Cloudinary URL';
                                    }
                                    return true;
                                 }
                              })}
                              className="rounded-xl border-white bg-white h-11 text-xs"
                              placeholder="https://example.com/video.mp4"
                           />
                           {errors.cinemagraph_url && (
                              <p className="text-red-500 text-xs mt-1">{errors.cinemagraph_url.message}</p>
                           )}
                           <p className="text-[0.55rem] text-slate-400 font-light mt-2">
                              High-quality, short-looping video to replace the static thumbnail on listing cards. Requires at least one Image Asset as fallback.
                           </p>
                        </div>
                        {watch('cinemagraph_url') && (
                           <div className="w-full md:w-32 h-20 rounded-xl overflow-hidden bg-slate-200 border-2 border-white shadow-inner flex-shrink-0">
                              <video
                                 src={watch('cinemagraph_url')}
                                 className="w-full h-full object-cover"
                                 autoPlay loop muted playsInline
                              />
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Image Gallery */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {imageFields.map((field, index) => (
                     <div key={field.id} className="group relative bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:border-emerald-200 transition-all">
                        <div className="space-y-2">
                           <Label className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">Image Asset #{index + 1}</Label>
                           <div className="flex gap-3">
                              <Input
                                 {...register(`images.${index}` as any)}
                                 className="rounded-xl border-white bg-white h-11 text-xs"
                                 placeholder="https://images.unsplash.com/..."
                              />
                              <Button
                                 type="button"
                                 size="icon"
                                 variant="ghost"
                                 onClick={() => removeImage(index)}
                                 className="rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50"
                              >
                                 <Trash2 className="h-4 w-4" />
                              </Button>
                           </div>
                        </div>

                        {/* Preview */}
                        <div className="mt-4 aspect-video rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-inner relative">
                           {watch(`images.${index}` as any) ? (
                              <img src={watch(`images.${index}` as any)} className="w-full h-full object-cover" alt="Preview" />
                           ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                 <ImageIcon className="h-8 w-8 opacity-20" />
                              </div>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </Card>
      </div>
   );
}
