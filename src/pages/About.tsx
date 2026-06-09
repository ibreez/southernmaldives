import { Heart, MapPin, Briefcase, Star, Compass, Facebook, Instagram, Eye, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const values = [
  {
    icon: Star,
    title: 'Custom Trips Made Simple',
    desc: "We create personalized travel experiences based on your interests, style, and budget. From arrival to departure, we take care of the details so you can enjoy a smooth and stress-free trip.",
  },
  {
    icon: Briefcase,
    title: 'Personalized Planning',
    desc: "We work with you to understand your travel needs and preferences. Whether you’re looking for relaxation, adventure, or a romantic getaway, we help create a trip that fits you perfectly.",
  },
  {
    icon: Heart,
    title: 'Authentic & Bespoke',
    desc: "Our approach is grounded in authenticity. Through detailed research and local partnerships, we bring unmatched consistency and quality to every trip we organise.",
  },
  {
    icon: MapPin,
    title: 'Value Without Compromise',
    desc: "We create each trip based on your needs and preferences — giving you a travel experience that fits your style, budget, and expectations.",
  },
];

const experiences = [
  {
    emoji: '🌊',
    title: 'Diving Adventures',
    desc: 'Explore world-class diving in the Southern Maldives, including Addu Atoll and nearby marine hotspots.',
  },
  {
    emoji: '🏝',
    title: 'Local Island Experiences',
    desc: 'Experience authentic Maldivian culture, island life, local cuisine, and peaceful tropical escapes.',
  },
  {
    emoji: '💎',
    title: 'Resort Escapes',
    desc: 'Relax at carefully selected Maldives resorts, including luxury, honeymoon, and family-friendly stays.',
  },
  {
    emoji: '❤️',
    title: 'Honeymoon Packages',
    desc: 'Romantic Maldives experiences designed for couples and newlyweds.',
  },
  {
    emoji: '🌿',
    title: 'Wellness & Relaxation',
    desc: 'Slow travel, spa experiences, nature escapes, and peaceful island stays.',
  },
  {
    emoji: '✈️',
    title: 'Personalized Travel Planning',
    desc: 'Customized Maldives itineraries based on your travel style and budget.',
  },
];

export default function About() {
  return (
    <div className="bg-white selection:bg-emerald-100">
      {/* Hero: Cinematic Dark Mode */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-[#020617]">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src="/assets/hero-about-team.webp"
            alt="Southern Maldives Travels"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-transparent to-[#020617]" />
        </div>

        <div className="relative z-10 text-center px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-emerald-500/40" />
              <span className="text-emerald-400 text-[10px] font-bold tracking-[0.5em] uppercase">Our Story</span>
              <div className="h-px w-8 bg-emerald-500/40" />
            </div>
            
            <h1 className="font-serif text-6xl md:text-8xl text-white leading-[0.9] tracking-tight">
              About <br />
              <span className="italic font-extralight text-emerald-400">Southern Maldives</span>
            </h1>
            
            <p className="text-slate-400 font-light text-lg italic max-w-xl">
              "Your trusted partner in luxury Southern Atoll experiences, where local intelligence meets global standards."
            </p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 w-px bg-gradient-to-t from-emerald-500 to-transparent" />
      </section>

      {/* Who We Are: Clean Editorial Light Mode */}
      <section className="relative py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-600">The Institution</span>
                <h2 className="font-serif text-5xl text-slate-900 tracking-tight leading-tight">
                  Who We <span className="italic text-emerald-500">Are</span>
                </h2>
              </div>
              
              <div className="space-y-6 text-slate-600 font-light leading-relaxed text-lg">
                <p className="text-slate-500 font-light text-lg italic max-w-xl">
                  Southern Maldives Travels is a Maldives-based travel and tourism brand dedicated to creating meaningful, personalized, and authentic travel experiences for visitors exploring the beauty of the Maldives.
                </p>
                <p>
                  Operating under Southern Sea World Pvt Ltd, a company registered in 2019, Southern Maldives Travels was created with a passion for sharing the true essence of the Maldives, from local island experiences and marine adventures to relaxing resort escapes and cultural discoveries.
                </p>
                <p>
                   With a strong focus on hospitality, personalized service, and guest satisfaction, we aim to provide journeys that allow travelers to experience the natural beauty, culture, and warmth of Maldivian island life in a meaningful way.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-[3rem] overflow-hidden"
            >
              <img 
                src="/assets/team.jpg" 
                className="w-full h-full object-cover" 
                alt="Luxury Lifestyle"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[3rem]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section: Clean Editorial Light Mode Alternating Grid */}
      <section className="relative py-32 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-[3rem] overflow-hidden order-last lg:order-first"
            >
              <img 
                src="/assets/founder-shafaq.jpg" 
                className="w-full h-full object-cover" 
                alt="Shafaq Waseem - Founder"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[3rem]" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-600">Leadership</span>
                <h2 className="font-serif text-5xl text-slate-900 tracking-tight leading-tight">
                  Meet the <span className="italic text-emerald-500">Founder</span>
                </h2>
              </div>
              
              <div className="space-y-6 text-slate-600 font-light leading-relaxed text-lg">
                <div className="space-y-3">
                  <p className="text-slate-900 font-serif text-2xl italic leading-snug">
                    "Hi, I’m Shafaq Waseem, founder of Southern Maldives Travels."
                  </p>
                  
                  <div className="flex items-center gap-4 pt-1">
                    <a 
                      href="https://www.instagram.com/shafaqwasym?igsh=MXFwcDc4YWEweDViYg==" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 rounded-full border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all duration-300"
                      aria-label="Instagram Profile"
                    >
                      <Instagram className="w-4 h-4 stroke-[1.5px]" />
                    </a>
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 rounded-full border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all duration-300"
                      aria-label="Facebook Profile"
                    >
                      <Facebook className="w-4 h-4 stroke-[1.5px]" />
                    </a>
                  </div>
                </div>

                <p>
                  As a Maldivian passionate about tourism, hospitality, and authentic travel experiences, I created Southern Maldives Travels to help visitors discover a deeper side of the Maldives — from local island life and diving adventures to relaxing resort escapes.
                </p>
                <p>
                  Since childhood, I have always dreamed of becoming an entrepreneur and building something meaningful within the tourism industry — a field I have always been deeply passionate about. As a graduate with a Bachelor’s degree in Business Management, I wanted to combine my love for business, hospitality, and travel to create experiences that feel personal, authentic, and memorable for every guest.
                </p>
                <p>
                  With experience in customer service, hospitality, and tourism, my goal is to create personalized journeys that allow travelers to experience the beauty, culture, and warmth of the Maldives in a meaningful way.
                </p>
                <p className="text-emerald-700 font-medium bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                  I especially love promoting the unique charm of Southern Maldives, including Addu Atoll and its incredible marine experiences, peaceful island atmosphere, and hidden natural beauty.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Managing Director Section */}
      <section className="relative py-32 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-600">Leadership</span>
                <h2 className="font-serif text-5xl text-slate-900 tracking-tight leading-tight">
                  Meet the <span className="italic text-emerald-500">Managing Director</span>
                </h2>
              </div>
              
              <div className="space-y-6 text-slate-600 font-light leading-relaxed text-lg">
                <p className="text-slate-900 font-serif text-2xl italic leading-snug">
                  “Hi, I’m Abdulla Waseem, Managing Director of Southern Sea World Pvt Ltd.”
                </p>
                <p>
                  As someone passionate about tourism, hospitality, and business development, I have always believed in the potential of the Maldives and the unique experiences our islands can offer to travelers from around the world.
                </p>
                <p>
                  In 2019, under Southern Sea World Pvt Ltd, we established Southern Maldives Divers, a dive center located at a resort in the southernmost part of the Maldives, focused on delivering professional diving experiences and marine adventures. Later, we expanded our tourism activities by establishing Meedhoo Scuba Club on Meedhoo Island to further promote diving and local island experiences in the Southern Maldives.
                </p>
                <p>
                  With a vision to support the growth of tourism in the region, I have also been involved in the development of guesthouse accommodations to help create comfortable and authentic island stays for visitors exploring the Maldives.
                </p>
                <p className="text-emerald-700 font-medium bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                  As Managing Director of Southern Sea World Pvt Ltd, I continue to focus on expanding tourism-related activities and creating meaningful travel experiences that showcase the beauty, culture, and hospitality of the Maldives while supporting the long-term growth of local island tourism.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-[3rem] overflow-hidden"
            >
              <img 
                src="/assets/md_waseem.webp" 
                className="w-full h-full object-cover" 
                alt="Abdulla Waseem - Managing Director"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[3rem]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Executive Director Section */}
      <section className="relative py-32 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-[3rem] overflow-hidden order-last lg:order-first"
            >
              <img 
                src="/assets/ismail-didi.jpg" 
                className="w-full h-full object-cover" 
                alt="Ismail Didi - Executive Director"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[3rem]" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-600">Leadership</span>
                <h2 className="font-serif text-5xl text-slate-900 tracking-tight leading-tight">
                  Meet the <span className="italic text-emerald-500">Executive Director</span>
                </h2>
              </div>
              
              <div className="space-y-6 text-slate-600 font-light leading-relaxed text-lg">
                <p className="text-slate-900 font-serif text-2xl italic leading-snug">
                  “Hi, I’m Ismail Didi, Executive Director of Southern Maldives Travels.”
                </p>
                <p>
                  Passionate about tourism, hospitality, and exceptional guest experiences, I have spent many years working in the Maldives tourism industry across various departments in luxury resorts, including managerial and butler-service roles.
                </p>
                <p>
                  Through my experience in guest relations, resort operations, and personalized service, I have developed a strong understanding of creating smooth, memorable, and high-quality travel experiences for guests from around the world. I strongly believe that great travel experiences are built through authentic hospitality, quality service, and personal connections.
                </p>
                <p className="text-emerald-700 font-medium bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                  As Executive Director of Southern Maldives Travels, I am committed to supporting the growth and operations of the company through strong leadership, coordination, and a dedication to delivering exceptional travel experiences and guest satisfaction while showcasing the true warmth and beauty of the Maldives.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section: Asymmetric Editorial Split Grid */}
      <section className="relative py-32 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Vision (Left Column Side-Block) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 bg-slate-50 rounded-[2.5rem] p-10 md:p-12 border border-slate-200/60 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 rounded-full">
                  <Eye className="w-5 h-5 text-emerald-600 stroke-[1.5px]" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-600">The Horizon</span>
              </div>
              <h2 className="font-serif text-4xl text-slate-900 tracking-tight">
                Our <span className="italic text-emerald-500">Vision</span>
              </h2>
              <div className="h-0.5 w-16 bg-emerald-500" />
              <p className="text-slate-600 font-light text-base md:text-lg leading-relaxed pt-2">
                To become a trusted travel brand that offers every traveler the opportunity to experience the Maldives in their own way, whether through the authentic charm of local island life or the comfort &amp; privacy of luxury resort escapes.
              </p>
            </motion.div>

            {/* Mission (Right Column Focal Card) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-7 bg-white rounded-[2.5rem] p-10 md:p-12 border-2 border-emerald-100/60 shadow-sm space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 rounded-full">
                  <Target className="w-5 h-5 text-emerald-600 stroke-[1.5px]" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-600">The Purpose</span>
              </div>
              <h2 className="font-serif text-4xl text-slate-900 tracking-tight">
                Our <span className="italic text-emerald-500">Mission</span>
              </h2>
              <div className="h-0.5 w-16 bg-emerald-500" />
              <p className="text-slate-700 font-serif text-xl italic leading-relaxed pt-2">
                At Southern Maldives Travels our mission is to connect travelers with the true essence of the Maldives through thoughtfully curated experiences...
              </p>
              <p className="text-slate-500 font-light text-base md:text-lg leading-relaxed border-t border-slate-100 pt-4">
                ...offering the authentic charm, rich culture, &amp; peaceful beauty of local island life for those seeking genuine connection &amp; relaxation, as well as serene private resort escapes for those seeking comfort, exclusivity, luxury, &amp; unforgettable island experiences.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Our Experiences: Elegant Light-mode Grid Block */}
      <section className="py-32 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="text-center mb-24 space-y-6">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-600">Curated Journeys</span>
            <h2 className="font-serif text-5xl text-slate-900 tracking-tight">Our <span className="italic text-emerald-500">Experiences</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
            {experiences.map(({ emoji, title, desc }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="space-y-4 group"
              >
                <div className="text-3xl filter saturate-[0.85] group-hover:scale-110 transition-transform duration-300 inline-block">
                  {emoji}
                </div>
                <h3 className="font-serif text-xl text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">{title}</h3>
                <p className="text-slate-500 font-light text-[15px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialization Section: Asymmetric Focal Block */}
      <section className="relative py-32 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-600">Core Signature</span>
              <h2 className="font-serif text-5xl text-slate-900 tracking-tight leading-tight">
                Specializing in <br />
                <span className="italic text-emerald-500">Southern Maldives</span>
              </h2>
              <div className="h-0.5 w-16 bg-emerald-500" />
            </div>

            <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-200/60 shadow-sm space-y-10">
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400">Why Southern Maldives?</h3>
                <p className="font-serif text-2xl text-slate-800 leading-relaxed italic">
                  "The Southern Maldives offers a quieter, more authentic side of the Maldives, known for its incredible diving, rich marine life, peaceful islands, and unique local culture."
                </p>
              </div>
              <p className="text-slate-600 font-light text-lg leading-relaxed pt-4 border-t border-slate-100">
                From manta rays and pristine reefs to historical sites and natural mangroves, Southern Maldives is perfect for travelers seeking meaningful experiences beyond crowded tourist destinations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values: p-px Card Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-[1800px] mx-auto px-8 lg:px-16">
          <div className="text-center mb-24 space-y-6">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-600">Our Foundation</span>
            <h2 className="font-serif text-5xl text-slate-900 tracking-tight">The Values that <span className="italic text-emerald-500">Define Us</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, desc }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-px bg-gradient-to-b from-emerald-200 to-transparent rounded-[2rem] transition-all duration-700 hover:from-emerald-400"
              >
                <div className="relative h-full bg-white rounded-[1.9rem] p-10 flex flex-col items-center text-center space-y-6 transition-transform duration-700 group-hover:-translate-y-2">
                  <div className="w-12 h-12 flex items-center justify-center bg-emerald-50 rounded-full group-hover:bg-emerald-500 transition-colors duration-500">
                    <Icon className="w-5 h-5 text-emerald-600 group-hover:text-white stroke-[1.5px]" />
                  </div>
                  <h3 className="font-serif text-xl text-slate-900 italic">{title}</h3>
                  <div className="w-8 h-px bg-emerald-100 group-hover:w-16 transition-all" />
                  <p className="text-slate-500 font-light text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Promise: Deep Cinematic CTA */}
      <section className="relative py-40 bg-[#020617] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center space-y-12">
          <div className="space-y-4">
             <div className="flex justify-center mb-6">
                <Compass className="w-8 h-8 text-emerald-500 animate-pulse" />
             </div>
            <h2 className="font-serif text-5xl md:text-7xl text-white tracking-tight">
              The <span className="italic font-extralight text-emerald-400">Promise</span>
            </h2>
          </div>

          <div className="space-y-8 text-slate-400 font-light text-xl leading-relaxed italic">
            <p>
              "Let us show you the true beauty of the Maldives — where luxury meets authenticity."
            </p>
            <p className="text-slate-500 not-italic text-lg max-w-2xl mx-auto">
              You could spend hours researching hotels online — or let our team, who personally inspects each property, guide you straight to the finest options.
            </p>
          </div>

          <div className="pt-10">
            <button className="group relative px-12 py-5 overflow-hidden border border-emerald-500/40 rounded-full transition-all duration-500">
              <span className="relative z-10 text-[10px] uppercase tracking-[0.5em] font-bold text-white transition-colors duration-500">
                Begin Your Journey
              </span>
              <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-20 w-px bg-gradient-to-t from-emerald-500/40 to-transparent" />
      </section>
    </div>
  );
}