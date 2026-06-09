import { useActiveInstagramFeeds } from '@/hooks/useInstagramFeed';
import { ArrowUpRight, ShieldCheck, Instagram, MousePointer2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import logo from '/logo.jpg';

export default function InstagramGallery() {
  const { data: feeds, isLoading, error } = useActiveInstagramFeeds();
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth;
      const offsetWidth = containerRef.current.offsetWidth;
      setConstraints({ left: -(scrollWidth - offsetWidth), right: 0 });
    }
  }, [feeds]);

  if (isLoading) {
    return (
      <section className="py-32 bg-[#020617]">
        <div className="max-w-[1800px] mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse aspect-[3/2] bg-slate-900/50 border border-slate-800/50 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !feeds || feeds.length === 0) return null;

  return (
    <section className="py-32 bg-[#020617] selection:bg-emerald-500/30 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-[1800px] mx-auto px-8 lg:px-16 relative z-10">
        
        {/* Cinematic Header */}
        <div className="flex flex-col items-center text-center mb-28 space-y-8">
          <h2 className="font-serif text-6xl md:text-9xl text-white tracking-tight leading-none">
            Moments <span className="italic font-extralight text-emerald-400">&</span> Frames
          </h2>
          <p className="text-slate-400 font-light text-lg max-w-lg leading-relaxed italic">
            "A visual diary of the Southern Atolls, curated for those who seek the extraordinary."
          </p>
          <a
            href="https://www.instagram.com/southern.maldives.travels/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-4 px-10 py-4 overflow-hidden border border-white/10 rounded-full transition-all duration-500 hover:border-emerald-500/50"
          >
            <Instagram className="w-5 h-5 text-emerald-400 transition-all duration-500 group-hover:text-white group-hover:rotate-12 z-10" />
            <span className="text-[11px] uppercase tracking-[0.4em] font-bold text-slate-300 transition-colors group-hover:text-white z-10">
              Follow Our Instagram
            </span>
            <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </a>
        </div>

        {/* The Draggable Track */}
        <motion.div 
          ref={containerRef}
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.1}
          className="flex gap-10 cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >
          {feeds
            .sort((a, b) => a.display_order - b.display_order)
            .map((feed, idx) => (
              <motion.div 
                key={feed.id} 
                // Increased width to 480px for a "widen" effect
                className="group relative shrink-0 w-[85vw] md:w-[480px] select-none"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative p-px bg-gradient-to-b from-white/20 to-transparent rounded-[2.2rem] transition-all duration-700 group-hover:from-emerald-400">
                  <div className="relative p-3 bg-white rounded-[2.1rem] transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] group-hover:-translate-y-3">
                    
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-[3px] border-l-[3px] border-emerald-600/20 rounded-tl-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-2 -translate-y-2" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[3px] border-r-[3px] border-emerald-600/20 rounded-br-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-2 translate-y-2" />

                    <div className="flex flex-col h-full border border-slate-100 rounded-[1.6rem] overflow-hidden">
                      {/* Post Header */}
                      <div className="flex items-center justify-between p-4 bg-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border border-emerald-100 p-0.5 group-hover:border-emerald-500/50 transition-colors">
                            <img src={logo} alt="Profile" className="w-full h-full rounded-full object-cover" draggable={false} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-slate-900 tracking-tight leading-none">@southern.maldives.travels</span>
                            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.15em] mt-1">Atoll Series</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono italic">#00{idx + 1}</span>
                      </div>

                      {/* Visual Content - Changed aspect to 3/2 to reduce height */}
                      <div className="px-5 pt-2">
                        <Link
                          to={feed.post_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative block aspect-[3/2] overflow-hidden rounded-xl bg-slate-100 shadow-inner"
                        >
                          <img
                            src={feed.image_url}
                            alt="Instagram Post"
                            className="h-full w-full object-cover transition-all duration-[2s] ease-out group-hover:scale-110"
                            draggable={false}
                          />
                          <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <div className="bg-emerald-600 p-4 rounded-full shadow-2xl scale-50 group-hover:scale-100 transition-all duration-500">
                              <ArrowUpRight className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </Link>
                      </div>

                      {/* Interaction Bar - Tightened Padding */}
                      <div className="flex items-center justify-between px-6 pt-5 pb-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-[0.25em] text-slate-400 font-bold mb-1">Coordinate</span>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Southern Maldives</span>
                          </div>
                        </div>
                        
                        <Link 
                          to={feed.post_link} 
                          target="_blank"
                          className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 hover:text-emerald-500 transition-all underline underline-offset-[6px] decoration-emerald-500/20 hover:decoration-emerald-500"
                        >
                          View Post
                        </Link>
                      </div>

                      {/* Caption Area - Tightened mt-4 to mt-2 */}
                      <div className="px-6 pb-6 mt-2 space-y-4">
                        <p className="text-[13px] text-slate-600 font-light leading-relaxed line-clamp-2 italic border-l-2 border-emerald-100 pl-4 group-hover:border-emerald-500 transition-all">
                          "{feed.caption}"
                        </p>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-medium">
                            Display Archive // {idx + 1}
                          </span>
                          <ShieldCheck className="w-4 h-4 text-emerald-600/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>

        {/* Drag Indicator */}
        <div className="mt-12 flex flex-col items-center justify-center">
           <div className="flex items-center gap-4 text-emerald-50">
              <MousePointer2 size={14} className="animate-bounce" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-medium">Swipe to Explore Gallery</span>
           </div>
        </div>

        {/* Footer Signature */}
        <div className="mt-18 flex flex-col items-center">
            <div className="relative h-20 w-px bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent mb-4">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-400 blur-sm opacity-50" />
            </div>
            <h3 className="font-serif italic text-2xl md:text-3xl bg-gradient-to-b from-emerald-50 to-emerald-500 bg-clip-text text-transparent tracking-[0.2em]">
              The Signature Collection
            </h3>
            <p className="mt-6 text-[8px] uppercase tracking-[1.2em] text-emerald-500 font-bold translate-x-3 transition-all hover:text-emerald-400 cursor-default">
                EST. Southern Maldives Travels
            </p>
        </div>
      </div>
    </section>
  );
}