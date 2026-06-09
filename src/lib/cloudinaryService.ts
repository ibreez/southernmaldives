/**
 * Cloudinary image upload and optimization service
 * Handles dining image uploads with automatic compression and responsive transformations
 */

import type { CloudinaryUploadResponse } from '@/types/dining';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.warn(
    'Cloudinary credentials not configured. Image uploads will be disabled. ' +
    'Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env'
  );
}

/**
 * Upload an image to Cloudinary with automatic optimization
 * @param file - The image file to upload
 * @returns Promise containing the optimized image URL and metadata
 */
export async function uploadImage(
  file: File
): Promise<CloudinaryUploadResponse> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary not configured. Please add credentials to .env'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'southern-maldives/dining');
  // Transform options: resize to max 1200px width, auto quality (80%), auto format
  formData.append('transformation', JSON.stringify({
    width: 1200,
    crop: 'scale',
    quality: 'auto:best',
    fetch_format: 'auto',
  }));

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      public_id: data.public_id,
      secure_url: data.secure_url,
      width: data.width,
      height: data.height,
      bytes: data.bytes,
      format: data.format,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Generate an optimized Cloudinary image URL with responsive transformations
 * @param publicId - The Cloudinary public_id
 * @param width - Target width in pixels
 * @param quality - Quality level (1-100), default 80
 * @returns Optimized image URL
 */
export function optimizeImageUrl(
  publicId: string,
  width: number = 1200,
  quality: number = 80
): string {
  if (!CLOUDINARY_CLOUD_NAME) {
    return '';
  }

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},q_${quality},f_auto/v1/${publicId}`;
}

/**
 * Generate a responsive srcset for an image
 * Useful for <img srcset="..." /> attributes
 * @param publicId - The Cloudinary public_id
 * @returns srcset string with multiple resolutions
 */
export function getResponsiveSrcset(publicId: string): string {
  const sizes = [
    { width: 600, quality: 70 },
    { width: 1000, quality: 75 },
    { width: 1200, quality: 80 },
  ];

  return sizes
    .map(({ width, quality }) => `${optimizeImageUrl(publicId, width, quality)} ${width}w`)
    .join(', ');
}

/**
 * Get a blurred placeholder image URL for lazy loading
 * @param publicId - The Cloudinary public_id
 * @returns Blurred, low-quality placeholder URL
 */
export function getPlaceholderUrl(publicId: string): string {
  if (!CLOUDINARY_CLOUD_NAME) {
    return '';
  }

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_100,q_20,f_auto,e_blur:300/v1/${publicId}`;
}

/**
 * Validate that a file is a valid image
 * @param file - The file to validate
 * @returns true if valid, false otherwise
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return false;
  }

  if (file.size > maxSize) {
    return false;
  }

  return true;
}

/**
 * Get a human-readable file size
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
