'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, type MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';

const VISIBLE_LOCALES = ['it', 'de'] as const;

const LocaleFlag: Record<string, string> = {
  it: '🇮🇹',
  de: '🇩🇪',
};

const Header = () => {
  const t = useTranslations('navigazione');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isBtnPressed, setIsBtnPressed] = useState(false);
  const lastScrollY = useRef(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
        setIsBtnPressed(false);
        menuButtonRef.current?.blur();
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: t('home'), href: '/' as const },
    { name: t('chi-sono'), href: '/about' as const },
    { name: t('servizi'), href: '/services' as const },
    { name: t('contatti'), href: '/contact' as const },
  ];

  const handleHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setIsMenuOpen(false);
    const localizedHome = `/${locale}`;
    if (pathname !== localizedHome && pathname !== '/') return;
    event.preventDefault();
    setIsVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchLocale = (newLocale: string) => {
    // Rimuove il prefisso locale corrente dal pathname
    const pathWithoutLocale = pathname.replace(/^\/(it|de|en)/, '') || '/';
    router.push(pathWithoutLocale, { locale: newLocale });
    setIsMenuOpen(false);
  };

  return (
    <header className={`shadow-sm fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`} style={{ background: 'var(--bg-hero)' }}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" onClick={handleHomeClick} className="flex items-center gap-1">
              <Image src="/images/logo_icon.png" alt="" width={588} height={670} className="h-14 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} priority />
              <Image src="/images/logo_text.png" alt="Viva Plant Nutrition" width={591} height={315} className="h-12 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} priority />
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
                onClick={item.href === '/' ? handleHomeClick : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right: CTA + Selettore Lingua */}
          <div className="hidden md:flex items-center gap-3">
            {/* Selettore lingua */}
            <div className="flex items-center gap-1">
              {VISIBLE_LOCALES.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={`text-xl px-1 py-0.5 rounded transition-all duration-150 ${locale === loc ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-70'}`}
                  title={loc.toUpperCase()}
                >
                  {LocaleFlag[loc]}
                </button>
              ))}
            </div>

            <Link
              href="/booking"
              className="px-5 py-2 lg:px-6 lg:py-2 rounded-full font-medium text-base lg:text-base transition-all duration-200 btn-lift whitespace-nowrap hover:bg-[var(--text-dark-green)] active:scale-95"
              style={{ background: 'var(--brand-title)', color: 'white' }}
            >
              <span className="hidden lg:inline">{t('prenota')}</span>
              <span className="lg:hidden">{t('prenota-breve')}</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              ref={menuButtonRef}
              onClick={() => { setIsMenuOpen(!isMenuOpen); setIsBtnPressed(false); }}
              onPointerDown={() => setIsBtnPressed(true)}
              onPointerUp={() => setIsBtnPressed(false)}
              onPointerLeave={() => setIsBtnPressed(false)}
              className="p-1 rounded-md focus:outline-none"
              style={{ color: isBtnPressed ? 'var(--color-main)' : 'var(--brand-title)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-main)')}
              onMouseLeave={e => (e.currentTarget.style.color = isBtnPressed ? 'var(--color-main)' : 'var(--brand-title)')}
            >
              <span className="sr-only">{t('apri-menu')}</span>
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
                  onClick={item.href === '/' ? handleHomeClick : () => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/booking"
                className="px-6 py-2 rounded-full font-medium transition-all duration-150 text-center mt-4 btn-lift active:scale-95"
                style={{ background: 'var(--button-bg)', color: 'var(--foreground)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('prenota')}
              </Link>

              {/* Selettore lingua mobile */}
              <div className="flex items-center gap-3 mt-2 pt-2 border-t" style={{ borderColor: 'var(--color-main-light)' }}>
                {VISIBLE_LOCALES.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => switchLocale(loc)}
                    className={`text-sm px-3 py-1.5 rounded-lg font-semibold transition-all ${locale === loc ? 'ring-2 ring-[var(--brand-title)]' : 'opacity-50'}`}
                    style={{ color: 'var(--brand-title)', background: 'var(--bg-section-light)' }}
                  >
                    {LocaleFlag[loc]} {loc.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
