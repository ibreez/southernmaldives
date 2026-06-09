import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Thumbs, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface ImageGalleryProps {
  images: string[];
  thumbnails?: string[];
  captions?: string[];
  autoPlay?: boolean;
  showThumbs?: boolean;
  showIndicators?: boolean;
}

export function ImageGallery({
  images,
  thumbnails,
  captions,
  autoPlay = false,
  showThumbs = true,
  showIndicators = true,
}: ImageGalleryProps) {
  const thumbnailImages = thumbnails || images;

  const [mainSwiper, setMainSwiper] = React.useState<SwiperType | null>(null);
  const [thumbSwiper, setThumbSwiper] = React.useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    // KEY FIX: Swiper's inner .swiper-wrapper and .swiper-slide don't inherit h-full
    // without explicit CSS. The style block below forces the full height chain:
    // .swiper → .swiper-wrapper → .swiper-slide → img, all the way down.
    <div className="relative w-full h-full" style={{ ['--swiper-height' as string]: '100%' }}>
      <style>{`
        .main-gallery-swiper,
        .main-gallery-swiper .swiper-wrapper,
        .main-gallery-swiper .swiper-slide {
          height: 100% !important;
        }
        .main-gallery-swiper .swiper-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .thumb-gallery-swiper .swiper-slide {
          width: 80px !important;
        }
        /* Active thumb highlight */
        .thumb-gallery-swiper .swiper-slide-thumb-active > div {
          ring-color: rgb(52 211 153);
          opacity: 1;
        }
      `}</style>

      {/* Main Slider */}
      <Swiper
        modules={[Navigation, Thumbs, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        thumbs={thumbSwiper ? { swiper: thumbSwiper } : undefined}
        loop={images.length > 1}
        autoplay={autoPlay ? { delay: 5000, disableOnInteraction: false } : false}
        speed={500}
        onSwiper={setMainSwiper}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="main-gallery-swiper w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Hotel image ${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {captions?.[index] && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white px-4 py-2 text-sm z-10">
                {captions[index]}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      {showThumbs && thumbnailImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-black/20 backdrop-blur-sm rounded-full p-2 max-w-[80vw] overflow-hidden">
          <Swiper
            modules={[Thumbs]}
            spaceBetween={8}
            slidesPerView="auto"
            watchSlidesProgress={true}
            watchOverflow={true}
            onSwiper={setThumbSwiper}
            className="thumb-gallery-swiper"
          >
            {thumbnailImages.map((image, index) => (
              <SwiperSlide key={index} className="opacity-70 transition-opacity hover:opacity-100 cursor-pointer">
                <div className="relative w-20 h-14 overflow-hidden rounded-full ring-2 ring-transparent hover:ring-emerald-400 transition-all">
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 pointer-events-none">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                activeIndex === index ? 'bg-emerald-400' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-30"
        onClick={() => mainSwiper?.slidePrev()}
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-30"
        onClick={() => mainSwiper?.slideNext()}
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}