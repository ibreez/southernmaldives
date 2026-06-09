import { useState } from 'react';
import { useSiteSettingsStore } from '@/stores/siteSettingsStore';
import { Plus, Image, Link, Edit2, Trash2, Power, PowerOff, GripVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/components/AdminLayout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useInstagramFeeds, useCreateInstagramFeed, useUpdateInstagramFeed, useDeleteInstagramFeed, useReorderInstagramFeeds } from '@/hooks/useInstagramFeed';
import { InstagramFeed } from '@/types/instagramFeed';
import { toast } from 'sonner';
import logo from '/logo.jpg';

export default function InstagramFeeds() {
  const { data: feeds = [], isLoading } = useInstagramFeeds();
  const createFeed = useCreateInstagramFeed();
  const updateFeed = useUpdateInstagramFeed();
  const deleteFeed = useDeleteInstagramFeed();
  const reorderFeeds = useReorderInstagramFeeds();

  // Global site settings
  const { showInstagramSection, setShowInstagramSection } = useSiteSettingsStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeedId, setEditingFeedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    image_url: '',
    post_link: '',
    caption: '',
    display_order: 0,
    is_active: true,
  });

  const handleAddFeed = () => {
    setEditingFeedId(null);
    setFormData({ image_url: '', post_link: '', caption: '', display_order: feeds.length, is_active: true });
    setIsDialogOpen(true);
  };

  const handleEditFeed = (feed: InstagramFeed) => {
    setEditingFeedId(feed.id);
    setFormData({
      image_url: feed.image_url,
      post_link: feed.post_link,
      caption: feed.caption || '',
      display_order: feed.display_order,
      is_active: feed.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.image_url || !formData.post_link) {
      toast.error('Image URL and Post Link are required');
      return;
    }

    const payload = {
      image_url: formData.image_url,
      post_link: formData.post_link,
      caption: formData.caption || undefined,
      display_order: formData.display_order,
      is_active: formData.is_active,
    };

    try {
      if (editingFeedId) {
        await updateFeed.mutateAsync({ id: editingFeedId, feed: payload });
      } else {
        await createFeed.mutateAsync(payload);
      }
      setIsDialogOpen(false);
    } catch {
      toast.error(editingFeedId ? 'Failed to update feed' : 'Failed to create feed');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Instagram post?')) {
      await deleteFeed.mutateAsync(id);
      toast.success('Instagram post deleted');
    }
  };

  const toggleStatus = async (feed: InstagramFeed) => {
    try {
      await updateFeed.mutateAsync({
        ...feed,
        is_active: !feed.is_active,
      });
      toast.success(`Post ${!feed.is_active ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const sortedFeeds = [...feeds].sort((a, b) => a.display_order - b.display_order);

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-pink-600 mb-2 block font-sans">Social Media</span>
            <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Instagram Gallery</h1>
            <p className="text-slate-500 mt-2 font-light">Manage your Instagram feed displayed on the homepage.</p>
          </div>
          <Button onClick={handleAddFeed} className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-700/20 px-8 h-12">
            <Plus className="h-4 w-4 mr-2" />
            Add Instagram Post
          </Button>
        </div>

        {/* Global Visibility Toggle */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-slate-900">Show Instagram Section</h3>
              <p className="text-sm text-slate-500">
                Toggle visibility of the Instagram gallery on the public homepage
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${showInstagramSection ? 'text-purple-600' : 'text-slate-400'}`}>
                {showInstagramSection ? 'Visible' : 'Hidden'}
              </span>
              <Switch
                checked={showInstagramSection}
                onCheckedChange={setShowInstagramSection}
              />
            </div>
          </div>
        </div>

        {/* Instagram Feeds Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-10 w-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <p className="font-serif italic text-slate-400">Loading Instagram posts...</p>
          </div>
        ) : sortedFeeds.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-pink-200 shadow-sm">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <img src={logo} alt="Instagram" className="h-8 w-8 object-contain text-pink-600/30" />
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-800">No Instagram Posts Yet</h3>
            <p className="text-slate-500 mt-2">Add your first Instagram post to showcase on your homepage.</p>
            <Button variant="outline" onClick={handleAddFeed} className="mt-8 rounded-full border-pink-200 text-pink-600 hover:bg-pink-50 px-8">
              Add Instagram Post
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFeeds.map((feed) => (
              <Card key={feed.id} className={`rounded-2xl overflow-hidden border-0 shadow-lg group hover:shadow-2xl transition-all duration-500 bg-white relative ${!feed.is_active ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  {feed.is_active ? (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-3 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-200 text-slate-500 border-0 px-3 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest">
                      Hidden
                    </Badge>
                  )}
                </div>

                {/* Image Preview */}
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  <img 
                    src={feed.image_url} 
                    alt={feed.caption || 'Instagram post'}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = e.target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                            <svg class="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                        `;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider">
                      <Link className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{feed.post_link}</span>
                    </div>
                    {feed.caption && (
                      <p className="text-sm text-slate-600 line-clamp-2 italic">"{feed.caption}"</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <GripVertical className="h-3.5 w-3.5" />
                        Order: {feed.display_order}
                      </span>
                      <span className="text-[0.65rem]">
                        {new Date(feed.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="rounded-full text-slate-400 hover:text-purple-600 hover:bg-purple-50" onClick={() => handleEditFeed(feed)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(feed.id)} className="rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleStatus(feed)}
                    className={`rounded-full px-4 text-[0.65rem] font-black uppercase tracking-widest transition-all ${
                      feed.is_active
                        ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
                        : 'text-purple-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    {feed.is_active ? <><PowerOff className="h-3.5 w-3.5 mr-1.5" /> Hide</> : <><Power className="h-3.5 w-3.5 mr-1.5" /> Show</>}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Feed Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl">
          <DialogHeader className="p-6 border-b bg-slate-50/50">
            <DialogTitle className="text-xl font-serif">
              {editingFeedId ? 'Edit Instagram Post' : 'Add Instagram Post'}
            </DialogTitle>
            <DialogDescription>
              {editingFeedId ? 'Update the Instagram post details below.' : 'Add a new Instagram post to your homepage gallery.'}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-purple-600">Post Details</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL *</Label>
                  <Input
                    id="image_url"
                    placeholder="https://instagram.com/image.jpg"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                  <p className="text-xs text-slate-400">Direct link to the image file</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post_link">Post Link *</Label>
                  <Input
                    id="post_link"
                    placeholder="https://instagram.com/p/..."
                    value={formData.post_link}
                    onChange={(e) => setFormData({ ...formData, post_link: e.target.value })}
                  />
                  <p className="text-xs text-slate-400">Full URL to the Instagram post</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caption">Caption (optional)</Label>
                  <Textarea
                    id="caption"
                    placeholder="Brief caption for this post..."
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-slate-400">Lower numbers appear first</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4 border-t pt-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-purple-600">Visibility</h4>
              <div className="flex items-center space-x-3">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  {formData.is_active ? 'Visible on homepage' : 'Hidden from homepage'}
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 border-t bg-slate-50 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              {editingFeedId ? 'Update Post' : 'Add Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}