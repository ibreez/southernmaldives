"use client";

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AccommodationManager from '@/components/AccommodationManager';

export default function AccommodationSection() {
   const { control, register, watch } = useFormContext();
   const rooms = watch('rooms') || [];

   const { fields, append, remove } = useFieldArray({
      control,
      name: 'rooms' as any,
   });

   return (
      <div className="space-y-8">
         <Card className="rounded-[2.5rem] border-0 shadow-lg overflow-hidden bg-white">
            <div className="p-10 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-blue-600" />
                     </div>
                     <div>
                        <h3 className="font-serif text-2xl font-bold">Suites & Villas</h3>
                        <p className="text-slate-500 text-sm">Define accommodation types, capacity, and pricing tiers.</p>
                     </div>
                  </div>
               </div>

               {/* Room Summary Stats */}
               {rooms.length > 0 && (
                  <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                     <div className="flex-1 text-center">
                        <p className="text-2xl font-bold text-slate-900">{rooms.length}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">Room Types</p>
                     </div>
                     <div className="w-px bg-slate-200" />
                     <div className="flex-1 text-center">
                        <p className="text-2xl font-bold text-slate-900">
                           {rooms.reduce((sum: number, r: any) => sum + (parseInt(r.max_guests) || 0), 0)}
                        </p>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">Total Capacity</p>
                     </div>
                  </div>
               )}

               <AccommodationManager
                  fields={fields}
                  append={append}
                  remove={remove}
                  register={register}
                  watch={watch}
               />
            </div>
         </Card>
      </div>
   );
}

