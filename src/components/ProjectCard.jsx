'use client';
import { Clock, Bookmark, MapPin, Users } from 'lucide-react';

export const ProjectCard = ({
  project,
  onBookmarkToggle,
  className = '',
  asLink,
  size = 'default', // default, tall, wide
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
    backerCount,
    description,
    category,
    location,
    bookmarked = false,
  } = project;

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle?.(id, !bookmarked);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
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
        return 'min-h-[280px]';
    }
  };

  const CardContent = () => (
    <article
      role="article"
      className={`
        group relative bg-white rounded-xl border border-gray-200 overflow-visible
        transition-all duration-300 ease-out
        hover:shadow-2xl hover:z-20
        focus-within:shadow-2xl focus-within:z-20
        break-inside-avoid mb-6
        ${getSizeClasses()}
        ${className}
      `}
      tabIndex={0}
    >
      <div className="relative transition-transform duration-300 group-hover:-translate-y-2 group-focus-within:-translate-y-2">
        {/* Image Container */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={`Cover image for ${title} project`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-200/80 backdrop-blur-sm h-2">
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
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full
                      hover:bg-white hover:scale-110 transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-20"
            aria-pressed={bookmarked}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark
              className={`w-4 h-4 transition-colors ${
                bookmarked ? 'fill-primary text-primary' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        {/* Main Content - Always Visible */}
        <div className="p-4 relative z-10 bg-white rounded-b-xl">
          {/* Author Info */}
          <div className="flex items-center mb-3">
            <img
              src={authorAvatarUrl || '/api/placeholder/32/32'}
              alt={`${authorName}'s avatar`}
              className="w-8 h-8 rounded-full mr-3 object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm leading-tight">
                {title}
              </h3>
              <p className="text-xs text-gray-600">by {authorName}</p>
            </div>
          </div>

          {/* Funding Stats */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-lg font-bold text-primary">
                {formatCurrency(pledged)}
              </span>
              <span className="text-xs text-gray-500">
                / {formatCurrency(goal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{backerCount} người ủng hộ</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Còn {daysLeft} ngày</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-0 right-0 top-full bg-white rounded-b-xl shadow-xl border border-gray-200 border-t-0 opacity-0 invisible translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 z-30">
          <div className="p-4 pt-3 space-y-3">
            {/* Description */}
            {description && (
              <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                {description}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {category}
                </span>
              )}
              {location && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  <MapPin className="w-3 h-3 mr-1" />
                  {location}
                </span>
              )}
            </div>

            {/* Progress Detail */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Tiến độ</span>
                <span className="font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
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
