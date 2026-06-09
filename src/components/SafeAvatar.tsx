import { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  alt: string;
  imgClassName?: string;
  fallbackClassName?: string;
  containerClassName?: string;
}

export function SafeAvatar({ src, alt, imgClassName = '', fallbackClassName = '', containerClassName = '' }: AvatarProps) {
  const [error, setError] = useState(false);

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Validate URL format
  const isValidUrl = (url: string | null | undefined) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (!src || error || !isValidUrl(src)) {
    return (
      <div className={`${containerClassName} ${fallbackClassName} bg-emerald-50 flex items-center justify-center font-serif text-emerald-700 font-bold`}>
        {getInitials(alt)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${containerClassName} ${imgClassName}`}
      loading="lazy"
      onLoad={() => setError(false)}
      onError={() => setError(true)}
      draggable={false}
    />
  );
}

export default SafeAvatar;
