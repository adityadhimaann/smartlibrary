export const getBookCoverUrl = (book: { title: string; author: string; isbn?: string }) => {
  // Try Open Library first if we have an ISBN
  if (book.isbn) {
    const cleanIsbn = book.isbn.replace(/[-\s]/g, '');
    return `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`;
  }
  
  // Fallback to Google Books API
  const query = encodeURIComponent(`${book.title} ${book.author}`);
  return `https://books.google.com/books/content?id=placeholder&printsec=frontcover&img=1&zoom=1&source=gbs_api&q=${query}`;
};

export const generatePlaceholderCover = (title: string, author: string, size: 'small' | 'medium' | 'large' = 'medium') => {
  // Create a simple placeholder URL with better styling
  const colors = [
    'FF6B6B', 'FF8E53', 'FF6B35', 'F7931E', 'FFD23F',
    '06FFA5', '1DD1A1', '00D2D3', '0395E3', '3742FA',
    '5F27CD', 'A55EEA', 'C44569', 'F8B500', 'F0932B'
  ];
  
  const colorIndex = title.length % colors.length;
  const backgroundColor = colors[colorIndex];
  const textColor = 'FFFFFF';
  
  const dimensions = {
    small: '200x300',
    medium: '300x400',
    large: '400x600'
  };
  
  const encodedTitle = encodeURIComponent(title.substring(0, 20));
  const encodedAuthor = encodeURIComponent(author.substring(0, 15));
  
  return `https://via.placeholder.com/${dimensions[size]}/${backgroundColor}/${textColor}?text=${encodedTitle}%0A${encodedAuthor}`;
};

// Preload critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Create optimized image URLs with WebP support
export const getOptimizedImageUrl = (originalUrl: string, width?: number, quality = 80) => {
  // For Open Library images, we can add quality parameters
  if (originalUrl.includes('covers.openlibrary.org')) {
    const url = new URL(originalUrl);
    if (width) {
      // Open Library doesn't support custom sizing, but we can use different size codes
      if (width <= 200) {
        return originalUrl.replace('-L.jpg', '-M.jpg'); // Medium size
      } else if (width <= 100) {
        return originalUrl.replace('-L.jpg', '-S.jpg'); // Small size
      }
    }
    return originalUrl;
  }
  
  return originalUrl;
};

// Batch preload images for better performance
export const preloadImages = async (urls: string[], batchSize = 3): Promise<void> => {
  const batches = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    batches.push(urls.slice(i, i + batchSize));
  }
  
  for (const batch of batches) {
    await Promise.allSettled(batch.map(preloadImage));
    // Small delay between batches to avoid overwhelming the network
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};
