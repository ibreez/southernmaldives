import { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Briefcase, 
  Calendar, 
  Users, 
  DollarSign, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Settings,
  Image as ImageIcon,
  AlertTriangle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePackagesAdmin, useCreatePackage, useUpdatePackage, useDeletePackage } from '@/hooks/usePackageAdmin';
import { TravelPackage } from '@/types/package';
import { toast } from 'sonner';

const initialFormState = {
  title: '',
  subtitle: '',
  description: '',
  price: 0,
  currency: 'USD',
  nights: 0,
  days: 0,
  persons: 2,
  images: '',
  inclusions: '',
  activities: '',
  featured: false,
  badge: '',
  highlights: '',
  bookingDeadline: '',
  travelDates: '',
  whatsapp: '',
  email: '',
  website: '',
  address: '',
};

type PackageFormState = typeof initialFormState;

function compactLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseInclusions(value: string) {
  return compactLines(value).map((label) => ({ label, included: true }));
}

function parseActivities(value: string) {
  return compactLines(value).map((name) => ({ name }));
}

export default function Packages() {
  const { data: packages = [], isLoading } = usePackagesAdmin();
  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();
  const deletePackage = useDeletePackage();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<PackageFormState>(initialFormState);

  const openCreateModal = () => {
    setEditingId(null);
    setFormState(initialFormState);
    setIsDialogOpen(true);
  };

  const openEditModal = (pkg: TravelPackage) => {
    setEditingId(pkg.id);
    setFormState({
      title: pkg.title,
      subtitle: pkg.subtitle || '',
      description: pkg.description,
      price: pkg.price,
      currency: pkg.currency,
      nights: pkg.duration.nights,
      days: pkg.duration.days,
      persons: pkg.persons,
      images: pkg.images.join('\n'),
      inclusions: pkg.inclusions.map((item) => item.label).join('\n'),
      activities: (pkg.activities ?? []).map((item) => item.name).join('\n'),
      featured: pkg.featured || false,
      badge: pkg.badge || '',
      highlights: (pkg.highlights ?? []).join('\n'),
      bookingDeadline: pkg.bookingDeadline || '',
      travelDates: pkg.travelDates || '',
      whatsapp: pkg.contactInfo?.whatsapp || '',
      email: pkg.contactInfo?.email || '',
      website: pkg.contactInfo?.website || '',
      address: pkg.contactInfo?.address || '',
    });
    setIsDialogOpen(true);
  };

  const getPayload = (): Omit<TravelPackage, 'id' | 'created_at'> => ({
    title: formState.title.trim(),
    subtitle: formState.subtitle.trim() || undefined,
    description: formState.description.trim(),
    price: Number(formState.price) || 0,
    currency: formState.currency,
    duration: {
      nights: Number(formState.nights) || 0,
      days: Number(formState.days) || 0,
    },
    persons: Number(formState.persons) || 1,
    images: compactLines(formState.images),
    inclusions: parseInclusions(formState.inclusions),
    activities: parseActivities(formState.activities),
    featured: formState.featured,
    badge: formState.badge.trim() || undefined,
    highlights: compactLines(formState.highlights),
    bookingDeadline: formState.bookingDeadline.trim() || undefined,
    travelDates: formState.travelDates.trim() || undefined,
    contactInfo: {
      whatsapp: formState.whatsapp.trim() || undefined,
      email: formState.email.trim() || undefined,
      website: formState.website.trim() || undefined,
      address: formState.address.trim() || undefined,
    },
  });

  const handleSave = async () => {
    if (!formState.title.trim() || !formState.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    const payload = getPayload();

    try {
      if (editingId) {
        await updatePackage.mutateAsync({ id: editingId, pkg: payload });
        toast.success('Package updated securely.');
      } else {
        await createPackage.mutateAsync(payload);
        toast.success('Package created and indexed securely.');
      }
      setIsDialogOpen(false);
    } catch {
      // handled by hook mutation triggers
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePackage.mutateAsync(deleteId);
      toast.success('Package deleted permanently.');
    } catch {
      // handled by hook mutation triggers
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-[1600px] mx-auto px-4 py-6">
        
        {/* Upper Action Panel Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600 block mb-1">System Portal</span>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight">Package Configuration</h1>
            <p className="text-slate-500 text-sm mt-1 max-w-xl font-light">
              Manage luxury island itineraries, configure active features, and update reservations metadata.
            </p>
          </div>
          <Button 
            onClick={openCreateModal} 
            className="rounded-full bg-slate-950 hover:bg-emerald-600 px-6 h-12 text-xs font-semibold tracking-wider uppercase shadow-xl transition-all duration-300 flex-shrink-0"
          >
            <Plus className="mr-2 h-4 w-4 stroke-[2.5]" /> Add New Package
          </Button>
        </div>

        {/* Dynamic List Rendering Spaces */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 space-y-4">
            <div className="h-10 w-10 border-[3px] border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Updating Local Directory...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="rounded-[2.5rem] border border-dashed border-slate-200 bg-white p-16 text-center shadow-sm max-w-2xl mx-auto mt-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Briefcase className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900">No Packages Hosted</h3>
            <p className="text-slate-400 text-sm mt-2 font-light max-w-sm mx-auto">Create a travel package parameters suite to begin displaying choices live on the website layout platform.</p>
            <Button onClick={openCreateModal} variant="outline" className="mt-8 rounded-full px-8 h-11 text-xs uppercase tracking-wider font-bold border-slate-200 hover:bg-slate-50">
              Launch Creator Wizard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {packages.map((pkg) => {
              const firstImage = compactLines(pkg.images.join('\n'))[0];
              return (
                <Card key={pkg.id} className="overflow-hidden border border-slate-200/70 shadow-sm bg-white rounded-3xl flex flex-col md:flex-row group hover:shadow-md transition-all duration-300">
                  
                  {/* Thumbnail Preview Visual Box */}
                  <div className="relative w-full md:w-[200px] h-[180px] md:h-auto bg-slate-50 flex-shrink-0 overflow-hidden">
                    {firstImage ? (
                      <img 
                        src={firstImage} 
                        alt={pkg.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1.5">
                        <ImageIcon className="h-8 w-8 stroke-[1.2]" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">No Preview Image</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      {pkg.featured && <Badge className="bg-emerald-600 hover:bg-emerald-600 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-md">Featured</Badge>}
                      {pkg.badge && <Badge className="bg-slate-900 text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-md border-0">{pkg.badge}</Badge>}
                    </div>
                  </div>

                  {/* Core Information Data Space */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors line-clamp-1">{pkg.title}</h2>
                          <p className="text-xs text-slate-400 italic font-light mt-0.5 line-clamp-1">{pkg.subtitle || 'Bespoke Private Itinerary'}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-bold text-slate-400 block uppercase tracking-widest text-[9px]">Rate Base</span>
                          <span className="text-lg font-serif font-black text-slate-900">
                            {pkg.currency === 'USD' ? '$' : pkg.currency}{pkg.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs line-clamp-2 font-light leading-relaxed pt-1">{pkg.description}</p>
                    </div>

                    {/* Metadata Summary Attributes Grid */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 text-[11px] font-medium text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{pkg.duration.nights}N / {pkg.duration.days}D</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Base {pkg.persons} {pkg.persons === 1 ? 'Guest' : 'Guests'}</span>
                      </div>
                    </div>

                    {/* Control Row Action Keys */}
                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
                      <div className="text-[10px] text-slate-400 font-mono tracking-tighter">ID: {pkg.id.slice(0,8)}...</div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => openEditModal(pkg)}
                          className="h-8 rounded-full text-xs font-semibold hover:bg-slate-100 hover:text-slate-900 px-3"
                        >
                          <Edit2 className="mr-1.5 h-3 w-3 stroke-[2.5]" /> Modify
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setDeleteId(pkg.id)}
                          className="h-8 rounded-full text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 px-3"
                        >
                          <Trash2 className="mr-1.5 h-3 w-3" /> Purge
                        </Button>
                      </div>
                    </div>

                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Structured Wizard Creation Dialog Interface */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-[2rem] border border-slate-100 shadow-2xl">
          <DialogHeader className="p-6 md:p-8 border-b bg-slate-50/50">
            <DialogTitle className="text-2xl font-serif font-bold text-slate-900">{editingId ? 'Modify Package Parameters' : 'Register New Package'}</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs font-light">
              Configure parameters inside specialized tabs below to update the public pricing indexes correctly.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <div className="border-b bg-slate-50/30 px-6 md:px-8">
              <TabsList className="bg-transparent h-12 p-0 gap-6 flex justify-start border-none">
                <TabsTrigger value="general" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none h-full bg-transparent p-0 text-xs uppercase tracking-wider font-bold text-slate-400 data-[state=active]:text-slate-900 shadow-none">1. General Info</TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none h-full bg-transparent p-0 text-xs uppercase tracking-wider font-bold text-slate-400 data-[state=active]:text-slate-900 shadow-none">2. Inclusions</TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none h-full bg-transparent p-0 text-xs uppercase tracking-wider font-bold text-slate-400 data-[state=active]:text-slate-900 shadow-none">3. Contact Meta</TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none h-full bg-transparent p-0 text-xs uppercase tracking-wider font-bold text-slate-400 data-[state=active]:text-slate-900 shadow-none"><Settings className="h-3.5 w-3.5 mr-1" /> 4. Visibility</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 md:p-8 max-h-[55vh] overflow-y-auto bg-white space-y-6">
              
              {/* Tab Frame A: Core Titles & Rates */}
              <TabsContent value="general" className="space-y-5 mt-0 outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-600">Title Heading *</Label>
                    <Input id="title" value={formState.title} onChange={(e) => setFormState({ ...formState, title: e.target.value })} className="rounded-xl h-11 border-slate-200 text-sm" placeholder="Luxury Addu Atoll Escape" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subtitle" className="text-xs font-bold uppercase tracking-wider text-slate-600">Subtitle Description Banner</Label>
                    <Input id="subtitle" value={formState.subtitle} onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })} className="rounded-xl h-11 border-slate-200 text-sm" placeholder="All inclusive water villa package" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-600">Catalog Description *</Label>
                  <Textarea id="description" rows={3} value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} className="rounded-xl border-slate-200 text-sm resize-none" placeholder="Provide details detailing the package..." />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-1.5">
                    <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1"><DollarSign className="h-3 w-3" /> Retail Price</Label>
                    <Input id="price" type="number" min={0} value={formState.price} onChange={(e) => setFormState({ ...formState, price: Number(e.target.value) })} className="rounded-xl h-11 bg-white border-slate-200 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="currency" className="text-xs font-bold uppercase tracking-wider text-slate-600">Currency Code</Label>
                    <Input id="currency" value={formState.currency} onChange={(e) => setFormState({ ...formState, currency: e.target.value })} className="rounded-xl h-11 bg-white border-slate-200 text-sm" placeholder="USD" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="nights" className="text-xs font-bold uppercase tracking-wider text-slate-600">Nights Count</Label>
                    <Input id="nights" type="number" min={0} value={formState.nights} onChange={(e) => setFormState({ ...formState, nights: Number(e.target.value) })} className="rounded-xl h-11 border-slate-200 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="days" className="text-xs font-bold uppercase tracking-wider text-slate-600">Days Count</Label>
                    <Input id="days" type="number" min={0} value={formState.days} onChange={(e) => setFormState({ ...formState, days: Number(e.target.value) })} className="rounded-xl h-11 border-slate-200 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="persons" className="text-xs font-bold uppercase tracking-wider text-slate-600">Max Occupancy</Label>
                    <Input id="persons" type="number" min={1} value={formState.persons} onChange={(e) => setFormState({ ...formState, persons: Number(e.target.value) })} className="rounded-xl h-11 border-slate-200 text-sm" />
                  </div>
                </div>
              </TabsContent>

              {/* Tab Frame B: Custom Arrays Textarea Parsers */}
              <TabsContent value="details" className="space-y-5 mt-0 outline-none">
                <div className="space-y-1.5">
                  <Label htmlFor="images" className="text-xs font-bold uppercase tracking-wider text-slate-600">Image Asset URLs</Label>
                  <Textarea id="images" rows={2} value={formState.images} onChange={(e) => setFormState({ ...formState, images: e.target.value })} className="rounded-xl border-slate-200 text-xs font-mono resize-none" placeholder="https://domain.com/asset-1.jpg&#10;https://domain.com/asset-2.jpg" />
                  <p className="text-[10px] text-slate-400 font-light italic">Paste one uniform secure resource path link string anchor segment per line breakdown.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="inclusions" className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1"><CheckCircle className="h-3 w-3 text-emerald-600" /> Package Inclusions</Label>
                    <Textarea id="inclusions" rows={3} value={formState.inclusions} onChange={(e) => setFormState({ ...formState, inclusions: e.target.value })} className="rounded-xl border-slate-200 text-sm resize-none" placeholder="Daily Fine Dining Buffet&#10;Speedboat Transfers included" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="activities" className="text-xs font-bold uppercase tracking-wider text-slate-600">Featured Activities</Label>
                    <Textarea id="activities" rows={3} value={formState.activities} onChange={(e) => setFormState({ ...formState, activities: e.target.value })} className="rounded-xl border-slate-200 text-sm resize-none" placeholder="Manta Ray Snorkeling Safari&#10;Private Sunset Cruise" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="highlights" className="text-xs font-bold uppercase tracking-wider text-slate-600">Itinerary Highlights Grid</Label>
                  <Textarea id="highlights" rows={2} value={formState.highlights} onChange={(e) => setFormState({ ...formState, highlights: e.target.value })} className="rounded-xl border-slate-200 text-sm resize-none" placeholder="Overwater Overlook Deck&#10;Private Infinity Pool" />
                </div>
              </TabsContent>

              {/* Tab Frame C: Lead Captures */}
              <TabsContent value="contact" className="space-y-5 mt-0 outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="whatsapp" className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5"><Phone className="h-3 w-3 text-emerald-600" /> WhatsApp Line</Label>
                    <Input id="whatsapp" value={formState.whatsapp} onChange={(e) => setFormState({ ...formState, whatsapp: e.target.value })} className="rounded-xl h-11 border-slate-200 text-sm" placeholder="+960 9495654" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5"><Mail className="h-3 w-3 text-emerald-600" /> Reservation Email Address</Label>
                    <Input id="email" type="email" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="rounded-xl h-11 border-slate-200 text-sm" placeholder="bookings@resort.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="website" className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5"><Globe className="h-3 w-3 text-emerald-600" /> Digital Brochure Webpage</Label>
                    <Input id="website" value={formState.website} onChange={(e) => setFormState({ ...formState, website: e.target.value })} className="rounded-xl h-11 border-slate-200 text-sm" placeholder="www.luxuryresort.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5"><MapPin className="h-3 w-3 text-emerald-600" /> Physical Location Coordinates</Label>
                    <Input id="address" value={formState.address} onChange={(e) => setFormState({ ...formState, address: e.target.value })} className="rounded-xl h-11 border-slate-200 text-sm" placeholder="Gaafu Dhaalu Atoll, Maldives" />
                  </div>
                </div>
              </TabsContent>

              {/* Tab Frame D: Visibility Status Controls */}
              <TabsContent value="settings" className="space-y-5 mt-0 outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-1.5">
                    <Label htmlFor="bookingDeadline" className="text-xs font-bold uppercase tracking-wider text-slate-600">Booking Reservation Threshold</Label>
                    <Input id="bookingDeadline" value={formState.bookingDeadline} onChange={(e) => setFormState({ ...formState, bookingDeadline: e.target.value })} className="rounded-xl h-11 bg-white border-slate-200 text-sm" placeholder="e.g. 15th Nov 2026" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="travelDates" className="text-xs font-bold uppercase tracking-wider text-slate-600">Valid Travel Window Window</Label>
                    <Input id="travelDates" value={formState.travelDates} onChange={(e) => setFormState({ ...formState, travelDates: e.target.value })} className="rounded-xl h-11 bg-white border-slate-200 text-sm" placeholder="e.g. Dec 2026 - May 2027" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="badge" className="text-xs font-bold uppercase tracking-wider text-slate-600">Visual Overlay Pill Badge</Label>
                  <Input id="badge" value={formState.badge} onChange={(e) => setFormState({ ...formState, badge: e.target.value })} className="rounded-xl h-11 border-slate-200 text-sm" placeholder="e.g. BEST SELLER or 15% OFF" />
                </div>

                <div className="flex items-center justify-between gap-6 p-4 rounded-2xl border border-slate-100 bg-emerald-50/20">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Featured Showcase Spotlight</h4>
                    <p className="text-slate-500 text-xs font-light mt-0.5">Toggle to promote this item card option to index priority view rows.</p>
                  </div>
                  <Switch checked={formState.featured} onCheckedChange={(val) => setFormState({ ...formState, featured: val })} />
                </div>
              </TabsContent>

            </div>
          </Tabs>

          <DialogFooter className="p-6 bg-slate-50 border-t flex flex-wrap gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-full px-5 h-11 text-xs uppercase tracking-wider font-bold border-slate-200">
              Discard Changes
            </Button>
            <Button onClick={handleSave} className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 h-11 text-xs uppercase tracking-wider font-bold shadow-md">
              {editingId ? 'Push Live Parameters' : 'Deploy Package Live'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Replaced Confirm window.alert layout flow with shadcn-ui AlertDialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-[2rem] max-w-md p-6 border-none shadow-2xl">
          <AlertDialogHeader className="space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <AlertDialogTitle className="text-xl font-serif font-bold text-slate-900">Purge Data Reference?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-xs font-light leading-relaxed">
              This choice unlinks database rows instantly. Active shoppers will lose availability lookup pathways instantly. This action cannot be reverted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-2">
            <AlertDialogCancel className="rounded-full border-slate-200 h-11 text-xs uppercase tracking-wider font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-full bg-rose-600 hover:bg-rose-700 text-white h-11 text-xs uppercase tracking-wider font-bold shadow-md shadow-rose-700/10">
              Confirm Purge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AdminLayout>
  );
}