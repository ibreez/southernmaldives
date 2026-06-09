import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEnquiryModalStore } from '@/stores/enquiryModalStore';

export default function CTASection() {
  const openEnquiryModal = useEnquiryModalStore((state) => state.open);

  return (
    <section className="relative py-40 bg-white overflow-hidden selection:bg-emerald-100">
      {/* Background: Softer, cleaner radial glow for light mode */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.04)_0%,transparent_60%)] pointer-events-none" />
      
      {/* Decorative vertical line (Signature element) - Swapped to a subtle emerald/slate mix */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-24 w-px bg-gradient-to-b from-transparent to-emerald-200" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-8 lg:px-16 text-center">
        
        {/* Eyebrow: Darker text for readability on white */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <div className="h-px w-8 bg-emerald-100" />
          <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-600 font-bold">
            Your Journey Awaits
          </span>
          <div className="h-px w-8 bg-emerald-100" />
        </motion.div>

        {/* Headline: Slate-900 for premium contrast */}
        <motion.h2 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif text-5xl md:text-8xl text-slate-900 tracking-tight leading-[1.1] mb-10"
        >
          Ready to Explore <br />
          <span className="italic font-extralight text-emerald-500">the Southern Atolls?</span>
        </motion.h2>

        {/* Paragraph: Darker slate with softer opacity */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 font-light text-lg md:text-xl mb-16 max-w-2xl mx-auto leading-relaxed italic"
        >
          "Let our local experts craft a journey as unique as you are — exclusive access, insider knowledge, and total peace of mind."
        </motion.p>

        {/* The Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <button
            type="button"
            onClick={() => openEnquiryModal()}
            className="group relative flex items-center gap-6 px-14 py-6 overflow-hidden border border-emerald-200 rounded-full transition-all duration-500 hover:border-emerald-600"
          >
            {/* Text Layer: Dark slate to White transition */}
            <span className="relative z-10 text-[12px] uppercase tracking-[0.5em] font-bold text-slate-900 group-hover:text-white transition-colors duration-500">
              Begin Your Experience
            </span>
            
            {/* Icon */}
            <ArrowRight className="relative z-10 w-5 h-5 text-emerald-600 group-hover:translate-x-2 group-hover:text-white transition-all duration-500" />
            
            {/* Slide-up Background: Darker Emerald for impact */}
            <div className="absolute inset-0 bg-emerald-700 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </button>
          
          {/* Secondary Link: Muted slate to Emerald hover */}
          <Link 
            to="/hotels" 
            className="mt-12 text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400 hover:text-emerald-600 transition-all underline underline-offset-[12px] decoration-slate-200 hover:decoration-emerald-500/40"
          >
            Discover Your Stay
          </Link>
        </motion.div>
      </div>

      {/* Footer vertical line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 w-px bg-gradient-to-t from-transparent to-emerald-200" />
    </section>
  );
}