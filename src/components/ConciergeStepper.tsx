import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateEnquiry } from '@/hooks/useEnquiries';
import { Hotel } from '@/types/hotel';
import { Enquiry } from '@/types/enquiry';
import { useHotels } from '@/hooks/useHotels';
import {
  Sparkles, Calendar, MapPin, Check, ArrowLeft, ArrowRight,
  Send, Star, Plane, Mail, Phone, MessageCircle, ShieldCheck, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

const formSchema = z.object({
  trip_type: z.string().min(1, 'Please select a trip type'),
  destination: z.string().min(1, 'Please select a destination'),
  check_in: z.string().min(1, 'Check-in date is required'),
  check_out: z.string().min(1, 'Check-out date is required'),
  adults: z.number().min(1, 'At least 1 adult required'),
  children: z.number().min(0).default(0),
  room_type: z.string().default(''),
  airport_transfer: z.boolean().default(false),
  meal_plan: z.string().default(''),
  special_requests: z.string().optional(),
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  contact_preference: z.enum(['whatsapp', 'email', 'call']),
});

type FormData = z.infer<typeof formSchema>;

const initialFormData: FormData = {
  trip_type: '', destination: '', check_in: '', check_out: '',
  adults: 2, children: 0, room_type: '', airport_transfer: false,
  meal_plan: '', special_requests: '', name: '', email: '',
  phone: '', contact_preference: 'email',
};

const tripTypes = [
  { id: 'honeymoon', label: 'Honeymoon', icon: '💍' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧' },
  { id: 'adventure', label: 'Adventure', icon: '🌊' },
  { id: 'relaxation', label: 'Relaxation', icon: '🧘‍♂️' },
  { id: 'business', label: 'Business', icon: '✈️' },
];

const mealPlans = [
  { value: 'BB', label: 'Bed & Breakfast' },
  { value: 'HB', label: 'Half Board' },
  { value: 'FB', label: 'Full Board' },
  { value: 'All Inclusive', label: 'All Inclusive' },
];

const contactMethods = [
  { value: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' },
  { value: 'email', icon: Mail, label: 'Email' },
  { value: 'call', icon: Phone, label: 'Phone' },
];

interface ConciergeStepperProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedHotel?: Hotel | null;
}

export default function ConciergeStepper({ isOpen, onClose, preselectedHotel }: ConciergeStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const createEnquiry = useCreateEnquiry();
  const { data: hotels = [] } = useHotels();

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setFormData(initialFormData);
      setErrors({});
      setIsComplete(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (preselectedHotel) {
      setFormData(prev => ({ ...prev, destination: preselectedHotel.name }));
    }
  }, [preselectedHotel]);

  const totalSteps = 6;
  const stepLabels = ['Vibe', 'Island', 'Dates', 'Tailor', 'Contact', 'Review'];
  const stepIcons = [Sparkles, MapPin, Calendar, Plane, Phone, Check];

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (step === 1 && !formData.trip_type) newErrors.trip_type = 'Required';
    if (step === 2 && !formData.destination) newErrors.destination = 'Required';
    if (step === 3) {
      if (!formData.check_in) newErrors.check_in = 'Required';
      if (!formData.check_out) newErrors.check_out = 'Required';
      if (formData.check_in && formData.check_out && new Date(formData.check_out) <= new Date(formData.check_in)) {
        newErrors.check_out = 'Must be after arrival';
      }
    }
    if (step === 5) {
      if (!formData.name) newErrors.name = 'Required';
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid';
      if (!formData.phone) newErrors.phone = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => validateStep(currentStep) && setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const handleInputChange = (field: keyof FormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const stepsValid = [1, 2, 3, 4, 5, 6].every(step => validateStep(step));
    if (!stepsValid) return;

    setIsSubmitting(true);
    try {
      await createEnquiry.mutateAsync({
        ...formData,
        destination: formData.destination === 'not_sure' ? 'To Be Confirmed' : formData.destination,
        guests: formData.adults + formData.children,
        special_requests: formData.special_requests || '',
      } as Omit<Enquiry, 'id' | 'status' | 'created_at'>);
      setIsComplete(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{scrollbarHideStyles}</style>
      <Dialog open={isOpen} onOpenChange={onClose}>
        {/* Mobile: Full-screen height with rounded-t only. Tablet/Desktop: Centered dialog */}
        <DialogContent className="scrollbar-hide w-full sm:max-w-4xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[90vh] overflow-y-auto p-0 border-none bg-white shadow-2xl rounded-none sm:rounded-[2.5rem] sm:mt-12 flex flex-col">
          <DialogTitle className="sr-only">Southern Maldives Bespoke Concierge</DialogTitle>
          <DialogDescription className="sr-only">Design your luxury escape.</DialogDescription>

          <AnimatePresence>
            {isSubmitting && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#022c22]/95 backdrop-blur-md flex items-center justify-center z-[100] sm:rounded-[2.5rem]">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-white/10" aria-label="Close dialog">
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="text-center px-6">
                  <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-6" />
                  <h3 className="font-serif text-xl sm:text-2xl text-emerald-50 italic">Crafting your itinerary...</h3>
                </div>
              </motion.div>
            )}

            {isComplete && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-white flex items-center justify-center z-[100] sm:rounded-[2.5rem] p-6 sm:p-12">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100" aria-label="Close dialog">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                    <Check className="w-10 h-10 sm:w-12 sm:h-12 text-[#022c22]" />
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#022c22] mb-4">Submission Success</h3>
                  <p className="text-slate-500 text-sm sm:text-[15px] font-light leading-relaxed mb-8 sm:mb-10 italic">
                    Thank you, {formData.name.split(' ')[0]}. Our specialists will reach out shortly.
                  </p>
                  <Button onClick={onClose} className="w-full h-14 bg-[#022c22] hover:bg-[#064e3b] rounded-2xl text-[10px] tracking-[0.3em] uppercase font-bold text-white">
                    Close Planner
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Responsive Header */}
          <div className="relative shrink-0 h-24 sm:h-32 w-full bg-[#022c22] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
            <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10" aria-label="Close concierge dialog">
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="relative text-center z-10 px-4">
              <Sparkles className="text-emerald-400/80 w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2" />
              <h2 className="text-white font-serif text-sm sm:text-lg tracking-[0.3em] sm:tracking-[0.4em] uppercase">Bespoke Concierge</h2>
              <p className="text-emerald-400/60 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] mt-1">Southern Maldives Travels</p>
            </div>
          </div>

          {/* Stepper Progress - Optimized for Tablet */}
          {!isComplete && (
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 shrink-0">
              {/* Reduced max-width from 2xl to lg/xl on tablets to "shrink" the bar */}
              <div className="flex items-center justify-between relative max-w-md sm:max-w-lg lg:max-w-2xl mx-auto">
                <div className="absolute top-4 sm:top-4 left-0 right-0 h-[1px] bg-slate-100 -z-0" />
                {stepIcons.map((Icon, i) => (
                  <div key={i} className="flex flex-col items-center z-10">
                    <div className={cn(
                      /* Shrinking the circles: w-8/h-8 on mobile, stays w-8 on tablet, grows to w-10 on desktop */
                      "w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all border",
                      currentStep > i + 1 ? "bg-[#022c22] border-[#022c22] text-white" :
                        currentStep === i + 1 ? "bg-white border-[#022c22] text-[#022c22] shadow-xl scale-110" :
                          "bg-white border-slate-100 text-slate-300"
                    )}>
                      {currentStep > i + 1 ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                    </div>
                    <span className={cn(
                      "text-[7px] uppercase mt-2 font-bold tracking-[0.1em] hidden md:block",
                      currentStep === i + 1 ? "text-[#022c22]" : "text-slate-300"
                    )}>
                      {stepLabels[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content Area - Scrollable */}
          <div className="flex-1 px-6 sm:px-16 py-4 sm:py-6 overflow-y-auto min-h-0">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="text-center">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-emerald-600 font-bold mb-1 block">Step 01</span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#022c22]">Select Your Journey Vibe</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                    {tripTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleInputChange('trip_type', type.id)}
                        className={cn(
                          /* Reduced vertical padding (py-3) to keep the "Next" button in view */
                          "p-3 sm:py-3 sm:px-4 rounded-2xl border text-center transition-all",
                          formData.trip_type === type.id ? "border-[#022c22] bg-emerald-50/50 shadow-md" : "border-slate-100 bg-white"
                        )}
                      >
                        <span className="text-xl sm:text-2xl block mb-1">{type.icon}</span>
                        <div className="text-[8px] uppercase tracking-widest font-bold text-[#022c22]">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="text-center">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-emerald-600 font-bold mb-1 block">Step 02</span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#022c22]">
                      {formData.destination ? "Confirm Your Choice" : "Where shall we take you?"}
                    </h3>
                  </div>

                  {formData.destination ? (
                    /* --- Selected State: Focused Card --- */
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="max-w-md mx-auto"
                    >
                      <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl">
                        {/* Card Image Header */}
                        <div className="h-48 sm:h-56 relative group">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{
                              backgroundImage: `url(${hotels.find(h => h.name === formData.destination)?.images?.[0] ||
                                'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=500'
                                })`
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-transparent to-transparent opacity-60" />

                          {/* Surprise Me Icon Overlay */}
                          {formData.destination === 'not_sure' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#022c22]/40 backdrop-blur-[2px]">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl animate-pulse">✨</div>
                            </div>
                          )}

                          <div className="absolute bottom-6 left-8">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              <span className="text-[8px] uppercase tracking-[0.2em] text-emerald-400 font-bold">Southern Maldives</span>
                            </div>
                            <h4 className="text-white font-serif text-2xl sm:text-3xl italic">
                              {formData.destination === 'not_sure' ? 'Expert Selection' : formData.destination}
                            </h4>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="p-6 flex items-center justify-between bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#022c22]">Selected</span>
                          </div>
                          <Button
                            variant="ghost"
                            onClick={() => handleInputChange('destination', '')}
                            className="text-[9px] uppercase tracking-widest font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                          >
                            Change Destination
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* --- Default State: Search & Grid --- */
                    <div className="space-y-6">
                      <div className="relative max-w-xl mx-auto group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                          <MapPin className="w-4 h-4 text-emerald-600 group-focus-within:text-[#022c22] transition-colors" />
                        </div>
                        <Input
                          placeholder="Search 50+ luxury resorts..."
                          className="h-14 pl-12 pr-4 rounded-2xl border-slate-100 bg-slate-50/50 font-serif text-md focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all shadow-sm"
                          onChange={(e) => handleInputChange('destination', e.target.value)}
                          value=""
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-2 scrollbar-hide pb-4">
                        {/* Surprise Me Option */}
                        <button
                          type="button"
                          onClick={() => handleInputChange('destination', 'not_sure')}
                          className="flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 border-dashed border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/30 transition-all h-40"
                        >
                          <span className="text-3xl mb-2">✨</span>
                          <span className="text-[9px] uppercase tracking-widest font-bold text-[#022c22]">Surprise Me</span>
                        </button>

                        {/* Filtered Results */}
                        {hotels.map((hotel) => (
                          <button
                            key={hotel.id}
                            type="button"
                            onClick={() => handleInputChange('destination', hotel.name)}
                            className="group relative h-40 rounded-[2rem] overflow-hidden border border-slate-100"
                          >
                            <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                              style={{ backgroundImage: `url(${hotel.images?.[0]})` }}
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute bottom-4 left-5 right-5 text-left">
                              <div className="text-white font-serif text-sm italic">{hotel.name}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-xl mx-auto">
                  <div className="text-center">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-emerald-600 font-bold block mb-1">Step 03</span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#022c22]">Your Escape Timeline</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <Label className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#022c22] font-bold absolute -top-2 left-6 bg-white px-2 z-10">Arrival</Label>
                      <Input type="date" value={formData.check_in} onChange={(e) => handleInputChange('check_in', e.target.value)} className="h-14 rounded-2xl border-slate-100 px-4 font-serif text-md bg-slate-50/30" />
                    </div>
                    <div className="relative">
                      <Label className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#022c22] font-bold absolute -top-2 left-6 bg-white px-2 z-10">Departure</Label>
                      <Input type="date" value={formData.check_out} onChange={(e) => handleInputChange('check_out', e.target.value)} className="h-14 rounded-2xl border-slate-100 px-4 font-serif text-md bg-slate-50/30" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-8 pt-2">
                    {[{ label: 'Adults', field: 'adults' as const }, { label: 'Children', field: 'children' as const }].map((item) => (
                      <div key={item.label} className="flex flex-col items-center space-y-3 sm:space-y-4">
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold">{item.label}</span>
                        <div className="flex items-center gap-4 sm:gap-6">
                          <button type="button" onClick={() => handleInputChange(item.field, Math.max(0, Number(formData[item.field]) - 1))} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-slate-100 flex items-center justify-center transition-all">—</button>
                          <span className="font-serif text-xl sm:text-2xl w-6 text-center italic">{formData[item.field]}</span>
                          <button type="button" onClick={() => handleInputChange(item.field, Number(formData[item.field]) + 1)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-slate-100 flex items-center justify-center transition-all">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="text-center">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-emerald-600 font-bold block mb-1">Step 04</span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#022c22]">Tailoring the Experience</h3>
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">All selections below are optional</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Transfer Option */}
                    <button
                      type="button"
                      onClick={() => handleInputChange('airport_transfer', !formData.airport_transfer)}
                      className={cn(
                        "flex items-center gap-3 sm:gap-4 p-4 rounded-3xl border transition-all text-left group",
                        formData.airport_transfer
                          ? "border-[#022c22] bg-[#022c22]/5 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        formData.airport_transfer ? "bg-[#022c22] text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      )}>
                        <Plane className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#022c22]">Airport Transfer</div>
                        <div className="text-[9px] text-slate-400 italic">Speedboat escort</div>
                      </div>
                      {/* Toggle UI Indicator */}
                      <div className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                        formData.airport_transfer
                          ? "bg-[#022c22] border-[#022c22]"
                          : "border-slate-300 bg-slate-50 group-hover:border-slate-400"
                      )}>
                        {formData.airport_transfer && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>

                    {/* Meal Plans Grid */}
                    <div className="space-y-2">
                      <span className="text-[8px] uppercase tracking-widest font-bold text-slate-400 block mb-1 px-1">Meal Plan Preference</span>
                      <div className="grid grid-cols-2 gap-2">
                        {mealPlans.map((m) => {
                          const isSelected = formData.meal_plan === m.value;
                          return (
                            <button
                              key={m.value}
                              type="button"
                              onClick={() => handleInputChange('meal_plan', isSelected ? '' : m.value)} // Toggle off if clicked again
                              className={cn(
                                "py-2.5 px-2 border rounded-xl text-[8px] sm:text-[9px] uppercase tracking-widest font-bold transition-all text-center",
                                isSelected
                                  ? "bg-[#022c22] text-white border-[#022c22] shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                              )}
                            >
                              {m.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-widest font-bold text-slate-400 block px-1">Special Requests</span>
                    <Textarea
                      placeholder="Any specific dietary needs, villa preferences, or celebration details..."
                      value={formData.special_requests}
                      onChange={(e) => handleInputChange('special_requests', e.target.value)}
                      className="min-h-[100px] rounded-[1.5rem] bg-white border-slate-200 focus-visible:border-emerald-500 pt-4 px-6 italic text-[13px] shadow-sm"
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-lg mx-auto">
                  <div className="text-center">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-emerald-600 font-bold block mb-1">Step 05</span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#022c22]">Contact Information</h3>
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">Choose your preferred way to connect</p>
                  </div>

                  {/* Contact Preferences */}
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {contactMethods.map((c) => {
                      const Icon = c.icon;
                      const isActive = formData.contact_preference === c.value;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => handleInputChange('contact_preference', c.value)}
                          className={cn(
                            "flex-1 p-4 rounded-[1.2rem] border flex flex-col items-center gap-2 transition-all group",
                            isActive
                              ? "border-[#022c22] bg-emerald-50/50 shadow-sm"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                          )}
                        >
                          <Icon className={cn(
                            "w-4 h-4 sm:w-5 sm:h-5 transition-colors",
                            isActive ? "text-[#022c22]" : "text-slate-400 group-hover:text-slate-600"
                          )} />
                          <span className={cn(
                            "text-[8px] font-bold tracking-[0.1em] uppercase transition-colors",
                            isActive ? "text-[#022c22]" : "text-slate-500 group-hover:text-slate-700"
                          )}>
                            {c.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 gap-5 mt-4">
                    {['name', 'email', 'phone'].map((field) => {
                      const hasError = !!errors[field as keyof FormData];
                      return (
                        <div key={field} className="relative space-y-1">
                          <Label className={cn(
                            "text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold transition-colors block px-1",
                            hasError ? "text-rose-500" : "text-[#022c22]/70"
                          )}>
                            {field === 'phone' ? 'Phone Number' : field === 'email' ? 'Email Address' : 'Full Name'}
                          </Label>
                          <Input
                            placeholder={`Enter your ${field}...`}
                            value={formData[field as keyof FormData] as string}
                            onChange={(e) => handleInputChange(field as keyof FormData, e.target.value)}
                            className={cn(
                              "border-0 border-b rounded-none h-11 px-1 bg-transparent text-lg font-serif italic focus-visible:ring-0 transition-all",
                              hasError
                                ? "border-rose-400 focus-visible:border-rose-500 text-rose-700"
                                : "border-slate-200 focus-visible:border-[#022c22] text-[#022c22]"
                            )}
                          />
                          {hasError && (
                            <span className="text-[9px] text-rose-500 font-medium tracking-wide italic absolute right-1 bottom-[-16px]">
                              {errors[field as keyof FormData]}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {currentStep === 6 && (
                <motion.div key="s6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-xl mx-auto">
                  <div className="text-center">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-emerald-600 font-bold block mb-1">Step 06</span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#022c22]">Review Request</h3>
                  </div>
                  <div className="bg-slate-50/50 p-5 sm:p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-slate-400">Destination</span>
                      <span className="text-sm sm:text-md font-serif italic text-[#022c22]">{formData.destination === 'not_sure' ? 'To Be Confirmed' : formData.destination}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-slate-400 block">Party</span>
                        <span className="text-xs font-serif italic">{formData.adults} Adults, {formData.children} Children</span>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-slate-400 block">Meal Plan</span>
                        <span className="text-xs font-serif italic">{formData.meal_plan || 'TBD'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 px-4 py-3 bg-emerald-50/30 rounded-2xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-light italic">We prioritize your privacy and bespoke travel requirements.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Bar - Fixed at bottom */}
          {!isComplete && (
            <div className="px-6 sm:px-10 pb-6 sm:pb-8 pt-4 flex justify-between gap-4 sm:gap-6 shrink-0 bg-white border-t sm:border-none">
              <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1} className="text-[#022c22] px-0 font-bold text-[9px] sm:text-[10px] tracking-[0.2em] uppercase disabled:opacity-20">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" /> Back
              </Button>
              {currentStep < 6 ? (
                <Button onClick={handleNext} className="bg-[#022c22] hover:bg-[#064e3b] text-white w-36 sm:w-44 h-12 rounded-2xl text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold shadow-lg transition-all">
                  Next <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#022c22] hover:bg-[#064e3b] text-white flex-1 h-12 rounded-2xl text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold shadow-lg transition-all">
                  {isSubmitting ? 'Requesting...' : 'Confirm Escape'} <Send className="w-3 h-3 sm:w-4 sm:h-4 ml-3" />
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
