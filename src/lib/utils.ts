import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function optimizeCloudinaryImageUrl(url: string | undefined, width = 1200, quality = 'auto'): string {
  if (!url) return '';
  if (!url.includes('cloudinary')) return url;
  
  // Check if URL already has transformation parameters
  const hasTransform = url.includes('/c_') || url.includes('/w_') || url.includes('/q_') || url.includes('/f_');
  const separator = url.includes('?') ? '&' : '?';
  
  // If already has transformations, return as-is (or could append additional params)
  if (hasTransform) {
    return url;
  }
  
  // Add Cloudinary transformation parameters for optimization
  // c_limit,w_{width},q_{quality},f_auto for automatic format selection
  const transform = `/c_limit,w_${width},q_${quality},f_auto`;
  
  // Insert transformation before file extension or before query params
  const lastDotIndex = url.lastIndexOf('.');
  const queryIndex = url.indexOf('?');
  
  // If there's a query string, insert transformation before it
  if (queryIndex > 0) {
    return url.slice(0, queryIndex) + transform + url.slice(queryIndex);
  }
  
  // Otherwise insert before file extension if present
  if (lastDotIndex > 0) {
    return url.slice(0, lastDotIndex) + transform + url.slice(lastDotIndex);
  }
  
  return url + transform;
}

export function optimizeCloudinaryVideoUrl(url: string | undefined): string {
  if (!url) return '';
  if (!url.includes('cloudinary')) return url;
  
  // Check if URL already has transformation parameters
  const hasTransform = url.includes('/c_') || url.includes('/w_') || url.includes('/q_') || url.includes('/f_') || url.includes('/vc_');
  
  if (hasTransform) {
    return url;
  }
  
  // Add Cloudinary video transformation parameters
  // c_limit,w_1200,q_auto,f_auto,vp9 for optimal video format
  const transform = '/c_limit,w_1200,q_auto,f_auto';
  
  const queryIndex = url.indexOf('?');
  const lastDotIndex = url.lastIndexOf('.');
  
  if (queryIndex > 0) {
    return url.slice(0, queryIndex) + transform + url.slice(queryIndex);
  }
  
  if (lastDotIndex > 0) {
    return url.slice(0, lastDotIndex) + transform + url.slice(lastDotIndex);
  }
  
  return url + transform;
}
