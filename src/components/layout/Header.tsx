'use client';

import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Chi Sono', href: '/chi-sono' },
    { name: 'Servizi', href: '/servizi' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contatti', href: '/contatti' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌱</span>
              <div className="flex flex-col">
                <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>Pura Essenza</span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-main-dark)' }}>Vegetale</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-semibold text-lg tracking-wide transition-colors duration-200 menu-lift"
                style={{ color: 'var(--accent)', letterSpacing: '0.02em' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-main-dark)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--accent)')}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Link
              href="/prenota"
              className="px-6 py-2 rounded-full font-medium transition-colors duration-200 btn-lift"
              style={{ background: 'var(--button-bg)', color: 'var(--foreground)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--button-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--button-bg)')}
            >
              Prenota Consulenza
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className=""
              style={{ color: 'var(--foreground)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--foreground)')}
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
                  className="font-semibold text-lg py-2 tracking-wide menu-lift"
                  style={{ color: 'var(--accent)', letterSpacing: '0.02em' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-main-dark)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/prenota"
                className="px-6 py-2 rounded-full font-medium transition-colors duration-200 text-center mt-4 btn-lift"
                style={{ background: 'var(--button-bg)', color: 'var(--foreground)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--button-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--button-bg)')}
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