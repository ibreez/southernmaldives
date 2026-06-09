import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const connection = (navigator as { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
    const isSlowConnection =
      connection?.effectiveType === 'slow-2g' ||
      connection?.effectiveType === '2g' ||
      connection?.saveData === true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoadVideo && !isSlowConnection) {
            setShouldLoadVideo(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' },
    );

    const element = containerRef.current;
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, [shouldLoadVideo]);

  useEffect(() => {
    if (isVideoLoaded && shouldLoadVideo && videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log('Auto-play prevented by browser');
      });
    }
  }, [isVideoLoaded, shouldLoadVideo]);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    setIsVideoPlaying(true);
  };

  const handleVideoError = () => {
    console.warn('Video failed to load, falling back to poster image');
    setIsVideoLoaded(false);
    setShouldLoadVideo(false);
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/hero-tropical-beach-sunset.jpg"
          alt="Southern Maldives — Below the Equator"
          className="w-full h-full object-cover"
        />

        {/* Progressive video overlay */}
        {shouldLoadVideo && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            poster="/assets/hero-tropical-beach-sunset.jpg"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        )}

        {/* Rich emerald-navy hero overlay */}
        <div className="absolute inset-0 bg-gradient-hero-overlay" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto pt-24">
        {/* Eyebrow label */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-5 py-1.5 mb-8 animate-in fade-in duration-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-300 text-xs font-medium tracking-[0.25em] uppercase">
            Below the Equator · Addu City, Maldives
          </span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          Where the Ocean
          <br />
          <span className="italic text-emerald-300">Meets Emerald</span>
        </h1>

        <p className="text-lg md:text-xl mb-10 text-white/75 font-light tracking-wide max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          Discover the Southern Atolls — greener, less commercial, and more authentic than anywhere else in the Maldives.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Link to="/hotels">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-base px-10 shadow-lg shadow-emerald-900/40 hover:scale-105 transition-all duration-200"
            >
              Explore Resorts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full text-base px-10 border-white/50 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white transition-all duration-200"
            >
              Plan My Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 animate-bounce">
        <span className="text-[0.6rem] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </section>
  );
}
