import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, PhoneCall, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useEnquiryModalStore } from '@/stores/enquiryModalStore';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/hotels', label: 'Destinations' },
  { path: '/packages', label: 'Packages' },
  { path: '/about', label: 'Our Story' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const openEnquiryModal = useEnquiryModalStore((state) => state.open);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  // FIX: Force solid background when open or scrolled
  const navBgColor = isOpen 
    ? 'bg-white' 
    : scrolled 
      ? 'bg-white/95 backdrop-blur-xl border-b border-emerald-500/10 shadow-sm' 
      : 'bg-transparent';

  const navTextColor = (scrolled || isOpen) ? 'text-slate-900' : 'text-white';

  return (
    <nav
      className={`fixed top-0 w-full z-[150] transition-all duration-500 ${navBgColor} ${
        scrolled ? 'py-3' : 'py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 lg:px-16">
        <div className="flex justify-between items-center">
          
          {/* Logo Section - Increased Z to stay above any hero badges */}
          <Link to="/" className="flex items-center space-x-3 md:space-x-4 group shrink-0 z-[160]">
            <div className="relative">
              <img
                src="/logo.jpg"
                alt="Logo"
                className={`h-9 w-9 md:h-10 md:w-10 object-contain rounded-full border transition-all duration-500 ${
                  scrolled || isOpen ? 'border-emerald-500/20' : 'border-white/20'
                }`}
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase transition-colors duration-500 ${navTextColor}`}>
                Southern Maldives
              </span>
              <span className={`font-serif italic text-[10px] md:text-[11px] transition-colors duration-500 ${
                scrolled || isOpen ? 'text-emerald-700' : 'text-emerald-400'
              }`}>
                Travels &amp; Tours
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="relative py-1 overflow-hidden group">
                <span className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500 block ${
                  isActive(link.path) ? 'text-emerald-500' : `${navTextColor} group-hover:text-emerald-400`
                }`}>
                  {link.label}
                </span>
                <span className={`absolute bottom-0 left-0 h-px bg-emerald-500 transition-all duration-500 ${
                  isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/admin/login" className={`transition-all duration-500 hover:scale-110 ${navTextColor} hover:text-emerald-500`}>
                <User className="h-4 w-4" />
              </Link>
              <button
                onClick={() => openEnquiryModal()}
                className={`group relative px-6 py-3 overflow-hidden rounded-full border text-[9px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${
                  scrolled ? 'border-emerald-500/30 text-emerald-900' : 'border-white/30 text-white'
                }`}
              >
                <span className="relative z-10">Plan Your Trip</span>
                <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>

            {/* Mobile Toggle Trigger - Highest Z index to ensure clickability */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden relative z-[200] p-2 transition-all rounded-full ${
                isOpen ? 'bg-slate-100 text-slate-900' : `${navTextColor} active:bg-white/10`
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Modern Full-Screen Mobile/Tablet Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-white z-[140] lg:hidden overflow-hidden flex flex-col"
          >
            {/* Background Decoration */}
            <div className="fixed top-0 right-0 w-1/2 h-full bg-emerald-50/40 -skew-x-12 translate-x-20 z-0 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full px-8 pt-32 pb-10">
              <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-600 font-bold mb-8 md:mb-12">
                Exploration Menu
              </p>

              <div className="flex flex-col space-y-6 md:space-y-10 flex-grow">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className="group flex items-end justify-between border-b border-slate-100 pb-3"
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">0{i + 1}</span>
                        <span className={`text-3xl md:text-5xl font-serif tracking-tight transition-colors ${
                          isActive(link.path) ? 'text-emerald-600 italic' : 'text-slate-900 group-hover:text-emerald-600'
                        }`}>
                          {link.label}
                        </span>
                      </div>
                      <ArrowRight className={`h-5 w-5 transition-transform group-hover:translate-x-2 ${
                        isActive(link.path) ? 'text-emerald-500' : 'text-slate-200'
                      }`} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto space-y-6 pt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={() => { openEnquiryModal(); setIsOpen(false); }}
                    className="w-full h-14 md:h-16 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-between px-6 shadow-lg shadow-emerald-900/10"
                  >
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Start Your Inquiry</span>
                    <PhoneCall className="h-4 w-4 opacity-70" />
                  </Button>
                </motion.div>

                <div className="flex justify-between items-center px-2">
                  <Link 
                    to="/admin/login" 
                    className="text-[9px] uppercase tracking-widest text-slate-500 font-bold"
                  >
                    Member Access
                  </Link>
                  <span className="text-[9px] italic font-serif text-slate-400">Deep South Maldives</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}