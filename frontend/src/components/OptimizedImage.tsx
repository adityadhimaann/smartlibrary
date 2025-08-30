import React, { useState, useEffect, useRef } from 'react';
import { BookOpen } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  fallback: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: React.ReactNode;
  lazy?: boolean;
  retryCount?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallback,
  className = '',
  onLoad,
  onError,
  placeholder,
  lazy = true,
  retryCount = 2
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [attempts, setAttempts] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  // Preload image when visible
  useEffect(() => {
    if (!isVisible || hasError) return;

    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      onLoad?.();
    };
    
    img.onerror = () => {
      if (attempts < retryCount) {
        // Retry loading after a delay
        setTimeout(() => {
          setAttempts(prev => prev + 1);
          setIsLoaded(false);
        }, Math.pow(2, attempts) * 1000); // Exponential backoff
      } else {
        setHasError(true);
        setCurrentSrc(fallback);
        onError?.();
      }
    };

    img.src = currentSrc;
  }, [isVisible, currentSrc, attempts, retryCount, fallback, onLoad, onError, hasError]);

  // Update src when prop changes
  useEffect(() => {
    if (src !== currentSrc) {
      setCurrentSrc(src);
      setIsLoaded(false);
      setHasError(false);
      setAttempts(0);
    }
  }, [src, currentSrc]);

  const defaultPlaceholder = (
    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
      <BookOpen className="w-16 h-16 text-blue-300 animate-pulse" />
    </div>
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Loading skeleton */}
      {isVisible && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
        </div>
      )}

      {/* Placeholder when not visible */}
      {!isVisible && (placeholder || defaultPlaceholder)}

      {/* Actual image */}
      {isVisible && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isLoaded || hasError ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            filter: isLoaded ? 'none' : 'blur(5px)',
            transform: isLoaded ? 'scale(1)' : 'scale(1.1)'
          }}
          loading="lazy"
          decoding="async"
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
          onError={() => {
            if (attempts < retryCount && currentSrc !== fallback) {
              setAttempts(prev => prev + 1);
              setTimeout(() => {
                setIsLoaded(false);
              }, Math.pow(2, attempts) * 1000);
            } else {
              setHasError(true);
              setCurrentSrc(fallback);
              onError?.();
            }
          }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
