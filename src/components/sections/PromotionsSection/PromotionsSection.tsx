import { Promotion } from '@/types/promotion';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromotionsSectionProps {
  promotions: Promotion[];
  isLoading: boolean;
}

export default function PromotionsSection({ promotions, isLoading }: PromotionsSectionProps) {
  if (isLoading || promotions.length === 0) return null;

  return (
    <section className="py-32 bg-[#022c22] relative overflow-hidden">
      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      
      {/* Decorative Equatorial Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-400/80">
                The Seasonal Collection
              </span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-6xl text-white leading-[1.1]"
            >
              Exclusively Curated <br />
              <span className="italic text-emerald-200">For The Discerning.</span>
            </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-emerald-100/60 font-light max-w-sm text-lg leading-relaxed border-l border-emerald-800/50 pl-8"
          >
            Bespoke itineraries and rare privileges, available for a fleeting moment in time.
          </motion.p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {promotions.map((promotion, index) => (
            <motion.div
              key={promotion.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm mb-8 bg-emerald-900 shadow-2xl">
                {/* Image Component */}
                <motion.img
                  src={promotion.image_url}
                  alt={promotion.title}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                
                {/* Refined Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
                
                {/* Floating "Limited" Badge */}
                <div className="absolute top-6 right-6 overflow-hidden">
                   <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full transform translate-y-0 transition-transform duration-500 group-hover:-translate-y-12">
                      <span className="text-[9px] text-white uppercase tracking-[0.2em] font-medium">Limited Access</span>
                   </div>
                   <div className="absolute inset-0 bg-amber-400 px-4 py-2 rounded-full transform translate-y-12 transition-transform duration-500 group-hover:translate-y-0 flex items-center justify-center">
                      <span className="text-[9px] text-emerald-950 uppercase tracking-[0.2em] font-bold">Inquire Now</span>
                   </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-4 px-2">
                <div className="flex items-center gap-4">
                  <span className="h-px w-8 bg-amber-400/50 transition-all duration-500 group-hover:w-16" />
                  <h3 className="font-serif text-3xl text-white group-hover:text-emerald-200 transition-colors">
                    {promotion.title}
                  </h3>
                </div>
                
                <p className="text-emerald-100/40 text-sm leading-relaxed max-w-md font-light group-hover:text-emerald-100/70 transition-colors">
                  {promotion.description}
                </p>

                <button className="flex items-center gap-2 pt-2 text-amber-400 text-[11px] uppercase tracking-[0.3em] font-bold group-hover:gap-4 transition-all">
                  Explore Privilege <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}