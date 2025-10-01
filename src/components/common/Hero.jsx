import React, { useState, useEffect } from 'react';
import Button from './Button';
import { mockCampaigns } from '../../data/mockCampaigns';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalSlides = mockCampaigns.length;

  // Tự động chuyển slide mỗi 3 giây
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
        setIsAnimating(false);
        setProgress(0);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  // Progress bar animation
  useEffect(() => {
    if (isPaused) return;

    setProgress(0);
    const startTime = Date.now();
    const duration = 3000;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    const animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [currentSlide, isPaused]);

  // const handleMouseEnter = () => {
  //   setIsPaused(true);

  //   console.log("Ệt")
  // };

  // const handleMouseLeave = () => {
  //   setIsPaused(false);
  // };

  const handleSeeCampaign = () => {
    const campaign = mockCampaigns[currentSlide];
    console.log('Navigate to campaign:', campaign.id);
    // TODO: Implement navigation logic

    setIsPaused(false);
  };

  const handleSlideChange = (index) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
      setProgress(0);
      setIsPaused(false);
    }, 300);
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      role="region"
      aria-label="Featured campaigns hero carousel"
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
    >
      {/* Background Images */}
      {mockCampaigns.map((campaign, index) => (
        <div
          key={campaign.id}
          className={`absolute inset-0 h-full w-full transition-opacity bg-repeat duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={campaign.heroImageUrl}
            alt={campaign.title}
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/70" />

      {/* Content */}
      <div className="relative z-10 flex h-full min-h-screen items-end md:items-center">
        <div className="mx-auto w-full max-w-container px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
          {/* Title with Animation */}
          <h1
            className={`text-3xl font-bold leading-tight text-text-white transition-all duration-300 sm:text-4xl md:text-5xl lg:text-6xl ${
              isAnimating ? 'hero-title-exit' : 'hero-title-enter'
            }`}
            aria-live="polite"
          >
            {mockCampaigns[currentSlide].title}
          </h1>

          {/* Button */}
          <div className="mt-6">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleSeeCampaign}
              className="shadow-lg hover:shadow-xl"
            >
              See Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-4 right-4 h-0.5 w-24 overflow-hidden rounded-full bg-white/20 sm:h-1 sm:w-32 lg:w-40">
        <div
          className="h-full bg-secondary-500 origin-left transition-transform"
          style={{
            transform: `scaleX(${progress / 100})`,
          }}
        />
      </div>

      {/* Slide Indicators - Thumbnail Images */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:gap-3 lg:gap-4">
        {mockCampaigns.map((campaign, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`group relative overflow-hidden rounded-md transition-all duration-300 ${
              index === currentSlide
                ? 'ring-2 ring-[var(--color-secondary-500)] ring-offset-2 ring-offset-black/50 scale-110'
                : 'opacity-60 hover:opacity-100 hover:scale-105'
            }`}
            aria-label={`Go to slide ${index + 1}: ${campaign.title}`}
          >
            <img
              src={campaign.heroImageUrl}
              alt={campaign.title}
              className="h-12 w-16 object-cover sm:h-14 sm:w-20 lg:h-16 lg:w-24"
            />
            {/* Overlay when active */}
            {index === currentSlide && (
              <div className="absolute inset-0 bg-secondary-500/20" />
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/20" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
