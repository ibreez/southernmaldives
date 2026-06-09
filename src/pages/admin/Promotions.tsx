import { useState } from 'react';
import { Plus, Tag, Calendar, Edit2, Trash2, Power, PowerOff, Sparkles, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/components/AdminLayout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePromotions, useUpdatePromotion, useDeletePromotion, useCreatePromotion } from '@/hooks/usePromotions';
import { Promotion } from '@/types/promotion';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function Promotions() {
  const { data: promotions = [], isLoading } = usePromotions();
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const deletePromotion = useDeletePromotion();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotionId, setEditingPromotionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    start_date: '',
    end_date: '',
    is_active: true,
  });

  const handleAddPromotion = () => {
    setEditingPromotionId(null);
    setFormData({ title: '', description: '', image_url: '', start_date: '', end_date: '', is_active: true });
    setIsDialogOpen(true);
  };

  const handleEditPromotion = (promo: Promotion) => {
    setEditingPromotionId(promo.id);
    setFormData({
      title: promo.title,
      description: promo.description,
      image_url: promo.image_url,
      start_date: promo.start_date ? new Date(promo.start_date).toISOString().slice(0, 16) : '',
      end_date: promo.end_date ? new Date(promo.end_date).toISOString().slice(0, 16) : '',
      is_active: promo.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.image_url) {
      toast.error('Title, description, and image URL are required');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      is_active: formData.is_active,
    };

    try {
      if (editingPromotionId) {
        await updatePromotion.mutateAsync({ id: editingPromotionId, promotion: payload });
      } else {
        await createPromotion.mutateAsync(payload);
      }
      setIsDialogOpen(false);
    } catch {
      toast.error(editingPromotionId ? 'Failed to update promotion' : 'Failed to create promotion');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      await deletePromotion.mutateAsync(id);
      toast.success('Promotion deleted');
    }
  };

  const toggleStatus = async (promo: Promotion) => {
    try {
      await updatePromotion.mutateAsync({
        ...promo,
        is_active: !promo.is_active,
      });
      toast.success(`Promotion ${!promo.is_active ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update promotion');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-emerald-600 mb-2 block font-sans">Campaigns</span>
            <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Luxury Offers</h1>
            <p className="text-slate-500 mt-2 font-light">Curate exclusive deals and seasonal promotions for your guests.</p>
          </div>
          <Button onClick={handleAddPromotion} className="rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-700/20 px-8 h-12">
            <Plus className="h-4 w-4 mr-2" />
            Create Offer
          </Button>
        </div>

        {/* Promotions Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="font-serif italic text-slate-400">Loading your campaigns...</p>
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-emerald-200 shadow-sm">
            <div className="bg-emerald-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag className="h-8 w-8 text-emerald-600/30" />
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-800">No Active Offers</h3>
            <p className="text-slate-500 mt-2">Start by creating your first luxury campaign.</p>
            <Button variant="outline" onClick={handleAddPromotion} className="mt-8 rounded-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 px-8">
              Add New Promotion
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {promotions.map((promo) => (
              <Card key={promo.id} className={`rounded-[2.5rem] overflow-hidden border-0 shadow-lg group hover:shadow-2xl transition-all duration-500 bg-white relative ${!promo.is_active ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                <div className="flex flex-col h-full">
                  {/* Promo Badge */}
                  <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 items-end">
                    {promo.is_active ? (
                      <Badge className="bg-emerald-600 text-white border-0 px-4 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-200 text-slate-500 border-0 px-4 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest">
                        Paused
                      </Badge>
                    )}
                  </div>

                  <div className="p-10 flex-1 space-y-6">
                    <div className="space-y-4 pr-24">
                      <div className="flex items-center gap-2 text-emerald-600 text-[0.6rem] font-black uppercase tracking-[0.2em] mb-1">
                        <Sparkles className="h-3 w-3" /> Exclusive Promotion
                      </div>
                      <h3 className="font-serif text-3xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                        {promo.title}
                      </h3>
                      <p className="text-slate-500 font-light text-sm leading-relaxed line-clamp-2 italic">
                        "{promo.description}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" /> Valid Until
                        </p>
                        <p className="text-xs font-bold text-slate-700">
                          {promo.end_date ? format(new Date(promo.end_date), 'MMM d, yyyy') : 'No expiry'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> Created
                        </p>
                        <p className="text-xs font-bold text-slate-700">
                          {format(new Date(promo.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" onClick={() => handleEditPromotion(promo)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(promo.id)} className="rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleStatus(promo)}
                      className={`rounded-full px-5 text-[0.65rem] font-black uppercase tracking-widest transition-all ${
                        promo.is_active
                          ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
                          : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      {promo.is_active ? <><PowerOff className="h-3.5 w-3.5 mr-2" /> Deactivate</> : <><Power className="h-3.5 w-3.5 mr-2" /> Activate</>}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Promotion Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl">
          <DialogHeader className="p-6 border-b bg-slate-50/50">
            <DialogTitle className="text-xl font-serif">
              {editingPromotionId ? 'Edit Promotion' : 'Create New Promotion'}
            </DialogTitle>
            <DialogDescription>
              {editingPromotionId ? 'Update the promotion details below.' : 'Fill in the promotion details below.'}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600">Essential Details</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Summer Escape Offer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the promotion..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL *</Label>
                  <Input
                    id="image_url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4 border-t pt-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600">Validity Period</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4 border-t pt-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600">Status</h4>
              <div className="flex items-center space-x-3">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  {formData.is_active ? 'Active' : 'Inactive'}
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 border-t bg-slate-50 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
              {editingPromotionId ? 'Update Promotion' : 'Create Promotion'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
