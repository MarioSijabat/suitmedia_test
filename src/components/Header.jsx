'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activePage, setActivePage] = useState('ideas');

  const menuItems = [
    { name: 'work', href: '/work' },
    { name: 'about', href: '/about' },
    { name: 'services', href: '/services' },
    { name: 'ideas', href: '/' },
    { name: 'careers', href: '/careers' },
    { name: 'contact', href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} bg-orange-500 backdrop-blur-md border-t border-gray-700`}
    >
      <div className="container mx-auto px-20 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/images/logo_suitmedia.png"
            alt="Suitmedia Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>
        <nav>
          <ul className="flex flex-wrap justify-center space-x-2 sm:space-x-6 text-white text-sm sm:text-base font-normal">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`relative px-2 py-1 block ${activePage === item.name ? 'border-b-4 border-white pb-0.5' : ''} hover:border-b-4 hover:border-white hover:pb-0.5`}
                  onClick={() => setActivePage(item.name)}
                >
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
