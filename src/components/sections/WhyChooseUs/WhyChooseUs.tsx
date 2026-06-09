import { Award, Globe, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Await } from 'react-router-dom';

const features = [
  {
    icon: Globe,
    title: 'The Local Authority',
    desc: "Southern Maldives Travels operates as your personal concierge from within the atolls. We aren't just experts on the destination; we are part of its geography.",
  },
  {
    icon: Award,
    title: 'Personal Travel Planning',
    desc: "Every journey is tailored to you. As a local agency in the southern Maldives, we craft personalized itineraries based on your pace and budget — with insider access and care that algorithms can't match.",
  },
  {
    icon: Users,
    title: 'Authentic Island Experiences',
    desc: "We do not sell what we haven't experienced. Every villa, vintage, and reef in our portfolio has been personally vetted by our consultants to ensure it meets our standard of excellence.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-32 bg-white overflow-hidden selection:bg-emerald-50">
      {/* Background: Softest radial glow to define the center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Signature Vertical Line element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-20 w-px bg-gradient-to-b from-transparent to-emerald-100" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-8 lg:px-16">
        
        {/* Editorial Header */}
        <div className="flex flex-col items-center text-center mb-28 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="h-px w-10 bg-emerald-100" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-600 font-bold">
              Why Travl With Us
            </span>
            <div className="h-px w-10 bg-emerald-100" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl text-slate-900 tracking-tight leading-none max-w-4xl"
          >
            The Southern Maldives <br />
            <span className="italic font-extralight text-emerald-500">Difference</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 font-light text-lg max-w-2xl leading-relaxed italic"
          >
            "Exclusivity is not just about where you go, but who takes you there."
          </motion.p>
        </div>

        {/* Feature Cards: Editorial Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card Container with subtle p-px gradient border for light mode */}
              <div className="relative p-px bg-gradient-to-b from-emerald-100 to-transparent rounded-[2.5rem] h-full transition-all duration-700 group-hover:from-emerald-400/40">
                <div className="relative h-full p-10 bg-white rounded-[2.4rem] transition-all duration-700 group-hover:-translate-y-2 flex flex-col items-center text-center">
                  
                  {/* Minimalist Icon Frame */}
                  <div className="relative mb-10">
                    <div className="absolute inset-0 border border-emerald-100 rounded-full scale-[1.6] group-hover:scale-[1.8] group-hover:border-emerald-200 transition-all duration-700 ease-out" />
                    <div className="relative w-12 h-12 flex items-center justify-center border border-emerald-50 rounded-full bg-slate-50 transition-colors group-hover:bg-emerald-500">
                      <Icon className="h-5 w-5 text-emerald-800 transition-colors group-hover:text-white stroke-[1.25px]" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-serif text-2xl text-slate-900 tracking-wide italic">
                      {title}
                    </h3>

                    {/* Signature Line Accent */}
                    <div className="w-8 h-px bg-emerald-200 mx-auto group-hover:w-16 group-hover:bg-emerald-400 transition-all duration-700" />

                    <p className="text-slate-500 leading-relaxed text-[15px] font-light max-w-[280px] mx-auto group-hover:text-slate-600 transition-colors">
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing Signature Element */}
        <div className="mt-28 flex flex-col items-center">
            <Sparkles className="w-5 h-5 text-emerald-200 mb-6" />
            <div className="h-20 w-px bg-gradient-to-t from-transparent to-emerald-100" />
        </div>
      </div>
    </section>
  );
}