import { useState } from 'react';
import { Plus, Edit2, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/components/AdminLayout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTestimonialsAdmin, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '@/hooks/useTestimonials';
import { Testimonial } from '@/types/testimonial';
import { toast } from 'sonner';
import SafeAvatar from '@/components/SafeAvatar';

const initialFormState = {
  author_name: '',
  content: '',
  rating: 5,
  avatar_url: '',
  is_visible: true,
  order: 0,
};

export default function Testimonials() {
  const { data: testimonials = [], isLoading } = useTestimonialsAdmin();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<typeof initialFormState>(initialFormState);

  const openCreateModal = () => {
    setEditingId(null);
    setFormState(initialFormState);
    setIsDialogOpen(true);
  };

  const openEditModal = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormState({
      author_name: testimonial.author_name,
      content: testimonial.content,
      rating: testimonial.rating,
      avatar_url: testimonial.avatar_url || '',
      is_visible: testimonial.is_visible,
      order: testimonial.order,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formState.author_name.trim() || !formState.content.trim()) {
      toast.error('Author name and content are required');
      return;
    }

    const payload = {
      author_name: formState.author_name.trim(),
      content: formState.content.trim(),
      rating: Math.min(5, Math.max(1, formState.rating)),
      avatar_url: formState.avatar_url.trim() || null,
      is_visible: formState.is_visible,
      order: Number.isNaN(Number(formState.order)) ? 0 : Number(formState.order),
    };

    try {
      if (editingId) {
        await updateTestimonial.mutateAsync({ id: editingId, testimonial: payload });
      } else {
        await createTestimonial.mutateAsync(payload);
      }
      setIsDialogOpen(false);
    } catch {
      // errors handled by hooks
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial permanently?')) return;
    try {
      await deleteTestimonial.mutateAsync(id);
    } catch {
      // errors handled by hook
    }
  };

  const handleToggleVisible = async (testimonial: Testimonial) => {
    try {
      await updateTestimonial.mutateAsync({
        id: testimonial.id,
        testimonial: { is_visible: !testimonial.is_visible },
      });
    } catch {
      // errors handled by hook
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">Testimonials</span>
            <h1 className="text-4xl font-serif font-bold text-slate-900 mt-3">Guest Reviews</h1>
            <p className="text-slate-500 mt-3 max-w-2xl">
              Create and manage traveler testimonials that appear on the homepage.
            </p>
          </div>
          <Button onClick={openCreateModal} className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-6 h-12 shadow-lg shadow-emerald-700/20">
            <Plus className="mr-2 h-4 w-4" /> Add Review
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-emerald-200 bg-white/80 p-12 text-center shadow-sm">
            <p className="text-xl font-semibold text-slate-900">No testimonials yet</p>
            <p className="text-slate-500 mt-2">Start by adding a guest review to build trust on your homepage.</p>
            <Button onClick={openCreateModal} variant="outline" className="mt-6 rounded-full px-8">
              Add First Review
            </Button>
          </div>
         ) : (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {testimonials.map((testimonial) => (
               <Card key={testimonial.id} className="p-6 border border-slate-200 shadow-sm bg-white">
                 <div className="flex items-start justify-between gap-4">
                   <div className="space-y-2 flex-1">
                     <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-lg font-semibold overflow-hidden">
                        <SafeAvatar
                          src={testimonial.avatar_url}
                          alt={testimonial.author_name}
                          imgClassName="h-full w-full object-cover"
                          fallbackClassName="text-lg"
                          containerClassName="h-full w-full"
                        />
                      </div>
                       <div>
                         <h3 className="text-lg font-semibold text-slate-900">{testimonial.author_name}</h3>
                         <div className="flex items-center gap-1 text-amber-500">
                           {Array.from({ length: 5 }).map((_, index) => (
                             <Star
                               key={index}
                               size={14}
                               className={index < testimonial.rating ? 'fill-current' : 'text-slate-300'}
                             />
                           ))}
                         </div>
                       </div>
                     </div>
                     <p className="text-slate-500 line-clamp-3">{testimonial.content}</p>
                   </div>

                   <div className="flex flex-col items-end gap-3">
                     <Badge className={testimonial.is_visible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                       {testimonial.is_visible ? 'Visible' : 'Hidden'}
                     </Badge>
                     <span className="text-xs text-slate-400">Order {testimonial.order}</span>
                   </div>
                 </div>

                 <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
                   <Button size="sm" variant="ghost" onClick={() => openEditModal(testimonial)}>
                     <Edit2 className="mr-2 h-4 w-4" /> Edit
                   </Button>
                   <Button size="sm" variant="destructive" onClick={() => handleDelete(testimonial.id)}>
                     <Trash2 className="mr-2 h-4 w-4" /> Delete
                   </Button>
                   <Button size="sm" variant="outline" onClick={() => handleToggleVisible(testimonial)}>
                     {testimonial.is_visible ? <><EyeOff className="mr-2 h-4 w-4" /> Hide</> : <><Eye className="mr-2 h-4 w-4" /> Show</>}
                   </Button>
                 </div>
               </Card>
             ))}
           </div>
         )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl">
          <DialogHeader className="p-6 border-b bg-slate-50/80">
            <DialogTitle>{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the review details below.' : 'Add a new traveler review to display on the homepage.'}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto bg-white">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author_name">Traveler Name *</Label>
                <Input
                  id="author_name"
                  value={formState.author_name}
                  onChange={(e) => setFormState({ ...formState, author_name: e.target.value })}
                  placeholder="Kira Dawson"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Review *</Label>
                <Textarea
                  id="content"
                  rows={5}
                  value={formState.content}
                  onChange={(e) => setFormState({ ...formState, content: e.target.value })}
                  placeholder="This island retreat exceeded all expectations..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    min={1}
                    max={5}
                    value={formState.rating}
                    onChange={(e) => setFormState({ ...formState, rating: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Sort Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formState.order}
                    onChange={(e) => setFormState({ ...formState, order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  type="url"
                  value={formState.avatar_url}
                  onChange={(e) => setFormState({ ...formState, avatar_url: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">Visible</p>
                  <p className="text-sm text-slate-500">Toggle whether the testimonial appears on the public homepage.</p>
                </div>
                <Switch
                  checked={formState.is_visible}
                  onCheckedChange={(value) => setFormState({ ...formState, is_visible: value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="bg-slate-50 p-6 flex flex-col gap-3 md:flex-row md:justify-end md:items-center">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white">
              {editingId ? 'Update Review' : 'Save Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
