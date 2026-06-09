import { useState, useEffect } from 'react';
import { Search, Compass, SlidersHorizontal, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import HotelCard from '@/components/HotelCard';
import { useEnquiryModalStore } from '@/stores/enquiryModalStore';
import { useHotels } from '@/hooks/useHotels';

export default function Hotels() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(false);

  // Track page scroll coordinates to handle floating animations natively
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

  const openEnquiryModal = useEnquiryModalStore((state) => state.open);
  const { data: hotels = [], isLoading } = useHotels();

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || hotel.category === categoryFilter;
    const matchesRating = ratingFilter === 'all' || hotel.star_rating === parseInt(ratingFilter);
    return matchesSearch && matchesCategory && matchesRating;
  });

  const categories = Array.from(new Set((hotels || []).map((h) => h.category).filter(Boolean)));
  
  const activeFiltersCount = [
    searchTerm !== '',
    categoryFilter !== 'all',
    ratingFilter !== 'all'
  ].filter(Boolean).length;

  const showFullDesktopFilter = !isScrolled || isPinnedExpanded;

  // Filter Content Component to avoid repetition
  const FilterContent = ({ isMobile = false }) => (
    <div className={`flex ${isMobile ? 'flex-col gap-10' : 'flex-col lg:flex-row gap-8 items-center justify-between w-full'}`}>
      {/* Search */}
      <div className={`relative group w-full ${!isMobile && 'lg:max-w-md'}`}>
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600/40 group-focus-within:text-emerald-600 transition-colors" />
        <input
          type="text"
          placeholder="Discover your escape…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 w-full h-12 bg-transparent border-b border-slate-200 focus:border-emerald-500/50 text-slate-900 font-light tracking-wide outline-none transition-all placeholder:text-slate-400 text-sm"
        />
      </div>

      <div className={`flex ${isMobile ? 'flex-col gap-8' : 'flex-wrap items-center gap-10'} w-full lg:w-auto justify-end`}>
        {/* Category */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">Category</span>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[160px]'} h-10 border-0 border-b border-slate-200 rounded-none bg-transparent text-slate-800 focus:ring-0 text-[10px] uppercase tracking-[0.2em] font-bold`}>
              <SelectValue placeholder="All Tiers" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-100 text-slate-800 rounded-xl">
              <SelectItem value="all" className="uppercase text-[9px] tracking-widest">All Tiers</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="uppercase text-[9px] tracking-widest">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">Rating</span>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[140px]'} h-10 border-0 border-b border-slate-200 rounded-none bg-transparent text-slate-800 focus:ring-0 text-[10px] uppercase tracking-[0.2em] font-bold`}>
              <SelectValue placeholder="Stars" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-100 text-slate-800 rounded-xl">
              <SelectItem value="all" className="uppercase text-[9px] tracking-widest">All Ratings</SelectItem>
              <SelectItem value="5" className="uppercase text-[9px] tracking-widest text-emerald-600 font-bold">5 Stars</SelectItem>
              <SelectItem value="4" className="uppercase text-[9px] tracking-widest">4 Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isMobile && (
        <Button 
          onClick={() => setIsFilterDrawerOpen(false)}
          className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-14 uppercase tracking-widest text-xs font-bold"
        >
          Show {filteredHotels.length} Results
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            src="/assets/hero-tropical-beach-sunset.webp"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-[#525557]" />
        </div>
        
        <div className="relative z-10 text-center px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-10 bg-emerald-600/30" />
              <span className="text-emerald-400 text-[10px] font-bold tracking-[0.5em] uppercase text-white/80">The Collection</span>
              <div className="h-px w-10 bg-emerald-600/30" />
            </div>
            <h1 className="font-serif text-6xl md:text-9xl tracking-tight leading-none">
              <span className="text-white">Tropical</span>{' '}
              <span className="italic font-extralight text-emerald-500 text-7xl md:text-8xl block md:inline">
                Sanctuaries
              </span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* High-Performance Filter Interface */}
      <div className="sticky top-[72px] z-40 px-4 lg:px-12 -mt-10">
        <div className="max-w-[1400px] mx-auto relative h-24 flex items-center justify-end">
          
          {/* Mobile Trigger */}
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
                    {searchTerm || 'Find a sanctuary...'}
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

          {/* Desktop Filter Platform Viewport Bounds */}
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

      {/* Mobile Drawer/Modal */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            {/* Drawer */}
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

      <main className="max-w-[1400px] mx-auto px-8 lg:px-16 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 border-b border-slate-200 pb-12">
          <div className="max-w-xl">
            <h2 className="font-serif text-5xl text-slate-900 tracking-tight leading-tight mb-4">
              {activeFiltersCount > 0 ? (
                <>Filtered <span className="italic text-emerald-600 font-light font-serif">Curations</span></>
              ) : (
                <>The Full <span className="italic text-emerald-600 font-light font-serif">Portfolio</span></>
              )}
            </h2>
            <p className="text-slate-500 font-light italic text-lg leading-relaxed">
              Discover sanctuaries where the horizon meets the equator.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
              <span className="text-[11px] uppercase tracking-[0.5em] text-emerald-600 font-bold">
                {filteredHotels.length} DESTINATIONS
              </span>
              <div className="h-px w-20 bg-emerald-600/30" />
          </div>
        </div>

        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                {/* Skeleton placeholders go here */}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                {filteredHotels.map((hotel) => (
                    <motion.div key={hotel.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <HotelCard hotel={hotel} onEnquire={openEnquiryModal} />
                    </motion.div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
}