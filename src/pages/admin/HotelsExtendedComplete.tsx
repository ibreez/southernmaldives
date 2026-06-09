import {
  Hotel, Plus, Search, Filter, Edit2, Trash2, MapPin, Star, Eye, Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/AdminLayout';
import { useHotels, useDeleteHotel } from '@/hooks/useHotels';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminHotels() {
  const { data: hotels = [], isLoading } = useHotels();
  const deleteHotel = useDeleteHotel();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [starFilter, setStarFilter] = useState<number | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resort? This will remove all associated rooms and data.')) {
      try {
        await deleteHotel.mutateAsync(id);
        toast.success('Resort removed from collection');
      } catch {
        toast.error('Failed to delete resort');
      }
    }
  };

  const filteredHotels = hotels.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? h.category === categoryFilter : true;
    const matchesStars = starFilter ? h.star_rating === starFilter : true;
    return matchesSearch && matchesCategory && matchesStars;
  });

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-emerald-600 mb-2 block">Inventory</span>
            <h1 className="text-4xl font-serif font-bold text-slate-900">Hotel Collection</h1>
            <p className="text-slate-500 mt-2 font-light">Curate the finest Southern Maldives destinations for your guests.</p>
          </div>
          <Link to="/admin/hotels/new">
            <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg px-8 h-12">
              <Plus className="h-4 w-4 mr-2" />
              Add New Resort
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Filter className="h-4 w-4 text-emerald-600" /> Filters
            </h2>
            <div>
              <label className="text-xs font-semibold text-slate-500">Search</label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="mt-2 w-full border rounded-xl p-2 text-sm"
              >
                <option value="">All</option>
                <option value="Luxury">Luxury</option>
                <option value="Boutique">Boutique</option>
                <option value="Eco">Eco</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Star Rating</label>
              <select
                value={starFilter || ''}
                onChange={(e) => setStarFilter(e.target.value ? Number(e.target.value) : null)}
                className="mt-2 w-full border rounded-xl p-2 text-sm"
              >
                <option value="">All</option>
                {[1, 2, 3, 4, 5].map(star => (
                  <option key={star} value={star}>{star} Stars</option>
                ))}
              </select>
            </div>
          </aside>

          {/* Content */}
          <main className="md:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                <Hotel className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-serif font-bold text-slate-800">Empty Collection</h3>
                <p className="text-slate-500 mt-2">No resorts match your filters.</p>
                <Link to="/admin/hotels/new">
                  <Button className="mt-6 rounded-full bg-emerald-600 hover:bg-emerald-700 px-6">
                    Add Your First Resort
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHotels.map((hotel) => (
                  <Card key={hotel.id} className="rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all">
                    <div className="relative h-56 w-full">
                      <img
                        src={hotel.images?.[0] || '/assets/hero-tropical-beach-sunset.jpg'}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 flex gap-1">
                        {Array.from({ length: hotel.star_rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <Badge className="absolute top-4 right-4 bg-emerald-600 text-white">
                        {hotel.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6 space-y-3">
                      <h3 className="text-xl font-serif font-bold">{hotel.name}</h3>
                      <p className="flex items-center text-slate-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-emerald-500" /> {hotel.location}
                      </p>
                      <p className="text-lg font-bold text-slate-900">${hotel.price}</p>
                      <div className="flex gap-4 text-xs text-slate-500 mt-2">
                        <span className="flex items-center gap-1"><ImageIcon className="h-3 w-3" /> {hotel.images?.length || 0} Media</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {hotel.review_count} Reviews</span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <Link to={`/admin/hotels/edit/${hotel.id}`}>
                          <Button variant="outline" className="rounded-full px-4">
                            <Edit2 className="h-4 w-4 mr-2" /> Edit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() => handleDelete(hotel.id)}
                          className="text-red-500 hover:bg-red-50 rounded-full px-4"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </AdminLayout>
  );
}
