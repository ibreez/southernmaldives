import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSiteSettingsStore } from '@/stores/siteSettingsStore';
import { Mail, MapPin, Phone, Clock, Send, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const { whatsappNumber } = useSiteSettingsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Message sent successfully! We will get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#020617] selection:bg-emerald-500/30 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src="/assets/contact-office-interior.webp"
            className="w-full h-full object-cover opacity-40"
            alt="Southern Maldives Hub"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-transparent to-[#020617]" />
        </div>

        <div className="relative z-10 text-center px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-8 bg-emerald-500/40" />
              <span className="text-emerald-400 text-[10px] font-bold tracking-[0.5em] uppercase">Connect</span>
              <div className="h-px w-8 bg-emerald-500/40" />
            </div>
            <h1 className="font-serif text-5xl md:text-8xl text-white tracking-tight leading-none">
              Reach <span className="italic font-extralight text-emerald-400">Our Experts</span>
            </h1>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 w-px bg-gradient-to-t from-emerald-500 to-transparent" />
      </section>

      <section className="relative py-24">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Sidebar Info */}
            <div className="lg:col-span-4 space-y-12 pt-4">
              <div className="space-y-6">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-500">Concierge Desk</span>
                <h2 className="font-serif text-4xl text-white italic leading-tight">Personalized <br/> Assistance</h2>
                <p className="text-slate-400 font-light leading-relaxed text-sm">
                  Whether you seek a private island retreat or an authentic island life experience, our experts are at your disposal.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: MapPin, title: 'Atoll Hub', content: 'Sun View, Meedhoo, Addu City' },
                  { icon: Phone, title: 'Direct Line', content: whatsappNumber || '+960 9495654', isWhatsApp: true },
                  { icon: Mail, title: 'Digital Desk', content: 'travel@southernmaldives.com' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <item.icon className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500">{item.title}</h3>
                      {item.isWhatsApp ? (
                        <a 
                          href={`https://wa.me/${(whatsappNumber || "+960 9495654").replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-light text-sm italic hover:text-emerald-400 transition-colors"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-white font-light text-sm italic">{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adjusted Contact Form: Slightly Lighter Background */}
            <div className="lg:col-span-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative p-px bg-gradient-to-br from-white/20 via-emerald-500/20 to-transparent rounded-[2.5rem]"
              >
                {/* Lighter Glass Container */}
                <div className="bg-white/[0.07] backdrop-blur-2xl rounded-[2.4rem] p-8 md:p-14 shadow-2xl">
                  <div className="mb-10">
                    <h2 className="font-serif text-3xl text-white mb-2">Send <span className="italic font-light text-emerald-300">an Inquiry</span></h2>
                    <p className="text-slate-300/60 font-light text-sm italic">Expect a response from our curators within 24 hours.</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                      {[
                        { id: 'name', label: 'Full Name', placeholder: 'E.g. Alexander Sterling' },
                        { id: 'email', label: 'Email Address', placeholder: 'alex@gmail.com', type: 'email' },
                        { id: 'phone', label: 'Phone Number', placeholder: '+960 ...' },
                        { id: 'subject', label: 'Subject', placeholder: 'Bespoke Itinerary' }
                      ].map((field) => (
                        <div key={field.id} className="relative group">
                          {/* Label: Clearer Font Color */}
                          <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400 mb-2 block group-focus-within:text-emerald-300 transition-colors">
                            {field.label}
                          </label>
                          <input
                            {...register(field.id as keyof ContactFormData, { required: true })}
                            type={field.type || 'text'}
                            placeholder={field.placeholder}
                            className="w-full bg-white/5 border-b border-white/10 py-3 px-1 text-white font-light focus:outline-none focus:border-emerald-400/50 placeholder:text-slate-600 transition-all text-sm"
                          />
                        </div>
                      ))}
                      
                      <div className="md:col-span-2 relative group">
                        <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400 mb-2 block group-focus-within:text-emerald-300 transition-colors">
                          Your Travel Vision
                        </label>
                        <textarea
                          {...register('message', { required: true })}
                          rows={3}
                          placeholder="Tell us about your dream Southern Atoll experience..."
                          className="w-full bg-white/5 border-b border-white/10 py-3 px-1 text-white font-light focus:outline-none focus:border-emerald-400/50 placeholder:text-slate-600 resize-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center">
                       <p className="text-[10px] text-slate-500 italic max-w-[200px]">
                         * All inquiries are handled with absolute discretion.
                       </p>
                      <button
                        disabled={isSubmitting}
                        className="group relative flex items-center gap-4 px-10 py-4 overflow-hidden border border-emerald-400/30 rounded-full transition-all duration-500 hover:border-emerald-300"
                      >
                        <span className="relative z-10 text-[10px] uppercase tracking-[0.4em] font-bold text-white">
                          {isSubmitting ? 'Processing...' : 'Send Message'}
                        </span>
                        <Send className={`relative z-10 w-3 h-3 text-emerald-400 transition-transform duration-500 ${isSubmitting ? 'translate-x-10' : 'group-hover:translate-x-1'}`} />
                        <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>

      <div className="pb-20 flex justify-center opacity-10">
        <Compass className="w-6 h-6 text-emerald-500" />
      </div>
    </div>
  );
}