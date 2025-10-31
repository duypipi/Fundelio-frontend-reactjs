import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from '../home/ProjectCard';
import { mockProjects } from '@/data/mockProjects';

export const RelatedCampaigns = ({ category, currentCampaignId, className = '' }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsPerPage = 4;

  // Filter campaigns by category and exclude current campaign
  // Use case-insensitive comparison for flexibility
  const relatedCampaigns = mockProjects.filter(
    (project) => 
      project.category?.toLowerCase() === category?.toLowerCase() && 
      project.id !== currentCampaignId
  );

  const totalPages = Math.ceil(relatedCampaigns.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return relatedCampaigns.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    if (newPage === currentPage || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentPage(newPage);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      handlePageChange(currentPage + 1);
    }
  };

  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  // If no related campaigns, don't render anything
  if (relatedCampaigns.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 sm:py-16 lg:py-20 bg-background-light-2 dark:bg-darker transition-colors duration-300 ${className}`}>
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Navigation */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-white transition-colors duration-300">
              Dự án liên quan
            </h2>
            <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
              Các chiến dịch khác trong danh mục <span className="font-semibold text-primary">{category}</span>
            </p>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2 ">
              <button
                onClick={handlePrevPage}
                disabled={!canGoPrev || isTransitioning}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  canGoPrev && !isTransitioning
                    ? 'bg-primary text-white hover:bg-primary-600 hover:scale-105 active:scale-95'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-sm text-text-secondary dark:text-gray-400 font-medium min-w-[60px] text-center transition-colors duration-300">
                {currentPage + 1} / {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={!canGoNext || isTransitioning}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  canGoNext && !isTransitioning
                    ? 'bg-primary text-white hover:bg-primary-600 hover:scale-105 active:scale-95'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Grid of Campaign Cards with Animation */}
        <div className="relative overflow-hidden">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 transition-all duration-500 ease-in-out pt-6 ${
              isTransitioning 
                ? 'opacity-0 transform translate-y-4' 
                : 'opacity-100 transform translate-y-0'
            }`}
          >
            {getCurrentPageItems().map((campaign, index) => (
              <div
                key={campaign.id}
                className="transform transition-all duration-300"
                style={{
                  transitionDelay: isTransitioning ? '0ms' : `${index * 50}ms`
                }}
              >
                <ProjectCard
                  project={campaign}
                  onBookmarkToggle={(id, bookmarked) => {
                    console.log('Bookmark toggled:', id, bookmarked);
                    // TODO: Implement bookmark logic
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Page Indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                disabled={isTransitioning}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RelatedCampaigns;
