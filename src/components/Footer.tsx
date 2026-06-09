import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-200 border-t border-slate-800">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 pt-20 pb-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          
          {/* Left Column: Brand & Narrative */}
          <div className="md:col-span-4 space-y-12">
            {/* Brand Presence - Left Aligned */}
            <Link to="/" className="group inline-flex items-center gap-6 relative">
              <div className="absolute -inset-4 bg-emerald-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Southern Maldives Logo"
                  className="h-16 w-16 object-contain rounded-full border border-white/10 p-1 transition-all duration-700 group-hover:border-emerald-500/50"
                />
              </div>

              <div className="flex flex-col border-l border-white/10 pl-6 py-1">
                <span className="text-base font-bold tracking-[0.4em] uppercase text-white leading-tight mb-1">
                  Southern Maldives
                </span>
                <span className="font-serif italic text-emerald-400 text-xs tracking-[0.2em]">
                  Travels &amp; Tours
                </span>
              </div>
            </Link>

            {/* Narrative Section */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-500">Our Essence</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light italic max-w-sm">
                "Curating the untouched beauty of the deep south. From our base in Addu City, we bridge the gap between luxury and the authentic equatorial soul."
              </p>
              <div className="flex space-x-5 pt-2">
                {[
                  { icon: Facebook, label: 'Facebook', href: '#' },
                  { icon: Instagram, label: 'Instagram', href: '#' }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="group relative h-9 w-9 flex items-center justify-center rounded-full border border-slate-800 bg-slate-900 shadow-sm transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5"
                  >
                    <social.icon className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-2 md:mt-4">
            <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-500 mb-10">Directory</h3>
            <ul className="space-y-5">
              {[
                { path: '/', label: 'The Collection' },
                { path: '/hotels', label: 'Destinations' },
                { path: '/packages', label: 'Packages' },
                { path: '/terms', label: 'Terms & Conditions' },
                { path: '/about', label: 'Our Story' },
                { path: '/contact', label: 'Concierge' },
              ].map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-slate-400 hover:text-emerald-400 transition-all text-[10px] font-bold uppercase tracking-[0.2em] block py-1 group"
                  >
                    <span className="relative inline-block">
                      {label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-emerald-500 transition-all group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 md:mt-4">
            <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-500 mb-10">Atoll Hub</h3>
            <ul className="space-y-8">
              <li className="flex items-start gap-4">
                <MapPin className="h-4 w-4 text-emerald-500 mt-1 flex-shrink-0" />
                <span className="text-slate-400 text-xs leading-relaxed font-light tracking-wide">
                  Sun View, Meedhoo,<br />
                  Addu City, Maldives
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <a href="tel:+9609495654" className="text-slate-400 hover:text-emerald-400 transition-colors text-xs font-light">
                  +960 9495 654
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <a href="mailto:travel@southernmaldives.com" className="text-slate-400 hover:text-emerald-400 transition-colors text-xs font-light">
                  travel@southernmaldives.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-3 md:mt-4">
            <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-500 mb-10">The Bulletin</h3>
            <p className="text-slate-400 text-xs mb-8 font-light italic">
              Receive exclusive equatorial insights and seasonal offers.
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-0 py-3 bg-transparent border-b border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600 font-light"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-400 text-[10px] font-bold uppercase tracking-[0.3em] transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Legal & Final Branding - Typography Pop-out */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <Compass className="h-3 w-3 text-emerald-400" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-200 font-bold">
              &copy; {new Date().getFullYear()} Southern Maldives Travels
            </p>
          </div>
          
          <div className="flex items-center gap-12">
            <div className="h-px w-12 bg-white/10" />
            <p className="font-serif italic text-white/40 text-xl select-none">Below the Equator</p>
            <div className="h-px w-12 bg-white/10" />
          </div>

          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-200 font-bold">
            Addu City • Meedhoo
          </p>
        </div>
      </div>
    </footer>
  );
}