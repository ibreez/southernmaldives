import { FieldArrayWithId, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import type { HotelRoom } from '@/types/hotel';

interface AccommodationManagerProps {
  fields: FieldArrayWithId<any, 'rooms'>[];
  append: (value: any) => void;
  remove: (index: number) => void;
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
}

export default function AccommodationManager({ fields, append, remove, register, watch }: AccommodationManagerProps) {
  const rooms = watch('rooms') || [];

  return (
    <Card className="rounded-[2.5rem] border-0 shadow-lg overflow-hidden bg-white">
      <div className="p-10 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <ImageIcon className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold">Accommodation Manager</h3>
              <p className="text-sm text-slate-500">Add room types, upload a primary image, and keep accommodation details aligned with your resort listing.</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ room_name: '', room_type: '', description: '', max_guests: 2, bed_type: '', room_size: null, price: 0, amenities: [], images: [''], is_available: true })}
            className="rounded-full border-slate-200 text-xs font-bold uppercase tracking-widest"
          >
            <Plus className="h-3 w-3 mr-2" /> Add Room
          </Button>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => {
            const imageUrl = rooms[index]?.images?.[0] ?? '';

            return (
              <div key={field.id} className="group rounded-[2rem] border border-slate-100 bg-slate-50 p-6 transition-shadow hover:shadow-xl">
                <div className="flex flex-col gap-6 md:gap-8">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-400 font-black">Room #{index + 1}</p>
                      <h4 className="font-serif text-xl font-bold text-slate-900 mt-2">Accommodation Entry</h4>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(index)}
                      className="rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Room Name</Label>
                          <Input
                            {...register(`rooms.${index}.room_name`)}
                            placeholder="Lagoon Villa"
                            className="rounded-xl border-slate-200 bg-white h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Room Type</Label>
                          <Input
                            {...register(`rooms.${index}.room_type`)}
                            placeholder="Water Villa"
                            className="rounded-xl border-slate-200 bg-white h-12"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Price Per Night ($)</Label>
                          <Input
                            type="number"
                            {...register(`rooms.${index}.price`, { valueAsNumber: true })}
                            className="rounded-xl border-slate-200 bg-white h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Max Guests</Label>
                          <Input
                            type="number"
                            {...register(`rooms.${index}.max_guests`, { valueAsNumber: true })}
                            className="rounded-xl border-slate-200 bg-white h-12"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Bed Type</Label>
                          <Input
                            {...register(`rooms.${index}.bed_type`)}
                            placeholder="King Bed"
                            className="rounded-xl border-slate-200 bg-white h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Room Size (m²)</Label>
                          <Input
                            type="number"
                            {...register(`rooms.${index}.room_size`, { valueAsNumber: true })}
                            className="rounded-xl border-slate-200 bg-white h-12"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Description</Label>
                        <Textarea
                          {...register(`rooms.${index}.description`)}
                          rows={4}
                          placeholder="Describe the room experience, views, and featured amenities."
                          className="rounded-[1.5rem] border-slate-200 bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Primary Image URL</Label>
                        <Input
                          {...register(`rooms.${index}.images.0`)}
                          placeholder="https://images.unsplash.com/..."
                          className="rounded-xl border-slate-200 bg-white h-12"
                        />
                      </div>

                      <div className="rounded-[1.75rem] overflow-hidden border border-slate-200 bg-slate-100 h-72">
                        {imageUrl ? (
                          <img src={imageUrl} alt={`Room ${index + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
                            <ImageIcon className="h-10 w-10" />
                            <p className="text-sm">Enter an image URL to preview the room.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-200" />
                </div>
              </div>
            );
          })}

          {fields.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              <p className="font-semibold">No accommodation entries yet.</p>
              <p className="text-sm mt-2">Use the Add Room button to create the first room type and publish it with the resort listing.</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
