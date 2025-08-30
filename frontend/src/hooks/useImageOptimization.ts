import { useEffect, useState, useCallback } from 'react';
import { preloadImages } from '../utils/bookCover';
import { Book } from '../types';

interface UseImagePreloadingProps {
  books: Book[];
  enabled: boolean;
}

export const useImagePreloading = ({ books, enabled }: UseImagePreloadingProps) => {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [isPreloading, setIsPreloading] = useState(false);

  const preloadBookImages = useCallback(async () => {
    if (!enabled || isPreloading || books.length === 0) return;

    setIsPreloading(true);
    
    // Get unique image URLs
    const imageUrls = books
      .map(book => book.coverImageUrl)
      .filter((url): url is string => Boolean(url))
      .filter(url => !preloadedImages.has(url));

    if (imageUrls.length === 0) {
      setIsPreloading(false);
      return;
    }

    try {
      // Preload images in batches to avoid overwhelming the network
      await preloadImages(imageUrls, 3);
      
      setPreloadedImages(prev => {
        const newSet = new Set(prev);
        imageUrls.forEach(url => newSet.add(url));
        return newSet;
      });
    } catch (error) {
      console.warn('Error preloading images:', error);
    } finally {
      setIsPreloading(false);
    }
  }, [books, enabled, isPreloading, preloadedImages]);

  useEffect(() => {
    // Start preloading after a short delay to not interfere with initial page load
    const timer = setTimeout(preloadBookImages, 1000);
    return () => clearTimeout(timer);
  }, [preloadBookImages]);

  return {
    preloadedImages,
    isPreloading,
    preloadBookImages
  };
};

// Network-aware preloading
export const useNetworkAwarePreloading = () => {
  const [shouldPreload, setShouldPreload] = useState(true);

  useEffect(() => {
    // Check if the browser supports the Network Information API
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updatePreloadStrategy = () => {
        // Don't preload on slow connections or when data saver is on
        const slowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
        const dataSaver = connection.saveData;
        
        setShouldPreload(!slowConnection && !dataSaver);
      };

      updatePreloadStrategy();
      connection.addEventListener('change', updatePreloadStrategy);

      return () => {
        connection.removeEventListener('change', updatePreloadStrategy);
      };
    }
  }, []);

  return shouldPreload;
};

// Image loading performance monitor
export const useImagePerformance = () => {
  const [metrics, setMetrics] = useState({
    totalLoaded: 0,
    totalErrors: 0,
    averageLoadTime: 0,
    loadTimes: [] as number[]
  });

  const recordImageLoad = useCallback((loadTime: number) => {
    setMetrics(prev => {
      const newLoadTimes = [...prev.loadTimes, loadTime];
      const averageLoadTime = newLoadTimes.reduce((a, b) => a + b, 0) / newLoadTimes.length;
      
      return {
        ...prev,
        totalLoaded: prev.totalLoaded + 1,
        loadTimes: newLoadTimes,
        averageLoadTime
      };
    });
  }, []);

  const recordImageError = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      totalErrors: prev.totalErrors + 1
    }));
  }, []);

  return {
    metrics,
    recordImageLoad,
    recordImageError
  };
};
