import { useEffect, useState } from 'react';
import { Banner as BannerType } from '../../types';

interface BannerProps {
  banners: BannerType[];
  autoplay?: boolean;
  interval?: number;
}

const Banner = ({ banners, autoplay = true, interval = 5000 }: BannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter only active banners and sort by order
  const activeBanners = banners
    .filter(banner => banner.isActive)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (!autoplay || activeBanners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % activeBanners.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, activeBanners.length, interval]);

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % activeBanners.length);
  };

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden h-[400px]">
      {/* Banner Images */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeBanners.map(banner => (
          <div key={banner.id} className="w-full flex-shrink-0">
            <div
              className="h-[400px] bg-cover bg-center relative"
              style={{ backgroundImage: `url(${banner.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="text-center text-white p-4 max-w-3xl">
                  <h2 className="text-4xl font-bold mb-2">{banner.title}</h2>
                  <p className="text-xl mb-6">{banner.subtitle}</p>
                  {banner.link && (
                    <a href={banner.link} className="btn-primary inline-block">
                      Xem thêm
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            onClick={handlePrev}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            onClick={handleNext}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-white'
                }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
