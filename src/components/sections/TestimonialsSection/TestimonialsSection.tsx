import { motion, useMotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, MousePointer2, Sparkles } from 'lucide-react';
import { Testimonial } from '@/types/testimonial';
import SafeAvatar from '@/components/SafeAvatar';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  isLoading: boolean;
}

export default function TestimonialsSection({ testimonials, isLoading }: TestimonialsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const x = useMotionValue(0);

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current) {
        const scrollWidth = containerRef.current.scrollWidth;
        const offsetWidth = containerRef.current.offsetWidth;
        const newLeft = -(scrollWidth - offsetWidth);
        setConstraints({ left: newLeft, right: 0 });
        const currentX = x.get();
        if (currentX < newLeft) x.set(newLeft);
        if (currentX > 0) x.set(0);
      }
    };
    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [testimonials, x]);

  if (isLoading || testimonials.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    const step = 480;
    const currentX = x.get();
    let newX = direction === 'left' ? currentX + step : currentX - step;
    newX = Math.min(Math.max(newX, constraints.left), constraints.right);
    x.set(newX);
  };

  return (
    <section className="relative py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden selection:bg-emerald-100">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 right-0 w-96 h-96 bg-emerald-50/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-amber-50/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)]" />
      </div>

      <div className="relative max-w-[1800px] mx-auto px-8 lg:px-16">
        
        {/* Editorial Header – refined typography and spacing */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="flex flex-col space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-emerald-400/60" />
              <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-600 font-bold">
                Guest Chronicles
              </p>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-slate-900 tracking-tight leading-[1.1]">
              Voices of the <br />
              <span className="italic font-light text-emerald-500">Deep South</span>
            </h2>
            <p className="text-slate-500 max-w-md text-sm font-light leading-relaxed hidden md:block">
              Real stories from travellers who discovered the magic of the Southern Maldives.
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => scroll('left')}
              className="p-4 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-emerald-900 hover:border-emerald-900 hover:text-white transition-all duration-300 group focus:outline-none shadow-sm hover:shadow-lg"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 group-active:scale-90" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-4 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-emerald-900 hover:border-emerald-900 hover:text-white transition-all duration-300 group focus:outline-none shadow-sm hover:shadow-lg"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 group-active:scale-90" />
            </button>
          </div>
        </div>

        {/* Draggable Carousel Track */}
        <motion.div 
          ref={containerRef}
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.1}
          style={{ x }}
          whileTap={{ cursor: 'grabbing' }}
          className="flex gap-8 cursor-grab active:cursor-grabbing pb-8"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </motion.div>

        {/* Status Line – refined styling */}
        <div className="mt-14 flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 text-emerald-400/80">
            <MousePointer2 size={14} className="animate-bounce" />
            <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-slate-400">Swipe or drag to explore stories</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #10b98160; 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #10b981;
        }
      `}</style>
    </section>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [testimonial.content]);

  return (
    <motion.article
      className="shrink-0 w-[85vw] md:w-[460px] select-none"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
    >
      <div className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100/80 h-[620px] flex flex-col overflow-hidden">
        
        {/* Decorative top line */}
        <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-500 to-emerald-200 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        <div className="flex flex-col h-full p-8 md:p-10">

          {/* Header with refined badges */}
          <div className="flex justify-between items-start mb-6 shrink-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-emerald-500" />
                <span className="text-[9px] font-mono text-emerald-600 font-bold tracking-wider">
                  MEMOIR NO. {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className={i < testimonial.rating ? "fill-emerald-400 text-emerald-400" : "text-slate-200"} />
                ))}
              </div>
            </div>
            <div className="bg-emerald-50/50 p-2 rounded-full">
              <Quote className="text-emerald-400/70 w-6 h-6" />
            </div>
          </div>

          {/* Scrollable content with improved gradients */}
          <div className="relative flex-1 overflow-hidden my-4">
            {isOverflowing && (
              <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white via-white/90 to-transparent z-10 pointer-events-none" />
            )}

            <div
              ref={scrollRef}
              className="overflow-y-auto custom-scrollbar pr-2 py-8 h-full"
            >
              <p className="text-xl md:text-2xl font-serif font-light italic text-slate-700 leading-relaxed">
                “{testimonial.content}”
              </p>
            </div>

            {isOverflowing && (
              <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent z-10 pointer-events-none" />
            )}
          </div>

          {/* Footer with avatar and meta */}
          <div className="mt-6 pt-6 border-t border-slate-100 shrink-0 flex items-center gap-4">
            <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
              <SafeAvatar
                src={testimonial.avatar_url}
                alt={testimonial.author_name}
                imgClassName="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                containerClassName="h-full w-full"
              />
            </div>

            <div className="flex flex-col">
              <cite className="text-base font-semibold text-slate-800 not-italic tracking-tight">
                {testimonial.author_name}
              </cite>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                <span className="text-[9px] text-slate-400 uppercase font-medium tracking-[0.2em]">
                  Southern Atolls Guest
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}