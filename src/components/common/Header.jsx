import React, { useState } from 'react';
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
} from 'lucide-react';
import Button from './Button';

const Header = ({ variant = 'light' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    light: {
      container: 'bg-[#fff] text-text-primary',
      title: 'text-text-primary',
      navLink: 'text-text-primary hover:text-primary',
      dropdown: 'bg-white border border-gray-200 text-text-primary',
      dropdownItem: 'hover:bg-gray-50 text-text-primary hover:text-primary',
    },
    primary: {
      container: 'bg-primary text-text-white',
      title: 'text-text-white',
      navLink: 'text-text-white hover:text-secondary',
      dropdown: 'bg-primary border border-secondary text-text-white',
      dropdownItem:
        'hover:bg-secondary/10 text-text-white hover:text-secondary',
    },
  };

  const currentVariant = headerVariants[variant];

  return (
    <header className={`${currentVariant.container} py-4 px-6 shadow-lg`}>
      <div className="mx-auto grid grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex items-center gap-4">
          <h1 className={`text-2xl font-bold ${currentVariant.title}`}>
            FundFountain
          </h1>

          {/* Dropdown menu danh mục */}
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-opacity-10 hover:bg-primary-100 transition-colors`}
            >
              <span className="font-medium">Khám phá</span>
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

        <nav>
          <ul className="flex space-x-6">
            <li>
              <a
                href="#"
                className={`${currentVariant.navLink} transition-colors font-medium`}
              >
                Trang chủ
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`${currentVariant.navLink} transition-colors font-medium`}
              >
                Về chúng tôi
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`${currentVariant.navLink} transition-colors font-medium`}
              >
                Liên hệ
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-4 justify-self-end">
          {/* Theme Toggle Placeholder */}
          <button
            className={`p-2 rounded-lg ${currentVariant.navLink} hover:bg-opacity-10 hover:bg-primary-100 transition-colors`}
            title="Chuyển đổi chế độ sáng/tối"
          >
            <Sun className="w-5 h-5" />
          </button>

          {/* Language Toggle Placeholder */}
          <button
            className={`p-2 rounded-lg ${currentVariant.navLink} hover:bg-opacity-10 hover:bg-primary-100 transition-colors`}
            title="Chuyển đổi ngôn ngữ"
          >
            <Globe className="w-5 h-5" />
          </button>

          <Button>Bắt đầu gây quỹ</Button>
          <Button variant="white" className="border-none">
            Đăng nhập
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
