import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LuxuryHeroSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout>();

  // Detect connection speed and data saver mode
  const getConnectionInfo = () => {
    const connection = (navigator as { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
    return {
      isSlowConnection:
        connection?.effectiveType === 'slow-2g' ||
        connection?.effectiveType === '2g' ||
        connection?.saveData === true,
    };
  };

  // Intersection observer for lazy loading
  useEffect(() => {
    const { isSlowConnection } = getConnectionInfo();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoadVideo && !isSlowConnection) {
            // Defer video loading to not block initial page render
            loadTimeoutRef.current = setTimeout(() => {
              setShouldLoadVideo(true);
            }, 500);
          }
        });
      },
      { threshold: 0.05, rootMargin: '200px' },
    );

    const element = containerRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, [shouldLoadVideo]);

  const handleVideoLoadedData = () => {
    setIsVideoLoaded(true);
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // autoplay may be blocked without user interaction
        });
      }
    }
  };

  const handleVideoError = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    setVideoError(true);
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#020617] selection:bg-emerald-500/30"
    >
      {/* Background Media Layer */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="/assets/hero-tropical-beach-sunset.jpg"
          alt="Southern Maldives"
          className="w-full h-full object-cover opacity-50 md:opacity-60"
          loading="eager"
          decoding="async"
        />

        {/* Video Layer with optimized loading */}
        {shouldLoadVideo && !videoError && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              isVideoLoaded ? 'opacity-80' : 'opacity-0'
            }`}
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/hero-tropical-beach-sunset.jpg"
            onCanPlayThrough={handleVideoLoadedData}
            onError={handleVideoError}
          >
            {/* WebM format first (usually 30-40% smaller than MP4) */}
            <source src="/hero.webm" type="video/webm" />
            {/* MP4 fallback for older browsers */}
            <source src="/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Loading indicator while video buffers */}
        {shouldLoadVideo && !isVideoLoaded && !videoError && (
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 bg-black/10"
          />
        )}

        {/* Improved Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-transparent to-[#020617]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(2,6,23,0.8)_100%)]" />
      </div>

      {/* Hero Content - Adjusted pt-32 to clear the navbar on mobile */}
      <div className="relative z-10 text-center px-6 md:px-8 max-w-5xl mx-auto pt-32 pb-24 md:pb-32">
        
        {/* Eyebrow - Fixed z-index to stay below navbar but visible */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8"
        >
          <div className="h-px w-6 md:w-8 bg-emerald-500/30" />
          <div className="flex items-center gap-2">
            <Compass className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-400" />
            <span className="text-white text-[8px] md:text-[9px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase">
              Addu Atoll · Maldives
            </span>
          </div>
          <div className="h-px w-6 md:w-8 bg-emerald-500/30" />
        </motion.div>

        {/* Headline - Scaled for smaller screens */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="font-serif text-4xl sm:text-5xl md:text-8xl text-white tracking-tight leading-[1.2] md:leading-[1.1] mb-6 md:mb-8"
        >
          Discover Maldives <br className="hidden sm:block" />
          <span className="italic font-extralight text-emerald-400">Beyond the Ordinary</span>
        </motion.h1>

        {/* Paragraph - Optimized for mobile reading width */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-slate-300 font-light text-sm md:text-lg mb-10 md:mb-12 max-w-[280px] sm:max-w-xl mx-auto leading-relaxed italic opacity-90"
        >
          "Personalized Maldives journeys with local island experiences, diving adventures, and handpicked resort escapes.          pnpm dev"
        </motion.p>

        {/* Action Group */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col items-center gap-6 md:gap-8"
        >
          <Link to="/hotels" className="w-full sm:w-auto">
            <button className="group relative w-full sm:w-auto flex items-center justify-center gap-4 px-8 md:px-10 py-3.5 md:py-4 overflow-hidden border border-emerald-500/40 rounded-full transition-all duration-500 hover:border-emerald-300">
              <span className="relative z-10 text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold text-white">
                Explore Collection
              </span>
              <ArrowRight className="relative z-10 w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400 group-hover:translate-x-1 transition-all" />
              <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>
          </Link>

          <Link 
            to="/contact" 
            className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-slate-400 hover:text-emerald-400 transition-all underline underline-offset-8 decoration-white/5"
          >
            Private Escapes
          </Link>
        </motion.div>
      </div>

      {/* Luxury Scroll Indicator - Hidden on very small screens to avoid clutter */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center"
      >
        <div className="w-px h-10 md:h-12 bg-gradient-to-b from-emerald-500/40 to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-scroll-line" />
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scroll-line {
          animation: scroll-line 3s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
      `}} />
    </section>
  );
}