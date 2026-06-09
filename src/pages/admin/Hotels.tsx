import { useState } from 'react';
import { Plus, Pencil, Trash2, Star, MapPin, DollarSign, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/AdminLayout';
import { useHotels, useCreateHotel, useUpdateHotel, useDeleteHotel, useHotel } from '@/hooks/useHotels';
import { Hotel } from '@/types/hotel';

export default function Hotels() {
  const { data: hotels = [], isLoading } = useHotels();
  const createHotel = useCreateHotel();
  const updateHotel = useUpdateHotel();
  const deleteHotel = useDeleteHotel();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);

  const handleAddHotel = () => { setEditingHotelId(null); setIsDialogOpen(true); };
  const handleEditHotel = (id: string) => { setEditingHotelId(id); setIsDialogOpen(true); };

  const handleSave = async (hotel: any) => {
    editingHotelId ? await updateHotel.mutateAsync({ id: editingHotelId, hotel }) : await createHotel.mutateAsync(hotel);
    setIsDialogOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Resort Inventory</h1>
            <p className="text-slate-500 font-light">Curate and manage your property collection.</p>
          </div>
          <Button onClick={handleAddHotel} className="bg-emerald-900 hover:bg-emerald-950 rounded-full shadow-lg">
            <Plus className="h-4 w-4 mr-2" /> Add New Resort
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <Card key={hotel.id} className="group rounded-3xl border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center shadow-sm">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                    <span className="text-xs font-bold">{hotel.star_rating}.0</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">{hotel.name}</h3>
                  <div className="flex items-center text-slate-500 text-sm mb-4">
                    <MapPin className="h-3 w-3 mr-1" /> {hotel.location}
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                    <span className="text-lg font-bold text-emerald-700">${hotel.price} <span className="text-xs font-normal text-slate-400">/ night</span></span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEditHotel(hotel.id)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={() => deleteHotel.mutate(hotel.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <HotelDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} hotelId={editingHotelId} onSave={handleSave} />
    </AdminLayout>
  );
}

function HotelDialog({ isOpen, onClose, hotelId, onSave }: any) {
  const { data: hotel } = useHotel(hotelId || '');
  const [formData, setFormData] = useState<any>({});

  // ... (Keep existing state management logic)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-3xl">
        <div className="p-6 border-b bg-slate-50/50">
          <DialogTitle className="text-xl font-serif"> {hotelId ? 'Edit Resort' : 'Register New Resort'}</DialogTitle>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-8">
          {/* Section: Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600">Essential Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
              <div><Label>Category</Label><Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} /></div>
              <div><Label>Price ($)</Label><Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></div>
            </div>
          </div>

          {/* Section: Visuals */}
          <div className="space-y-4 border-t pt-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600">Media Assets</h4>
            <div><Label>Thumbnail URL</Label><Input value={formData.images?.[0] || ''} onChange={(e) => setFormData({ ...formData, images: [e.target.value] })} /></div>
            <div><Label className="text-emerald-700">Cinemagraph URL</Label><Input value={formData.cinemagraph_url || ''} onChange={(e) => setFormData({ ...formData, cinemagraph_url: e.target.value })} /></div>
          </div>

          {/* Section: Description */}
          <div className="space-y-4 border-t pt-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600">Content</h4>
            <div><Label>Short Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
          </div>
        </div>

        <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(formData)} className="bg-emerald-900">Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}