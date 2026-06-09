import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, LifeBuoy, Plane, Tag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: Tag,
    barrier: "It’s out of my budget.",
    edge: 'We unlock exclusive "Industry-Only" rates and boutique local island gems that offer high-end luxury at a fraction of the cost.',
  },
  {
    icon: Compass,
    barrier: "I don't know where to start.",
    edge: 'Your trip is curated by experts. We filter 1,200 islands down to the one that fits your vibe perfectly.',
  },
  {
    icon: Plane,
    barrier: "The transfers look complicated.",
    edge: 'From seaplanes to speedboats, we synchronize your entire itinerary. You land, we lead; no waiting, no confusion.',
  },
  {
    icon: LifeBuoy,
    barrier: "What if something goes wrong?",
    edge: 'Travel with a safety net. Our 24/7 concierge is available via WhatsApp to handle any detail, anytime.',
  },
];

export default function EmeraldEdge() {
  return (
    <section className="relative py-32 bg-[#020617] overflow-hidden selection:bg-emerald-500/30">
      {/* Cinematic Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.07)_0%,transparent_50%)] pointer-events-none" />

      <div className="relative mx-auto max-w-[1800px] px-8 lg:px-16 z-10">
        
        {/* Editorial Header */}
        <div className="flex flex-col items-center text-center mb-28 space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-emerald-500/30" />
            <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-400 font-bold">
              The Maldives, Simplified.
            </p>
            <div className="h-px w-12 bg-emerald-500/30" />
          </div>
          
          <h2 className="font-serif text-5xl md:text-8xl text-white tracking-tight leading-none max-w-5xl">
            Luxury is <span className="italic font-extralight text-emerald-400">Peace of Mind</span>
          </h2>
          
          <p className="text-slate-400 font-light text-lg max-w-2xl leading-relaxed italic">
            "Discover the Southern Maldives with a travel experience designed to feel personal, polished, and perfectly aligned with your expectations."
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, barrier, edge }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* The "Glow" Effect on Hover */}
              <div className="absolute -inset-4 bg-emerald-500/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Premium Gradient Border Card */}
              <div className="relative p-px bg-gradient-to-b from-white/10 to-transparent rounded-[2.2rem] h-full transition-all duration-700 group-hover:from-emerald-400/50">
                <div className="relative h-full p-8 bg-[#030a1c] rounded-[2.1rem] transition-all duration-700 group-hover:-translate-y-2">
                  
                  {/* Icon Wrapper */}
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 mb-8 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.25em] text-emerald-500/50 font-bold">The Challenge</span>
                      <h3 className="mt-2 text-lg font-serif italic text-slate-300 leading-snug">
                        "{barrier}"
                      </h3>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <span className="text-[9px] uppercase tracking-[0.25em] text-emerald-400 font-bold">The Emerald Edge</span>
                      <p className="mt-3 text-[14px] leading-relaxed text-slate-400 font-light group-hover:text-slate-200 transition-colors">
                        {edge}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cinematic CTA Section */}
        <div className="mt-32 flex flex-col items-center">
            <div className="relative h-20 w-px bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent mb-12" />
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Link to="/contact">
                <button className="group relative flex items-center gap-4 px-12 py-5 overflow-hidden border border-emerald-500/50 rounded-full transition-all duration-500 hover:border-emerald-400">
                   <span className="text-[11px] uppercase tracking-[0.4em] font-bold text-white z-10">
                     Start My Journey
                   </span>
                   <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-2 transition-transform z-10" />
                   <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </Link>

              <Link 
                to="/hotels" 
                className="text-[11px] uppercase tracking-[0.3em] font-bold text-slate-400 hover:text-emerald-400 transition-colors underline underline-offset-[12px] decoration-white/10 hover:decoration-emerald-500/50"
              >
                Explore Exclusive Stays
              </Link>
            </div>
        </div>
      </div>
    </section>
  );
}