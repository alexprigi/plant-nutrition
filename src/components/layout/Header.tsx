'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      const scrollingDown = currentScrollY > lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (currentScrollY < 80) {
        setIsVisible(true);
      } else if (scrollingDown) {
        setIsVisible(false);
        setIsMenuOpen(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Chi Sono', href: '/chi-sono' },
    { name: 'Servizi', href: '/servizi' },
    { name: 'Ricette', href: '/ricette' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contatti', href: '/contatti' },
  ];

  return (
    <header className={`shadow-sm fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`} style={{ background: 'var(--bg-hero)' }}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌱</span>
              <div className="flex flex-col">
                <span className="text-xl font-bold" style={{ color: 'var(--brand-title)' }}>Pura Essenza</span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-dark-green)' }}>Vegetale</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-semibold text-base lg:text-lg xl:text-lg tracking-wide transition-all duration-200 menu-lift hover:text-[var(--color-main)] active:scale-95 active:opacity-80"
                style={{ color: 'var(--brand-title)', letterSpacing: '0.02em' }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Link
              href="/prenota"
              className="px-5 py-2 lg:px-6 lg:py-2 rounded-full font-medium text-base lg:text-base transition-all duration-200 btn-lift whitespace-nowrap hover:bg-[var(--text-dark-green)] active:scale-95"
              style={{ background: 'var(--brand-title)', color: 'white' }}
            >
              <span className="hidden lg:inline">Prenota Consulenza</span>
              <span className="lg:hidden">Prenota</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className=""
              style={{ color: 'var(--brand-title)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-main)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--brand-title)')}
            >
              <span className="sr-only">Apri menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="font-semibold text-lg py-2 tracking-wide menu-lift transition-all duration-150 active:scale-95 active:opacity-70"
                  style={{ color: 'var(--brand-title)', letterSpacing: '0.02em' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/prenota"
                className="px-6 py-2 rounded-full font-medium transition-all duration-150 text-center mt-4 btn-lift active:scale-95"
                style={{ background: 'var(--button-bg)', color: 'var(--foreground)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Prenota Consulenza
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;