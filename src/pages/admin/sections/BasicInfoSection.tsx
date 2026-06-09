"use client";

import { useFormContext, useWatch } from 'react-hook-form';
import { DollarSign, Star, CheckCircle2, Info, Sparkles, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function BasicInfoSection() {
   const { register, watch } = useFormContext();

   const watchFields = {
      name: watch('name'),
      location: watch('location'),
      price: watch('price'),
      description: watch('description'),
   };

   // Compute completion percentage
   const completionPercentage = (() => {
      const required = ['name', 'location', 'price', 'description'];
      const filled = required.filter(key => !!watchFields[key]).length;
      return Math.round((filled / required.length) * 100);
   })();

   return (
      <div className="space-y-8">
         {/* Identity Completeness Card */}
         <Card className="rounded-[2.5rem] border-0 shadow-lg overflow-hidden bg-white">
            <div className="p-10 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-emerald-600" />
                     </div>
                     <h3 className="font-serif text-2xl font-bold">Resort Identity</h3>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-xs text-slate-400">Profile Strength</span>
                     <Progress value={completionPercentage} className="h-2 w-32 bg-slate-100" />
                     <span className="text-sm font-bold text-emerald-600">{completionPercentage}%</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Resort Name</Label>
                     <Input
                        {...register('name', { required: true })}
                        placeholder="e.g. Equatorial Palms Resort"
                        className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 h-12 transition-all"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Island/Atoll</Label>
                     <Input
                        {...register('location', { required: true })}
                        placeholder="e.g. Gan Island, Addu Atoll"
                        className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 h-12 transition-all"
                     />
                  </div>
                <div className="space-y-2">
                <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Luxury Category</Label>
                <Input
                {...register('category')}
                placeholder="e.g. Private Island"
                className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 h-12 transition-all"
                />
                </div>
                <div className="space-y-2">
                <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Starting Price ($)</Label>
                <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="pl-10 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 h-12 transition-all"
                />
                </div>
                </div>
                <div className="space-y-2">
                <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Distance from Airport (km)</Label>
                <Input
                type="number"
                {...register('distance_from_airport', { valueAsNumber: true })}
                placeholder="e.g. 15"
                className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 h-12 transition-all"
                />
                </div>
                <div className="space-y-2">
                <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Guest Rating (out of 5)</Label>
                <Input
                type="number"
                step="0.1"
                {...register('guest_rating', { valueAsNumber: true })}
                placeholder="e.g. 4.8"
                className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 h-12 transition-all"
                />
                </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Marketing Tagline</Label>
                  <Input
                     {...register('description')}
                     placeholder="Summarize the resort in one breathtaking sentence..."
                     className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500"
                  />
               </div>
            </div>
         </Card>

         {/* Storytelling Section */}
         <Card className="rounded-[2.5rem] border-0 shadow-lg overflow-hidden bg-white">
            <div className="p-10 space-y-8">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-teal-50 rounded-lg flex items-center justify-center">
                     <Sparkles className="h-4 w-4 text-teal-600" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold">Compelling Storytelling</h3>
               </div>

               <div className="space-y-8">
                  <div className="space-y-2">
                     <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Hero Tagline / Short Summary</Label>
                     <Input
                        {...register('description')}
                        placeholder="A brief, evocative sentence that appears on search cards."
                        className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 h-12 px-6"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Main Experience Description</Label>
                     <Textarea
                        {...register('long_description')}
                        rows={10}
                        placeholder="The full, immersive story of the resort. Use paragraphs to describe the atmosphere, architecture, and soul of the island."
                        className="rounded-[2rem] border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 p-8 leading-relaxed resize-none"
                     />
                   </div>

                   <Separator className="my-4" />

                   <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-6">Vision Section Heading</h4>
                      <p className="text-xs text-slate-500 mb-6">Customize the Vision section heading that appears on the hotel detail page.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Vision Main Text</Label>
                            <Input
                               {...register('vision_main_text')}
                               placeholder="e.g., Pristine"
                               maxLength={255}
                               className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 h-12 px-6"
                            />
                            <p className="text-[0.65rem] text-slate-400">This appears before the italic text</p>
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Vision Italic Text</Label>
                            <Input
                               {...register('vision_italic_text')}
                               placeholder="e.g., Elegance"
                               maxLength={255}
                               className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 h-12 px-6"
                            />
                            <p className="text-[0.65rem] text-slate-400">This appears in italics</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Hide Culinary Section</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          {...register('hide_culinary_section')}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-600">Hide dining/restaurant section on hotel detail page</span>
                      </div>
                   </div>
               </div>
            </div>
         </Card>

         {/* Quick Tips Card */}
         <Card className="rounded-[2.5rem] border-0 shadow-lg overflow-hidden bg-emerald-900 text-emerald-50">
            <div className="p-8 space-y-4">
               <h4 className="font-serif text-lg font-bold mb-4">Quick Tips</h4>
               <ul className="space-y-4 text-sm font-light text-emerald-100/80">
                  <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" /> High-res photos increase bookings by 30%.</li>
                  <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" /> Accurate distance from airport prevents guest complaints.</li>
                  <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" /> Use vivid, sensory language in your resort description.</li>
               </ul>
            </div>
         </Card>
      </div>
   );
}
