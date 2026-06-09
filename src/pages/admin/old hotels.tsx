import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Star, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import AdminLayout from '@/components/AdminLayout';
import { DiningForm } from '@/components/DiningForm';
import { useHotels, useCreateHotel, useUpdateHotel, useDeleteHotel, useHotel, useDetailedHotel } from '@/hooks/useHotels';
import { Hotel, HotelRoom, HotelAmenity, HotelDining, HotelPolicy } from '@/types/hotel';
import { DiningFormData } from '@/lib/diningValidationSchema';
import { toast } from 'sonner';

export default function HotelsExtended() {
  const { data: hotels = [], isLoading } = useHotels();
  const createHotel = useCreateHotel();
  const updateHotel = useUpdateHotel();
  const deleteHotel = useDeleteHotel();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  const handleAddHotel = () => {
    setEditingHotelId(null);
    setActiveTab('basic');
    setIsDialogOpen(true);
  };

  const handleEditHotel = (hotelId: string) => {
    setEditingHotelId(hotelId);
    setActiveTab('basic');
    setIsDialogOpen(true);
  };

  const handleDeleteHotel = async (id: string) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      await deleteHotel.mutateAsync(id);
    }
  };

  const handleSave = async (hotel: Omit<Hotel, 'id' | 'created_at'> & { id?: string }) => {
    if (editingHotelId) {
      await updateHotel.mutateAsync({ id: editingHotelId, hotel });
    } else {
      await createHotel.mutateAsync(hotel);
    }
    setIsDialogOpen(false);
    setEditingHotelId(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Hotel Management</h1>
            <p className="text-slate-600 mt-2">Manage your hotel listings and details</p>
          </div>
          <Button onClick={handleAddHotel} className="bg-sky-500 hover:bg-sky-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Hotel
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading hotels...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-slate-900">{hotel.name}</h3>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: hotel.star_rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{hotel.location}</p>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{hotel.description}</p>
                  {hotel.price && (
                    <p className="text-lg font-bold text-sky-600 mb-3">${hotel.price}/night</p>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditHotel(hotel.id)}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteHotel(hotel.id)}
                      disabled={deleteHotel.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ExtendedHotelDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingHotelId(null);
          }}
          hotelId={editingHotelId}
          onSave={handleSave}
          isSaving={createHotel.isPending || updateHotel.isPending}
          initialTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </AdminLayout>
  );
}

interface ExtendedHotelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string | null;
  onSave: (hotel: Omit<Hotel, 'id' | 'created_at'> & { id?: string }) => void;
  isSaving: boolean;
  initialTab: string;
  onTabChange: (tab: string) => void;
}

