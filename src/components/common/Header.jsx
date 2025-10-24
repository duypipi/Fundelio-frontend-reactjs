import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Monitor,
  Music,
  Film,
  Shirt,
  Gamepad2,
  Palette,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  Search,
  User,
  Settings,
  MessageSquare,
  Activity,
  LogOut,
  Plus,
  Bookmark,
  Star,
} from 'lucide-react';
import Button from './Button';
import { useTheme } from '../../contexts/ThemeContext';

export const Header = ({ variant = 'transparent' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();

  // Mock user state - Default is logged in
  const [isLoggedIn] = useState(true);
  const [user] = useState({
    name: 'Nguyen Van A',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  });

  // Mock search results
  const [searchResults, setSearchResults] = useState({
    categories: [],
    creators: [],
    campaigns: [],
  });

  // Theo dõi scroll để thay đổi background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
      if (!event.target.closest('.search-container')) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.length >= 3) {
      // Mock search - replace with actual API call
      setSearchResults({
        categories: [
          { id: 1, name: 'Công nghệ', icon: Monitor },
          { id: 2, name: 'Âm nhạc', icon: Music },
        ],
        creators: [
          { id: 1, name: 'Nguyễn Văn A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator1' },
          { id: 2, name: 'Trần Thị B', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator2' },
        ],
        campaigns: [
          { id: 1, name: 'Dự án A', category: 'Công nghệ', raised: 50000 },
          { id: 2, name: 'Dự án B', category: 'Âm nhạc', raised: 30000 },
        ],
      });
    } else {
      setSearchResults({ categories: [], creators: [], campaigns: [] });
    }
  }, [searchQuery]);

  // Định nghĩa các danh mục
  const categories = [
    { name: 'Công nghệ', icon: Monitor, href: '#technology' },
    { name: 'Âm nhạc', icon: Music, href: '#music' },
    { name: 'Phim', icon: Film, href: '#film' },
    { name: 'Thời trang', icon: Shirt, href: '#fashion' },
    { name: 'Game', icon: Gamepad2, href: '#game' },
    { name: 'Nghệ thuật', icon: Palette, href: '#art' },
  ];

  // Định nghĩa các variant cho header
  const headerVariants = {
    transparent: {
      container: isScrolled
        ? 'bg-white/95 dark:bg-darker backdrop-blur-md text-text-primary dark:text-text-white shadow-md transition-colors duration-300'
        : 'bg-transparent text-text-white',
      title: isScrolled
        ? 'text-text-primary dark:text-text-white transition-colors duration-300'
        : 'text-text-white',
      navLink: isScrolled
        ? 'text-text-primary dark:text-text-white hover:text-primary dark:hover:text-primary-400 transition-colors duration-300'
        : 'text-text-white hover:text-secondary',
      dropdown:
        'bg-white dark:bg-black border border-gray-200 dark:border-gray-700 text-text-primary dark:text-text-white transition-colors duration-300',
      dropdownItem:
        'hover:bg-gray-50 dark:hover:bg-gray-900 text-text-primary dark:text-text-white hover:text-primary dark:hover:text-primary-400 transition-colors duration-300',
      button: isScrolled
        ? 'text-text-primary dark:text-text-white transition-colors duration-300'
        : 'text-text-white',
    },
    light: {
      container:
        'bg-white dark:bg-darker text-text-primary dark:text-text-white shadow-md transition-colors duration-300',
      title:
        'text-text-primary dark:text-text-white transition-colors duration-300',
      navLink:
        'text-text-primary dark:text-text-white hover:text-primary dark:hover:text-primary-400 transition-colors duration-300',
      dropdown:
        'bg-white dark:bg-black border border-gray-200 dark:border-gray-700 text-text-primary dark:text-text-white transition-colors duration-300',
      dropdownItem:
        'hover:bg-gray-50 dark:hover:bg-gray-700 text-text-primary dark:text-text-white hover:text-primary dark:hover:text-primary-400 transition-colors duration-300',
      button:
        'text-text-primary dark:text-text-white transition-colors duration-300',
    },
    primary: {
      container:
        'bg-primary dark:bg-primary-700 text-text-white shadow-md transition-colors duration-300',
      title: 'text-text-white',
      navLink:
        'text-text-white hover:text-secondary dark:hover:text-secondary-400 transition-colors duration-300',
      dropdown:
        'bg-primary dark:bg-primary-700 border border-secondary dark:border-secondary-600 text-text-white transition-colors duration-300',
      dropdownItem:
        'hover:bg-secondary/10 dark:hover:bg-secondary/20 text-text-white hover:text-secondary dark:hover:text-secondary-400 transition-colors duration-300',
      button: 'text-text-white',
    },
  };

  const currentVariant = headerVariants[variant];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-3 px-4 sm:py-4 sm:px-6 transition-all duration-300 ${currentVariant.container}`}
    >
      <div className="mx-auto max-w-[1400px] flex items-center justify-between gap-4">
        {/* Left - Logo & Explore */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/home">
            <h1
              className={`text-xl sm:text-2xl font-bold ${currentVariant.title} cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap`}
            >
              Fundelio
            </h1>
          </Link>

          {/* Dropdown menu danh mục - Desktop only */}
          <div
            className="relative hidden lg:block"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 transition-colors`}
            >
              <span className="font-medium text-sm">Khám phá</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <>
                {/* Bridge vô hình để không bị tắt menu khi di chuột */}
                <div className="absolute top-full left-0 w-48 h-4 bg-transparent"></div>

                <div
                  className={`absolute top-full left-0 mt-4 w-48 rounded-lg shadow-lg z-50 ${currentVariant.dropdown}`}
                >
                  {categories.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <a
                        key={index}
                        href={category.href}
                        className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                          currentVariant.dropdownItem
                        } ${index === 0 ? 'rounded-t-lg' : ''} ${
                          index === categories.length - 1 ? 'rounded-b-lg' : ''
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center - Search Bar (Desktop) */}
        <div className="hidden md:block flex-1 max-w-xl search-container">
          <div className="relative">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentVariant.navLink}`} />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục, nhà sáng tạo, chiến dịch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isScrolled || variant !== 'transparent'
                    ? 'bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-text-primary dark:text-text-white'
                    : 'bg-white/20 border-white/30 text-white placeholder-white/70'
                } focus:outline-none focus:ring-2 focus:ring-primary transition-colors`}
              />
            </div>

            {/* Search Results Dropdown */}
            {isSearchFocused && searchQuery.length >= 3 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                {/* Categories */}
                {searchResults.categories.length > 0 && (
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Danh mục
                    </p>
                    {searchResults.categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <a
                          key={category.id}
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                        >
                          <IconComponent className="w-5 h-5 text-primary" />
                          <span className="text-sm text-text-primary dark:text-text-white">{category.name}</span>
                        </a>
                      );
                    })}
                  </div>
                )}

                {/* Creators */}
                {searchResults.creators.length > 0 && (
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Nhà sáng tạo
                    </p>
                    {searchResults.creators.map((creator) => (
                      <a
                        key={creator.id}
                        href="#"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                      >
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm text-text-primary dark:text-text-white">{creator.name}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Campaigns */}
                {searchResults.campaigns.length > 0 && (
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Chiến dịch
                    </p>
                    {searchResults.campaigns.map((campaign) => (
                      <a
                        key={campaign.id}
                        href="#"
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-text-primary dark:text-text-white">{campaign.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{campaign.category}</p>
                        </div>
                        <span className="text-xs font-semibold text-primary">
                          ${campaign.raised.toLocaleString()}
                        </span>
                      </a>
                    ))}
                  </div>
                )}

                {/* No results */}
                {searchResults.categories.length === 0 &&
                  searchResults.creators.length === 0 &&
                  searchResults.campaigns.length === 0 && (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <p>Không tìm thấy kết quả</p>
                    </div>
                  )}
              </div>
            )}

            {searchQuery.length > 0 && searchQuery.length < 3 && isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Nhập ít nhất 3 ký tự để tìm kiếm
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle - Desktop only */}
          <button
            onClick={toggleTheme}
            className={`hidden md:block p-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 transition-all duration-200 hover:scale-105`}
            title={
              isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'
            }
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Language Toggle - Desktop only */}
          <button
            className={`hidden md:block p-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 transition-colors`}
            title="Chuyển đổi ngôn ngữ"
          >
            <Globe className="w-5 h-5" />
          </button>

          {/* User Menu or Auth Buttons */}
          {isLoggedIn ? (
            <div className="relative user-menu-container">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/20"
                />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-[600px] max-w-[calc(100vw-2rem)] bg-white dark:bg-black rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <div className="flex flex-col md:flex-row">
                    {/* Left Column - Your Account + Bottom Section */}
                    <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                      <h4 className="text-xs font-bold text-text-primary dark:text-text-white mb-3 uppercase">
                        Tài khoản
                      </h4>
                      <div className="space-y-1 mb-4">
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <Bookmark className="w-4 h-4" />
                          <span>Dự án đã lưu</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <Star className="w-4 h-4" />
                          <span>Đề xuất cho bạn</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Đang theo dõi</span>
                        </a>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

                      {/* Bottom Section */}
                      <div className="space-y-1">
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Hồ sơ</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Cài đặt</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Tin nhắn</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <Activity className="w-4 h-4" />
                          <span>Hoạt động</span>
                        </a>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
                        <button
                          onClick={() => {
                            // Handle logout
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Column - Created Campaigns */}
                    <div className="flex-1 p-4">
                      <h4 className="text-xs font-bold text-text-primary dark:text-text-white mb-3 uppercase">
                        Chiến dịch đã tạo
                      </h4>
                      <div className="space-y-2">
                        {/* Campaign 1 */}
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <div className="w-12 h-12 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop"
                              alt="Project"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-text-primary dark:text-text-white line-clamp-2 flex-1">A Spaces project</span>
                        </a>

                        {/* Campaign 2 */}
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <div className="w-12 h-12 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=100&h=100&fit=crop"
                              alt="Project"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-text-primary dark:text-text-white line-clamp-2 flex-1">A Product Design project</span>
                        </a>

                        {/* Campaign 3 */}
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <div className="w-12 h-12 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop"
                              alt="Project"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-text-primary dark:text-text-white line-clamp-2 flex-1">Tech Innovation Hub</span>
                        </a>

                        {/* View All Button - Show when more than 3 campaigns */}
                        {/* Uncomment when you have more than 3 campaigns */}
                        {/* <button
                          className="w-full px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors text-center font-medium"
                        >
                          Xem tất cả
                        </button> */}

                        {/* Divider */}
                        <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

                        {/* Create New Campaign Button */}
                        <Link
                          to="/campaigns/create"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded flex items-center justify-center border-2 border-dashed border-primary">
                            <Plus className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-medium">Tạo chiến dịch mới</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button size="md" className="hidden sm:inline-flex">
                Đăng ký
              </Button>
              <Button
                variant="outline"
                size="md"
                className="hidden sm:inline-flex border-current"
              >
                Đăng nhập
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-lg ${currentVariant.button}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 py-4 border-t border-white/20 dark:border-gray-700 transition-colors duration-300">
          <nav className="space-y-2">
            <Link
              to="/home"
              className={`block px-4 py-2 rounded-lg ${
                currentVariant.navLink
              } hover:bg-white/10 dark:hover:bg-black/40 transition-colors font-medium ${
                location.pathname === '/home'
                  ? 'text-primary dark:text-primary-400'
                  : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/campaigns/create"
              className={`block px-4 py-2 rounded-lg ${
                currentVariant.navLink
              } hover:bg-white/10 dark:hover:bg-black/40 transition-colors font-medium ${
                location.pathname === '/campaigns/create'
                  ? 'text-primary dark:text-primary-400'
                  : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tạo chiến dịch
            </Link>
            <a
              href="#about"
              className={`block px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 dark:hover:bg-black/40 transition-colors font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Về chúng tôi
            </a>
            <a
              href="#contact"
              className={`block px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 dark:hover:bg-black/40 transition-colors font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Liên hệ
            </a>

            {/* Categories in mobile */}
            <div className="pt-2 border-t border-white/20 dark:border-gray-700 mt-2 transition-colors duration-300">
              <p
                className={`px-4 py-2 text-sm font-semibold ${currentVariant.title}`}
              >
                Khám phá
              </p>
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <a
                    key={index}
                    href={category.href}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 dark:hover:bg-black/40 transition-colors`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Mobile Theme Toggle */}
            <div className="px-4 py-2 border-t border-white/20 dark:border-gray-700 mt-2 transition-colors duration-300">
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-3 w-full px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 dark:hover:bg-black/40 transition-colors`}
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span className="text-sm">Chế độ sáng</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span className="text-sm">Chế độ tối</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex gap-2 px-4 pt-4 sm:hidden">
              <Button size="sm" className="flex-1">
                Đăng ký
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-current dark:border-gray-600"
              >
                Đăng nhập
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
