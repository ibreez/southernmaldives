import { motion } from 'framer-motion';
import { ArrowRight, Check, Globe2, Sparkles, Mail, MessageSquare } from 'lucide-react';
import type { TravelPackage } from '@/types/package';
import { Button } from '@/components/ui/button';
import { useSiteSettingsStore } from '@/stores/siteSettingsStore';

interface PackageCardProps {
  package: TravelPackage;
  onViewDetails: (pkg: TravelPackage) => void;
  onBookNow?: (pkg: TravelPackage) => void;
}

export default function PackageCard({ package: pkg, onViewDetails, onBookNow }: PackageCardProps) {
  const { whatsappNumber: globalWhatsapp } = useSiteSettingsStore();
  const includedItems = pkg.inclusions?.filter((item) => item.included) ?? [];
  const visibleItems = includedItems.slice(0, 3);
  const extraCount = Math.max(includedItems.length - 3, 0);

  const handleWhatsAppAction = () => {
    const phoneNumber = (pkg.contactInfo?.whatsapp || globalWhatsapp || "+960 9495654").replace(/\D/g, '');
    const currency = pkg.currency === "USD" ? "$" : pkg.currency;
    const message = `Hello Southern Maldives Travels! I am interested in booking the "${pkg.title}" package (${pkg.duration.nights} Nights / ${pkg.duration.days} Days) for ${currency}${pkg.price.toLocaleString()}. Could you please provide more information on how to proceed with the reservation?`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="group h-full flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/5"
    >
      {/* Media Aspect Window Framework */}
      <div className="relative aspect-[16/11] overflow-hidden bg-slate-900">
        <img
          src={pkg.images?.[0] ?? '/assets/hero-tropical-beach-sunset.jpg'}
          alt={pkg.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Dynamic Badge Positioning Context */}
        <div className="absolute top-5 left-5 flex flex-wrap gap-2">
          {pkg.badge && (
            <span className="rounded-full bg-emerald-600 px-3.5 py-1.5 text-[9px] uppercase tracking-[0.25em] font-bold text-white shadow-md shadow-emerald-950/20">
              {pkg.badge}
            </span>
          )}
          {pkg.featured && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3.5 py-1.5 text-[9px] uppercase tracking-[0.25em] font-bold text-slate-900 shadow-sm">
              <Sparkles className="h-3 w-3 text-emerald-500" />
              Featured
            </span>
          )}
        </div>

        {/* Overlay Footer: Duration Segment Bounds */}
        <div className="absolute bottom-4 left-5 rounded-full bg-slate-950/70 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white tracking-wide">
          {pkg.duration.nights}N / {pkg.duration.days}D
        </div>
      </div>

      {/* Narrative Context Details Grid Layout Container */}
      <div className="flex flex-col flex-1 p-6 sm:p-8 space-y-6">
        <div className="space-y-3 flex-1">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-600">
              {pkg.currency === 'USD' ? '$' : pkg.currency}
              {pkg.price.toLocaleString()} <span className="text-slate-400 font-light lowercase">/ for {pkg.persons} guests</span>
            </span>
            <h3 className="text-2xl font-serif tracking-tight text-slate-900 transition-colors group-hover:text-emerald-600">
              {pkg.title}
            </h3>
          </div>
          <p className="text-sm text-slate-500 font-light leading-relaxed line-clamp-3">
            {pkg.subtitle || pkg.description}
          </p>
        </div>

        {/* Content Highlights Panel Element */}
        <div className="space-y-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            <Globe2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Package Includes</span>
          </div>
          <ul className="space-y-2.5 text-sm text-slate-600 font-light">
            {visibleItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <div className="mt-0.5 rounded-full bg-emerald-50 p-0.5 flex-shrink-0">
                  <Check className="h-3 w-3 text-emerald-600 stroke-[2.5px]" />
                </div>
                <span className="line-clamp-1">{item.label}</span>
              </li>
            ))}
            {extraCount > 0 && (
              <li className="flex items-center gap-2.5 text-xs font-semibold text-emerald-600 uppercase tracking-wider pt-0.5">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px]">
                  +
                </span>
                <span>{extraCount} more benefits included</span>
              </li>
            )}
          </ul>
        </div>

        {/* High-visibility pill layout criteria wrapper */}
        {(pkg.highlights ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {(pkg.highlights ?? []).map((highlight, index) => (
              <span 
                key={index} 
                className="rounded-full border border-slate-100 bg-white px-3 py-1 text-[10px] font-medium tracking-wide text-slate-600 shadow-2xs"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {/* Operational Constraint/Availability Matrix Block */}
        {(pkg.bookingDeadline || pkg.travelDates) && (
          <div className="rounded-2xl border border-amber-100/60 bg-amber-50/40 px-4 py-3 text-xs text-amber-900 space-y-1">
            {pkg.bookingDeadline && (
              <p className="font-light">
                <span className="font-semibold text-amber-900">Booking Window:</span> before {pkg.bookingDeadline}
              </p>
            )}
            {pkg.travelDates && (
              <p className="font-light">
                <span className="font-semibold text-amber-900">Travel Windows:</span> {pkg.travelDates}
              </p>
            )}
          </div>
        )}

        {/* Local Agency Context Communication Methods Component */}
        {pkg.contactInfo && (pkg.contactInfo.email || pkg.contactInfo.whatsapp) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400 font-light pt-1 border-t border-slate-100">
            {pkg.contactInfo.whatsapp && (
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-emerald-500/70" />
                <span>{pkg.contactInfo.whatsapp}</span>
              </div>
            )}
            {pkg.contactInfo.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-emerald-500/70" />
                <span className="truncate max-w-[180px]">{pkg.contactInfo.email}</span>
              </div>
            )}
          </div>
        )}

        {/* Call To Action Panel Controls Footer Row */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onViewDetails(pkg)}
            className="w-full rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 h-11 text-[11px] font-bold uppercase tracking-wider"
          >
            View details
          </Button>
          
          <Button
            variant="default"
            onClick={() => {
              if (onBookNow) {
                onBookNow(pkg);
              } else {
                handleWhatsAppAction();
              }
            }}
            className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 text-[11px] font-bold uppercase tracking-wider shadow-none flex items-center justify-center gap-1.5"
          >
            Book Now
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}