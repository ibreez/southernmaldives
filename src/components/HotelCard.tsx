import { useRef } from 'react';
import { MapPin, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hotel } from '@/types/hotel';
import { motion } from 'framer-motion';

interface HotelCardProps {
  hotel: Hotel;
  onEnquire: (hotel: Hotel) => void;
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star 
          key={i} 
          className={`h-2 w-2 ${i < count ? 'fill-emerald-600 text-emerald-600' : 'text-slate-200'}`} 
        />
      ))}
    </div>
  );
}

export default function HotelCard({ hotel, onEnquire }: HotelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => videoRef.current?.play().catch(() => { });
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col h-full w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative flex flex-col h-full bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-md transition-all duration-500 hover:shadow-xl hover:shadow-emerald-900/5">
        
        {/* Media Section - Reduced height for Grid layout */}
        <div className="relative h-[320px] overflow-hidden">
          {hotel.cinemagraph_url ? (
            <video
              ref={videoRef}
              src={hotel.cinemagraph_url}
              poster={hotel.images[0]}
              loop muted playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}

          {/* Luxury Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 text-white border border-emerald-800/50 shadow-lg">
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8px] tracking-[0.15em] font-bold uppercase">
                {hotel.category || 'Luxury'}
              </span>
            </div>
          </div>

          {/* Rating - Top Right */}
          <div className="absolute top-4 right-4 z-10">
            <StarRating count={hotel.star_rating} />
          </div>

          {/* Compact Price Tag */}
          <div className="absolute bottom-6 left-6 z-10">
            <span className="block text-[8px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-0.5">Starting From</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-serif text-[#022c22] italic leading-none">
                ${hotel.price || '---'}
              </span>
              <span className="text-emerald-800/60 text-[9px] tracking-tighter uppercase font-bold">/ Night</span>
            </div>
          </div>
        </div>

        {/* Content Section - Compact Padding */}
        <div className="relative px-6 pb-8 flex flex-col flex-grow bg-white -mt-2">
          
          {/* Location Meta */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-emerald-700/80">
              <MapPin className="h-2.5 w-2.5" />
              <span className="text-[9px] uppercase tracking-wider font-bold truncate">
                {hotel.location}
              </span>
            </div>
          </div>

          {/* Hotel Name - Scaled down for Grid */}
          <Link to={`/hotels/${hotel.id}`} className="block mb-3">
            <h3 className="font-serif text-2xl text-[#022c22] leading-tight transition-colors group-hover:text-emerald-800">
              {hotel.name}
            </h3>
          </Link>

          {/* Description - 2 Line Clamp is critical for Grid alignment */}
          <p className="text-slate-500 text-[13px] font-light leading-relaxed line-clamp-2 mb-6">
            {hotel.description}
          </p>

          {/* Reserve Button - Slimmer height */}
          <div className="mt-auto">
            <button
              onClick={() => onEnquire(hotel)}
              className="group/btn relative w-full h-[50px] flex items-center justify-between px-6 overflow-hidden rounded-xl bg-[#022c22] hover:bg-[#043d32] transition-all duration-300 shadow-md"
            >
              <div className="relative z-10 flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white">
                  Enquire Now
                </span>
              </div>
              
              <div className="relative z-10 flex items-center gap-3">
                <div className="h-px w-6 bg-white/20 group-hover/btn:w-10 transition-all duration-500" />
                <ArrowRight className="h-3.5 w-3.5 text-white" />
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}