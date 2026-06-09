// Example: Optimized hero video implementation
import { useState, useRef, useEffect } from 'react';

interface OptimizedHeroVideoProps {
  posterImage: string;
  videoSrc: string;
}

export function OptimizedHeroVideo({ posterImage, videoSrc }: OptimizedHeroVideoProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy load video after user interaction or when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoadVideo) {
            // Delay video loading to not block initial page load
            setTimeout(() => setShouldLoadVideo(true), 2000);
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('hero-video-container');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [shouldLoadVideo]);

  return (
    <div id="hero-video-container" className="relative h-[600px] overflow-hidden">
      {/* Always show poster image first */}
      <img
        src={posterImage}
        alt="Travel destination"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Load video only when needed */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata" // Only load metadata initially
          onLoadedData={() => setIsVideoLoaded(true)}
          style={{ opacity: isVideoLoaded ? 1 : 0 }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
      
      {/* Overlay content */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/50" />
      {/* Rest of hero content... */}
    </div>
  );
}