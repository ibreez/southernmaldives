import { useMemo, useState, useEffect } from 'react';
import type { TravelPackage } from '@/types/package';
import PackageCard from '@/components/PackageCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  ChevronRight,
  X,
  Compass,
  DollarSign,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useSiteSettingsStore } from '@/stores/siteSettingsStore';
import { usePackages } from '@/hooks/usePackages';
import { motion, AnimatePresence } from 'framer-motion';

export interface TravelPackagesProps {
  packages?: TravelPackage[];
  isLoading?: boolean;
  onBookNow?: (pkg: TravelPackage) => void;
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  columns?: 1 | 2 | 3;
}

export function TravelPackages({
  packages,
  isLoading = false,
  onBookNow,
  title = "Our Travel Packages",
  subtitle = "Discover the beauty of the Maldives with our curated travel experiences",
  showFilters = true,
  showSearch = true,
  columns = 3,
}: TravelPackagesProps) {
  const { whatsappNumber } = useSiteSettingsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(false);

  // Monitor scroll behavior for the interactive transformation states
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 220) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setIsPinnedExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: fetchedPackages, isLoading: queryLoading } = usePackages();
  const loading = isLoading || queryLoading;
  
  const packageList = useMemo(
    () => (packages && packages.length > 0 ? packages : fetchedPackages ?? []),
    [packages, fetchedPackages]
  );

  const filteredPackages = useMemo(() => {
    let result = [...packageList];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(query) ||
          pkg.subtitle?.toLowerCase().includes(query) ||
          pkg.description.toLowerCase().includes(query) ||
          pkg.inclusions.some((inc) => inc.label.toLowerCase().includes(query))
      );
    }

    if (priceFilter !== "all") {
      switch (priceFilter) {
        case "under-1000":
          result = result.filter((pkg) => pkg.price < 1000);
          break;
        case "1000-1500":
          result = result.filter((pkg) => pkg.price >= 1000 && pkg.price <= 1500);
          break;
        case "1500+":
          result = result.filter((pkg) => pkg.price > 1500);
          break;
      }
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "duration":
        result.sort((a, b) => b.duration.nights - a.duration.nights);
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [packageList, searchQuery, sortBy, priceFilter]);

  const handleWhatsAppReservation = (pkg: TravelPackage) => {
    const phoneNumber = (pkg.contactInfo?.whatsapp || whatsappNumber || "+960 9495654").replace(/\D/g, '');
    const currency = pkg.currency === "USD" ? "$" : pkg.currency;
    const message = `Hello Southern Maldives Travels! I am interested in booking the "${pkg.title}" package (${pkg.duration.nights} Nights / ${pkg.duration.days} Days) for ${currency}${pkg.price.toLocaleString()}. Could you please provide more information on how to proceed with the reservation?`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const activeFiltersCount = [
    searchQuery !== '',
    priceFilter !== 'all',
    sortBy !== 'featured'
  ].filter(Boolean).length;

  const showFullDesktopFilter = !isScrolled || isPinnedExpanded;

  const gridCols = {
    1: "grid-cols-1 max-w-2xl mx-auto",
    2: "grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  const FilterContent = ({ isMobile = false }) => (
    <div className={`flex ${isMobile ? 'flex-col gap-10' : 'flex-col lg:flex-row gap-8 items-center justify-between w-full'}`}>
      {showSearch && (
        <div className={`relative group w-full ${!isMobile && 'lg:max-w-md'}`}>
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600/40 group-focus-within:text-emerald-600 transition-colors" />
          <input
            type="text"
            placeholder="Search paths, islands…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full h-12 bg-transparent border-b border-slate-200 focus:border-emerald-500/50 text-slate-900 font-light tracking-wide outline-none transition-all placeholder:text-slate-400 text-sm"
          />
        </div>
      )}

      {showFilters && (
        <div className={`flex ${isMobile ? 'flex-col gap-8' : 'flex-wrap items-center gap-10'} w-full lg:w-auto justify-end`}>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">Sort By</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[180px]'} h-10 border-0 border-b border-slate-200 rounded-none bg-transparent text-slate-800 focus:ring-0 text-[10px] uppercase tracking-[0.2em] font-bold`}>
                <SelectValue placeholder="Featured Collection" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-100 text-slate-800 rounded-xl">
                <SelectItem value="featured" className="uppercase text-[9px] tracking-widest">Featured Collection</SelectItem>
                <SelectItem value="price-low" className="uppercase text-[9px] tracking-widest">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="uppercase text-[9px] tracking-widest">Price: High to Low</SelectItem>
                <SelectItem value="duration" className="uppercase text-[9px] tracking-widest">Longest Stay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">Price Tier</span>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[150px]'} h-10 border-0 border-b border-slate-200 rounded-none bg-transparent text-slate-800 focus:ring-0 text-[10px] uppercase tracking-[0.2em] font-bold`}>
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-100 text-slate-800 rounded-xl">
                <SelectItem value="all" className="uppercase text-[9px] tracking-widest">All Tiers</SelectItem>
                <SelectItem value="under-1000" className="uppercase text-[9px] tracking-widest">Under $1,000</SelectItem>
                <SelectItem value="1000-1500" className="uppercase text-[9px] tracking-widest">$1,000 - $1,500</SelectItem>
                <SelectItem value="1500+" className="uppercase text-[9px] tracking-widest">$1,500+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {isMobile && (
        <Button 
          onClick={() => setIsFilterDrawerOpen(false)}
          className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-14 uppercase tracking-widest text-xs font-bold"
        >
          Show {filteredPackages.length} Results
        </Button>
      )}
    </div>
  );

  if (loading) {
    return (
      <section className="py-32 px-8 max-w-[1400px] mx-auto bg-[#F8FAFC]">
        <div className="text-center mb-16 space-y-4">
          <Skeleton className="h-4 w-24 mx-auto rounded-full" />
          <Skeleton className="h-12 w-96 mx-auto rounded-xl" />
          <Skeleton className="h-5 w-[500px] mx-auto rounded-lg" />
        </div>
        <div className={`grid ${gridCols[columns]} gap-10`}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[2.5rem] overflow-hidden border border-slate-100 p-4 space-y-6 bg-white">
              <Skeleton className="h-72 w-full rounded-[2rem]" />
              <div className="px-2 space-y-4">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-24 w-full rounded-2xl" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 flex-1 rounded-xl" />
                  <Skeleton className="h-12 flex-1 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            src="/assets/hero-packages.jpg"
            alt="Maldives Travel Experiences"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-[#525557]" />
        </div>

        <div className="relative z-10 text-center px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-10 bg-emerald-600/30" />
              <span className="text-emerald-400 text-[10px] font-bold tracking-[0.5em] uppercase text-white/80">Our Catalog</span>
              <div className="h-px w-10 bg-emerald-600/30" />
            </div>
            
            <h1 className="font-serif text-6xl md:text-9xl tracking-tight leading-none">
              <span className="text-white">Timeless</span>{' '}
              <span className="italic font-extralight text-emerald-500 text-7xl md:text-8xl block md:inline">
                Island Escapes
              </span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* High-Performance Filter Interface */}
      <div className="sticky top-[72px] z-40 px-4 lg:px-12 -mt-10">
        <div className="max-w-[1400px] mx-auto relative h-24 flex items-center justify-end">
          
          {/* Mobile Drawer Trigger Row */}
          <div className="lg:hidden w-full">
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="w-full bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-xl rounded-2xl p-4 flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-emerald-600 p-2.5 rounded-xl text-white">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Refine Search</p>
                  <p className="text-xs text-slate-500 font-light italic">
                    {searchQuery || 'Find your collection...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            </button>
          </div>

          {/* Desktop Filtering Platform Viewport Bounds */}
          <div className="hidden lg:block w-full relative">
            <AnimatePresence>
              {showFullDesktopFilter && (
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                  style={{ willChange: "transform, opacity" }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-full p-px bg-gradient-to-r from-emerald-200 via-slate-200 to-emerald-200 shadow-xl shadow-slate-200/40 rounded-[2.5rem]"
                >
                  <div className="bg-white/95 backdrop-blur-2xl rounded-[2.4rem] px-8 py-6 flex items-center w-full relative">
                    <FilterContent />

                    {/* Collapse Button */}
                    {isScrolled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPinnedExpanded(false);
                        }}
                        className="absolute -bottom-4 right-8 bg-slate-900 text-white rounded-full p-1.5 shadow-md hover:bg-emerald-600 transition-all duration-200 hover:scale-110 active:scale-95"
                        title="Collapse filters"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapsed Pill Button */}
            <AnimatePresence>
              {!showFullDesktopFilter && (
                <motion.button
                  key="collapsed-pill-trigger"
                  initial={{ opacity: 0, scale: 0.7, x: 30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.7, x: 30 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ willChange: "transform, opacity" }}
                  onClick={() => setIsPinnedExpanded(true)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-px bg-gradient-to-r from-emerald-200 via-slate-200 to-emerald-200 shadow-lg shadow-slate-200/30 rounded-full"
                >
                  <div className="bg-white/95 backdrop-blur-2xl px-6 py-3 rounded-full flex items-center gap-2.5">
                    <div className="bg-emerald-600 text-white p-1.5 rounded-full">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-slate-800 font-bold text-[10px] uppercase tracking-[0.2em]">
                      Filters
                    </span>
                    
                    {activeFiltersCount > 0 && (
                      <span className="bg-emerald-100 text-emerald-700 h-4 w-4 rounded-full flex items-center justify-center font-serif text-[9px] font-bold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Portal */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 top-20 bg-white rounded-t-[3rem] z-[101] lg:hidden overflow-hidden flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-slate-50">
                <h3 className="font-serif text-2xl italic text-slate-900">Refine Selection</h3>
                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-slate-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 pt-4">
                <FilterContent isMobile />
                
                <div className="mt-12 pt-12 border-t border-slate-50 flex flex-col items-center gap-4 opacity-40">
                    <Compass className="h-6 w-6 text-emerald-600" />
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold">Equatorial Curations</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Directory Grid Space */}
      <main className="max-w-[1400px] mx-auto px-8 lg:px-16 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 border-b border-slate-200 pb-12">
          <div className="max-w-xl">
            <h2 className="font-serif text-5xl text-slate-900 tracking-tight leading-tight mb-4">
              {activeFiltersCount > 0 ? (
                <>Filtered <span className="italic text-emerald-600 font-light font-serif">Curations</span></>
              ) : (
                <>Our Travel <span className="italic text-emerald-600 font-light font-serif">Packages</span></>
              )}
            </h2>
            <p className="text-slate-500 font-light italic text-lg leading-relaxed">
              {subtitle}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
              <span className="text-[11px] uppercase tracking-[0.5em] text-emerald-600 font-bold">
                {filteredPackages.length} {filteredPackages.length !== 1 ? 'EXPERIENCES' : 'EXPERIENCE'}
              </span>
              <div className="h-px w-20 bg-emerald-600/30" />
          </div>
        </div>

        {/* Packages Flex Grid Layout */}
        {filteredPackages.length > 0 ? (
          <div className={`grid ${gridCols[columns]} gap-x-12 gap-y-24 items-stretch`}>
            {filteredPackages.map((pkg) => (
              <motion.div 
                key={pkg.id} 
                layout 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="h-full flex flex-col"
              >
                <PackageCard
                  package={pkg}
                  onViewDetails={setSelectedPackage}
                  onBookNow={onBookNow}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-28 border border-dashed border-slate-200 rounded-[3rem] bg-white">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-6 w-6 text-slate-400 stroke-[1.5px]" />
            </div>
            <h3 className="font-serif text-2xl text-slate-800 mb-2">No matching paths found</h3>
            <p className="text-slate-500 font-light text-sm max-w-sm mx-auto mb-6">
              Adjust your parameters to find available luxury spaces or clear your active parameters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setPriceFilter("all");
                setSortBy("featured");
              }}
              className="rounded-full px-6 border-slate-200 hover:bg-slate-50 text-xs font-medium"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Rebuilt High-End Luxury Side Panel */}
        <Sheet open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
          <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-hidden bg-slate-50 border-l border-slate-200 p-0 shadow-2xl flex flex-col justify-between group/sheet">
            {selectedPackage && (
              <>
                {/* Scrollable Container Window */}
                <div className="flex-1 overflow-y-auto">
                  {/* Hero Image Section - Full Bleed with Overlay Elements */}
                  <div className="relative group/image">
                    <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-[16/9] overflow-hidden bg-slate-950">
                      <img
                        src={selectedPackage.images[0]}
                        alt={selectedPackage.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover/image:scale-105"
                      />
                      {/* Sophisticated gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent" />
                    </div>
                    
                    {/* Floating Action Buttons */}
                    <button
                      onClick={() => setSelectedPackage(null)}
                      className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg text-slate-700 hover:bg-white hover:scale-105 transition-all duration-200"
                      aria-label="Close details"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    
                    {/* Package Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-emerald-600/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-white text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        Signature Collection
                      </div>
                    </div>
                    
                    {/* Duration Pill Overlay */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white/90 text-xs font-medium flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-emerald-400" />
                        <span>{selectedPackage.duration.nights} Nights / {selectedPackage.duration.days} Days</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Body - Enhanced Spacing & Typography */}
                  <div className="px-6 py-6 sm:px-8 sm:py-8 space-y-8">
                    
                    {/* Title Section */}
                    <div className="space-y-3">
                      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
                        {selectedPackage.title}
                      </h2>
                      {selectedPackage.subtitle && (
                        <p className="text-slate-500 text-base italic leading-relaxed border-l-[3px] border-emerald-500 pl-4">
                          {selectedPackage.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Key Metrics Grid - Redesigned with better visual weight */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Price Card */}
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 transition-all hover:shadow-md">
                        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                          <DollarSign className="h-5 w-5 stroke-[1.5px]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Starting from</p>
                          <p className="text-xl font-serif font-bold text-slate-900">
                            {selectedPackage.currency === "USD" ? "$" : selectedPackage.currency}
                            {selectedPackage.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Capacity Card */}
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 transition-all hover:shadow-md">
                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 flex-shrink-0">
                          <Users className="h-5 w-5 stroke-[1.5px]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Guest Capacity</p>
                          <p className="text-base font-semibold text-slate-800">
                            Up to {selectedPackage.persons} guests
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Overview Section - Elevated description */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-px w-6 bg-emerald-500/50"></div>
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Overview</h3>
                      </div>
                      <div className="bg-white/80 rounded-2xl p-5 border border-slate-100 shadow-sm backdrop-blur-sm">
                        <p className="text-slate-600 font-light text-sm sm:text-base leading-relaxed">
                          {selectedPackage.description}
                        </p>
                      </div>
                    </div>

                    {/* Inclusions Section - Modern grid with check icons */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">What's Included</h3>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5">
                          {selectedPackage.inclusions.map((inclusion, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 group/inclusion">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5 transition-transform group-hover/inclusion:scale-110" />
                              <span className="font-light leading-normal">{inclusion.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Highlights Section - Interactive tag cloud */}
                    {selectedPackage.highlights && selectedPackage.highlights.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Experience Highlights</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedPackage.highlights.map((highlight, idx) => (
                            <span
                              key={idx}
                              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-xs font-light tracking-wide shadow-sm transition-all duration-200 hover:border-emerald-400 hover:text-emerald-700 hover:shadow-md cursor-default"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Travel Advisory & Deadlines - Enhanced visual */}
                    {(selectedPackage.bookingDeadline || selectedPackage.travelDates) && (
                      <div className="bg-gradient-to-r from-emerald-50/80 to-white rounded-2xl p-5 border border-emerald-100/60 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <Calendar className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Booking Timeline</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          {selectedPackage.bookingDeadline && (
                            <div className="flex justify-between items-center border-b border-emerald-100/40 pb-2">
                              <span className="text-slate-500 font-light">Reservation deadline</span>
                              <span className="text-slate-800 font-semibold">{selectedPackage.bookingDeadline}</span>
                            </div>
                          )}
                          {selectedPackage.travelDates && (
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 font-light">Travel window</span>
                              <span className="text-slate-800 font-semibold text-right">{selectedPackage.travelDates}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sticky Footer CTA - Enhanced interactivity */}
                <div className="sticky bottom-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.03)] z-20">
                  <Button
                    onClick={() => {
                      if (onBookNow) {
                        onBookNow(selectedPackage);
                      } else {
                        handleWhatsAppReservation(selectedPackage);
                      }
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-full text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group/cta"
                  >
                    Reserve this journey —{" "}
                    {selectedPackage.currency === "USD" ? "$" : selectedPackage.currency}
                    {selectedPackage.price.toLocaleString()}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                  </Button>
                  <p className="text-[9px] text-center text-slate-400 mt-3 tracking-wider font-medium">
                    Secure your spot with a flexible deposit
                  </p>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
}