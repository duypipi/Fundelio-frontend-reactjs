'use client';
import { Clock, Bookmark, MapPin, Users } from 'lucide-react';

export const ProjectCard = ({
  project,
  onBookmarkToggle,
  className = '',
  asLink,
  size = 'default', // default, tall, wide
  mode = 'default', // default (hover to show), expanded (always show)
}) => {
  const {
    id,
    title,
    authorName,
    authorAvatarUrl,
    imageUrl,
    daysLeft,
    progressPercent,
    pledged,
    goal,
    description,
    category,
    location,
    bookmarked = false,
  } = project;

  // No GSAP: keep component simple with CSS hover only

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle?.(id, !bookmarked);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'tall':
        return 'min-h-[400px]';
      case 'wide':
        return 'min-h-[320px]';
      default:
        return 'min-h-[200px]';
    }
  };

  const CardContent = () => (
    <article
      role="article"
      className={`
        group relative bg-white dark:bg-black overflow-visible
        transition-all duration-200 ease-out
        drop-shadow-sm hover:-translate-y-1
        hover:shadow-[0_6px_18px_2px_rgba(25,90,254,0.45)] hover:backdrop-blur-[2px]
        break-inside-avoid mb-6 rounded-t-lg 
        ${getSizeClasses()}
        ${className}
      `}
    >
      <div
        className="relative"
      >
        {/* Image Container */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-md">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={`Cover image for ${title} project`}
            className="w-full h-full object-cover transform-gpu transition-transform duration-300 group-hover:scale-[1.03]"
            style={{ willChange: 'transform' }}
            loading="lazy"
          />

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-200/80 h-2">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Project progress: ${progressPercent}%`}
            />
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full
                      hover:bg-white hover:scale-110 transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10"
            aria-pressed={bookmarked}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark
              className={`w-4 h-4 transition-colors ${bookmarked ? 'fill-primary text-primary' : 'text-gray-600'}`}
            />
          </button>
        </div>

        {/* Main Content - Always Visible */}
        <div className="px-4 pt-2 pb-3 relative z-10 bg-white dark:bg-black">
          {/* Author Info */}
          <div className="flex items-start">
            <img
              src={authorAvatarUrl || '/api/placeholder/32/32'}
              alt={`${authorName}'s avatar`}
              className="w-8 h-8 rounded-full mr-3 object-cover"
            />
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="font-semibold text-text-primary dark:text-text-white text-lg line-clamp-2 leading-tight">
                {title}
              </h3>
              <p className="text-xs text-text-secondary dark:text-text-white">
                by {authorName}
              </p>
            </div>
          </div>

          {/* Funding Stats */}
          <div className="mb-0">
            <div className="flex items-center justify-between gap-2 mb-1 text-primary dark:text-text-white">
              <div className="flex flex-col sm:flex-col">
                {project.startingPrice != null && (
                  <div className="mt-3">
                    <span className="block text-xs text-text-secondary dark:text-text-white">
                      Mức ủng hộ từ
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(project.startingPrice)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-text-secondary dark:text-text-white">
              <span>
                <span className="text-md text-secondary font-bold">
                  {progressPercent}%
                </span>{' '}
                <span className="text-sm">đã huy động</span>
              </span>
              <span className="inline-flex items-center gap-1 text-sm">
                <Clock className="w-3 h-3" />
                Còn {daysLeft} ngày
              </span>
            </div>
          </div>
        </div>

        {/* Removed bottom content as requested; emphasis handled by GSAP hover */}
      </div>
    </article>
  );

  // Wrap with link if asLink is provided
  if (asLink) {
    return (
      <a href={asLink} className="block">
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
};

export default ProjectCard;
