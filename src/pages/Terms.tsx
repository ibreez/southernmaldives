import { motion } from 'framer-motion';
import { FileText, Compass, ArrowRight } from 'lucide-react';

const termSections = [
  {
    num: "01",
    title: "Booking & Payment",
    points: [
      "Bookings are confirmed only after payment confirmation is received.",
      "Payments can be made through BML Payment Link or bank transfer to SOUTHERN SEA WORLD PVT LTD.",
      "Full payment may be required before arrival depending on the package or service booked."
    ]
  },
  {
    num: "02",
    title: "Services & Partners",
    points: [
      "Some services including excursions, transfers, diving activities, and accommodation may be operated by trusted partner suppliers working with Southern Maldives Travels.",
      "While we carefully select our partners, Southern Maldives Travels is not responsible for delays, cancellations, weather conditions, sea conditions, or operational issues beyond our control."
    ]
  },
  {
    num: "03",
    title: "Cancellation Policy",
    points: [
      "Cancellations made 21 days or more before arrival: Full refund excluding bank/payment charges.",
      "Cancellations made 8–20 days before arrival: 50% cancellation charge applies.",
      "Cancellations made within 7 days of arrival or no-show: 100% cancellation charge applies.",
      "Some resorts, guesthouses, diving centers, or promotional packages may have separate cancellation policies. Guests will be informed before confirmation."
    ]
  },
  {
    num: "04",
    title: "Refunds",
    points: [
      "Refunds will be processed after confirmation from suppliers and partners.",
      "Bank charges, transfer fees, currency conversion fees, and payment gateway charges are non-refundable."
    ]
  },
  {
    num: "05",
    title: "Changes & Modifications",
    points: [
      "Any booking changes are subject to availability and supplier approval.",
      "Additional charges may apply for booking modifications."
    ]
  },
  {
    num: "06",
    title: "Force Majeure",
    points: [
      "Southern Maldives Travels shall not be held responsible for cancellations, delays, or changes caused by weather conditions, sea conditions, flight disruptions, government restrictions, natural disasters, pandemics, or other circumstances beyond our control."
    ]
  },
  {
    num: "07",
    title: "Travel Insurance",
    points: [
      "Guests are strongly advised to purchase travel insurance covering cancellations, medical emergencies, water activities, and travel disruptions."
    ]
  },
  {
    num: "08",
    title: "Health & Safety",
    points: [
      "Guests participating in snorkeling, diving, fishing, water sports, or excursions are required to follow all safety instructions provided by guides and operators.",
      "Southern Maldives Travels is not responsible for incidents, delays, or operational issues beyond our control during activities operated by partner service providers."
    ]
  },
  {
    num: "09",
    title: "Local Laws",
    points: [
      "Guests must respect the laws and regulations of the Republic of Maldives, including local island rules regarding dress code, alcohol restrictions, and public behavior."
    ]
  },
  {
    num: "10",
    title: "General",
    points: [
      "Southern Maldives Travels reserves the right to modify itineraries, schedules, or services due to operational requirements, weather conditions, or safety concerns.",
      "Maldives law shall govern all bookings and disputes."
    ]
  }
];

export default function Terms() {
  return (
    <div className="bg-white selection:bg-emerald-100">
      {/* Hero: Cinematic Dark Mode */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#020617]">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src="/assets/twillight-overwater-shot.webp"
            alt="Terms and Conditions"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/85 via-transparent to-[#020617]" />
        </div>

        <div className="relative z-10 text-center px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-emerald-500/40" />
              <span className="text-emerald-400 text-[10px] font-bold tracking-[0.5em] uppercase">Agreement</span>
              <div className="h-px w-8 bg-emerald-500/40" />
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight tracking-tight">
              Terms &amp; <span className="italic font-extralight text-emerald-400">Conditions</span>
            </h1>
            
            <p className="text-slate-400 font-light text-base md:text-lg italic max-w-2xl mx-auto">
              Please read these terms carefully before confirming any booking with Southern Maldives Travels.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 w-px bg-gradient-to-t from-emerald-500 to-transparent" />
      </section>

      {/* Main Content Layout: Asymmetric Editorial Grid */}
      <section className="relative py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Side: Sticky Intro Statement */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-12">
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-600">The Fine Print</span>
                <h2 className="font-serif text-4xl md:text-5xl text-slate-900 tracking-tight leading-tight">
                  Our Operating <br />
                  <span className="italic text-emerald-500">Framework</span>
                </h2>
                <div className="h-0.5 w-16 bg-emerald-500 mt-4" />
              </div>

              <div className="space-y-4 text-slate-600 font-light leading-relaxed text-base">
                <p className="text-slate-900 font-serif text-xl italic leading-relaxed">
                  Southern Maldives Travels, operated under Southern Sea World Pvt Ltd, provides resort bookings, guesthouse bookings, honeymoon packages, diving packages, transfers, and excursion packages.
                </p>
                <p className="text-slate-500">
                  By confirming a booking with us, guests agree explicitly to the outlined parameters, liabilities, and cancelation guidelines governing operations within the Republic of Maldives.
                </p>
              </div>
            </div>

            {/* Right Side: Elegant Structured Stacked Cards */}
            <div className="lg:col-span-7 space-y-8">
              {termSections.map(({ num, title, points }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                  className="group relative p-px bg-gradient-to-b from-slate-200/80 to-transparent rounded-[2rem] transition-all duration-700 hover:from-emerald-300"
                >
                  <div className="relative bg-white rounded-[1.9rem] p-8 md:p-10 space-y-6 transition-transform duration-700 group-hover:-translate-y-1">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <h3 className="font-serif text-xl text-slate-900 group-hover:text-emerald-700 transition-colors duration-300">
                        {title}
                      </h3>
                      <span className="font-mono text-xs text-slate-400 tracking-widest font-bold bg-slate-50 group-hover:bg-emerald-50 group-hover:text-emerald-600 px-3 py-1 rounded-full transition-colors duration-300">
                        {num}
                      </span>
                    </div>

                    <ul className="space-y-4">
                      {points.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-3 text-slate-500 font-light text-[15px] leading-relaxed">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/60" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Deep Cinematic CTA / Help Desk Support */}
      <section className="relative py-40 bg-[#020617] overflow-hidden border-t border-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.06)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center space-y-10">
          <div className="space-y-4">
             <div className="flex justify-center mb-6">
                <Compass className="w-8 h-8 text-emerald-500 animate-pulse" />
             </div>
            <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight">
              Have Any <span className="italic font-extralight text-emerald-400">Questions?</span>
            </h2>
          </div>

          <div className="space-y-6 text-slate-400 font-light text-lg leading-relaxed max-w-xl mx-auto">
            <p>
              If you require clarity regarding cancellation protocols, customizable frameworks, or local policies, our advisory desk is accessible 24/7.
            </p>
          </div>

          <div className="pt-6">
            <a 
              href="mailto:travel@southernmaldives.com"
              className="inline-flex items-center gap-3 group relative px-10 py-4 overflow-hidden border border-emerald-500/40 rounded-full transition-all duration-500"
            >
              <span className="relative z-10 text-[10px] uppercase tracking-[0.5em] font-bold text-white transition-colors duration-500">
                Contact Legal Desk
              </span>
              <ArrowRight className="w-3 h-3 text-emerald-400 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-20 w-px bg-gradient-to-t from-emerald-500/30 to-transparent" />
      </section>
    </div>
  );
}