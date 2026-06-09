import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import HotelCard from '@/components/HotelCard';
import { Hotel } from '@/types/hotel';

interface FeaturedHotelsProps {
  hotels: Hotel[];
  isLoading: boolean;
  onEnquire: (hotel: Hotel) => void;
}

function SkeletonCard() {
  return (
    <div className="relative p-px bg-white/10 rounded-[2.5rem] overflow-hidden">
      <div className="bg-[#030a1c] rounded-[2.4rem] overflow-hidden flex flex-col h-full animate-pulse">
        <div className="h-[45vh] min-h-[350px] bg-slate-800/50" />
        <div className="p-8 space-y-4">
          <div className="h-8 bg-slate-800/50 rounded w-3/4" />
          <div className="h-4 bg-slate-800/50 rounded w-full" />
          <div className="h-12 bg-slate-800/50 rounded w-full mt-6" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturedHotels({ hotels, isLoading, onEnquire }: FeaturedHotelsProps) {
  return (
    <section className="relative py-40 bg-[#020617] overflow-hidden selection:bg-emerald-500/30">
      {/* Background: Cinematic depth to match Edge section */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.07)_0%,transparent_50%)] pointer-events-none" />
      
      {/* Signature Vertical Line element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-24 w-px bg-gradient-to-b from-transparent to-emerald-500/50" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-8 lg:px-16">
        
        {/* Editorial Header */}
        <div className="flex flex-col items-center text-center mb-28 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="h-px w-12 bg-emerald-500/30" />
            <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-400 font-bold">
              Curated For You
            </p>
            <div className="h-px w-12 bg-emerald-500/30" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-8xl text-white tracking-tight leading-none max-w-5xl"
          >
            Featured <span className="italic font-extralight text-emerald-400">Resorts</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 font-light text-lg max-w-2xl leading-relaxed italic"
          >
            "Handpicked accommodations across the Southern Atolls — each personally vetted by our team to ensure an unrivaled experience."
          </motion.p>
        </div>

        {/* Grid Layout */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
              {hotels.map((hotel, index) => (
                <motion.div 
                  key={hotel.id} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="w-full flex justify-center"
                >
                  <HotelCard
                    hotel={hotel}
                    onEnquire={onEnquire}
                  />
                </motion.div>
              ))}
            </div>

            {/* Cinematic CTA */}
            <div className="mt-32 flex flex-col items-center">
              <div className="relative h-20 w-px bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent mb-12" />
              
              <Link to="/hotels">
                <button className="group relative flex items-center gap-6 px-14 py-6 overflow-hidden border border-emerald-500/40 rounded-full transition-all duration-500 hover:border-emerald-300">
                  <span className="relative z-10 text-[12px] uppercase tracking-[0.5em] font-bold text-white z-10">
                    Find your Stay
                  </span>
                  <ArrowRight className="relative z-10 w-5 h-5 text-emerald-400 group-hover:translate-x-2 transition-all z-10" />
                  
                  {/* Slide-up Background */}
                  <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </button>
              </Link>

              <div className="mt-12 flex items-center gap-2 text-emerald-500/40">
                <Sparkles className="w-4 h-4" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Southern Atoll Exclusives</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer vertical line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 w-px bg-gradient-to-t from-transparent to-emerald-500/50" />
    </section>
  );
}