function ExtendedHotelDialog({ 
  isOpen, 
  onClose, 
  hotelId, 
  onSave, 
  isSaving, 
  initialTab,
  onTabChange 
}: ExtendedHotelDialogProps) {
  const { data: hotel, isLoading, error } = useHotel(hotelId || '');
  const { data: hotelDetails, isLoading: isLoadingDetails } = useDetailedHotel(hotelId || '');
  const [formData, setFormData] = useState<Partial<Hotel>>({
    name: '',
    category: '',
    description: '',
    long_description: '',
    location: '',
    price: 0,
    star_rating: 5,
    images: [],
    slug: '',
    distance_from_airport: 0,
    nearby_attractions: [],
    guest_rating: 0,
    review_count: 0,
  });
  const [isDiningSubmitting, setIsDiningSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (hotel) {
      setFormData(hotel);
    } else if (!hotelId) {
      setFormData({
        name: '',
        category: '',
        description: '',
        long_description: '',
        location: '',
        price: 0,
        star_rating: 5,
        images: [],
        slug: '',
        distance_from_airport: 0,
        nearby_attractions: [],
        guest_rating: 0,
        review_count: 0,
      });
    }
  }, [hotel, hotelId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<Hotel, 'id' | 'created_at'>);
  };

  const updateFormData = (updates: Partial<Hotel>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleDiningSubmit = async (diningData: DiningFormData) => {
    if (!hotelId) {
      toast.error('Hotel ID is required');
      return;
    }

    try {
      setIsDiningSubmitting(true);
      
      // Send dining data to the backend
       const response = await fetch(`/api/hotels/${hotelId}/dining`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           main_description: diningData.main_description,
           hero_image_url: diningData.hero_image_url,
           section_label: diningData.section_label,
           heading_main: diningData.heading_main,
           heading_italic: diningData.heading_italic,
           restaurants: diningData.restaurants,
           breakfast_types: diningData.breakfast_types || [],
           bar_info: diningData.bar_info || {},
         }),
       });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to save dining data');
      }

      toast.success('Dining information saved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save dining data';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsDiningSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{hotel ? 'Edit Hotel' : 'Add New Hotel'}</DialogTitle>
          <DialogDescription>
            {hotel ? 'Update hotel information and details' : 'Add a new hotel to your listings'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {hotelId && isLoading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-slate-600">Loading hotel data...</p>
            </div>
          )}

          {hotelId && error && (
            <div className="flex items-center justify-center py-8">
              <p className="text-red-600">Error loading hotel data</p>
            </div>
          )}

          {(!hotelId || (!isLoading && !error)) && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="dining">Dining</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <TabsContent value="basic" className="space-y-4 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Hotel Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => updateFormData({ name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slug">URL Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug || ''}
                          onChange={(e) => updateFormData({ slug: e.target.value })}
                          placeholder="hotel-name-lowercase"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => updateFormData({ category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beach Resort">Beach Resort</SelectItem>
                            <SelectItem value="Mountain Resort">Mountain Resort</SelectItem>
                            <SelectItem value="City Hotel">City Hotel</SelectItem>
                            <SelectItem value="Resort">Resort</SelectItem>
                            <SelectItem value="Villa">Villa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => updateFormData({ location: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">Price per Night ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => updateFormData({ price: parseFloat(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="star_rating">Star Rating *</Label>
                        <Select
                          value={formData.star_rating?.toString()}
                          onValueChange={(value) => updateFormData({ star_rating: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="distance_from_airport">Distance from Airport (km)</Label>
                        <Input
                          id="distance_from_airport"
                          type="number"
                          value={formData.distance_from_airport}
                          onChange={(e) => updateFormData({ distance_from_airport: parseInt(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guest_rating">Guest Rating</Label>
                        <Input
                          id="guest_rating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={formData.guest_rating}
                          onChange={(e) => updateFormData({ guest_rating: parseFloat(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="images">Main Image URL</Label>
                        <Input
                          id="images"
                          value={formData.images?.[0] || ''}
                          onChange={(e) => updateFormData({ images: [e.target.value] })}
                          placeholder="/images/photo1766829377.jpg"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="description" className="space-y-4 mt-0">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="description">Short Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => updateFormData({ description: e.target.value })}
                          rows={3}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="long_description">Long Description</Label>
                        <Textarea
                          id="long_description"
                          value={formData.long_description || ''}
                          onChange={(e) => updateFormData({ long_description: e.target.value })}
                          rows={6}
                          placeholder="Detailed description of the hotel, its features, and what makes it special..."
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="rooms" className="space-y-4 mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Room Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 mb-4">
                          Room management will be available in the next update. Currently, room data is managed through the database.
                        </p>
                        <div className="text-xs text-slate-500">
                          <p>• Add different room types (Standard, Deluxe, Suite, etc.)</p>
                          <p>• Set pricing and occupancy for each room type</p>
                          <p>• Add room amenities and descriptions</p>
                          <p>• Upload room photos</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="amenities" className="space-y-4 mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Amenities Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 mb-4">
                          Amenities management will be available in the next update. Currently, amenities data is managed through the database.
                        </p>
                        <div className="text-xs text-slate-500">
                          <p>• Add hotel amenities (WiFi, Pool, Spa, etc.)</p>
                          <p>• Categorize amenities by type</p>
                          <p>• Mark featured amenities</p>
                          <p>• Add icons for visual representation</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="dining" className="space-y-4 mt-0">
                    {hotelId ? (
                      isLoadingDetails ? (
                        <div className="flex items-center justify-center py-8">
                          <p className="text-slate-600">Loading dining data...</p>
                        </div>
                      ) : (
                        <DiningForm
                          hotelId={hotelId}
                          initialData={hotelDetails?.dining}
                          onSubmit={handleDiningSubmit}
                          isLoading={isDiningSubmitting}
                        />
                      )
                    ) : (
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-sm text-slate-600">
                            Please save the hotel first before managing dining information.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="policies" className="space-y-4 mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Policies Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 mb-4">
                          Policies management will be available in the next update. Currently, policies data is managed through the database.
                        </p>
                        <div className="text-xs text-slate-500">
                          <p>• Set check-in and check-out times</p>
                          <p>• Configure cancellation policies</p>
                          <p>• Add child and pet policies</p>
                          <p>• Set deposit requirements</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving} className="bg-sky-500 hover:bg-sky-600">
                      {isSaving ? 'Saving...' : hotel ? 'Update Hotel' : 'Add Hotel'}
                    </Button>
                  </div>
                </form>
              </div>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}