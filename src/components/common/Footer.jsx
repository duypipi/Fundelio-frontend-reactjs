import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#facebook' },
    { name: 'Instagram', icon: Instagram, href: '#instagram' },
    { name: 'LinkedIn', icon: Linkedin, href: '#linkedin' },
    { name: 'Twitter', icon: Twitter, href: '#twitter' },
  ];

  // Dữ liệu cho các section
  const footerSections = [
    {
      title: 'Giới thiệu',
      links: [
        { name: 'Về chúng tôi', href: '#about' },
        { name: 'Tuyển dụng', href: '#careers' },
        { name: 'Báo chí', href: '#press' },
      ],
    },
    {
      title: 'Hỗ trợ',
      links: [
        { name: 'Câu hỏi thường gặp', href: '#faq' },
        { name: 'Liên hệ', href: '#contact' },
        { name: 'Điều khoản sử dụng', href: '#terms' },
        { name: 'Chính sách bảo mật', href: '#privacy' },
      ],
    },
    {
      title: 'Cộng đồng',
      links: [
        { name: 'Blog', href: '#blog' },
        { name: 'Diễn đàn', href: '#forum' },
        { name: 'Sự kiện', href: '#events' },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-800 py-12">
      <div className="container mx-auto px-6 max-w-container">
        {/* Main Grid - 4 sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Section 1 - Logo & Social */}
          <div className="col-span-1">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Fundelio
            </h2>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              Nền tảng gây quỹ cộng đồng cho các dự án sáng tạo và khởi nghiệp.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="p-2 rounded-lg text-text-secondary hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                    title={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Sections 2, 3, 4 - Navigation Links */}
          {footerSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="col-span-1">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-text-secondary hover:text-green-600 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Separator Line */}
        <div className="border-t border-gray-300 pt-6">
          <div className="text-center">
            <p className="text-text-secondary text-sm">
              © 2025 Khởi nghiệp sáng tạo. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
