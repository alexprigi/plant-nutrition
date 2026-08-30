'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/icons/Icon';
import { COUNTRY_FLAGS } from '@/lib/constants';

interface Props {
  value: string;
  onChange: (value: string) => void;
  countries: string[];
  getLocalizedName: (italianName: string) => string;
  placeholder?: string;
  hasError?: boolean;
}

export default function CountrySelect({
  value, onChange, countries, getLocalizedName, placeholder = '', hasError = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const autofillNameRef = useRef<HTMLInputElement>(null);
  const autofillISORef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });

  const reverseMap = useMemo(() => {
    const map: Record<string, string> = {};
    const allLocales = ['it', 'de', 'en', 'fr', 'es'];
    const dns = allLocales.map(loc => { try { return new Intl.DisplayNames([loc], { type: 'region' }); } catch { return null; } });
    for (const c of countries) {
      map[c.toLowerCase()] = c;
      map[getLocalizedName(c).toLowerCase()] = c;
      const flag = COUNTRY_FLAGS[c] ?? '';
      const chars = [...flag];
      if (chars.length === 2) {
        try {
          const cp0 = chars[0].codePointAt(0), cp1 = chars[1].codePointAt(0);
          if (cp0 !== undefined && cp1 !== undefined) {
            const iso = String.fromCodePoint(cp0 - 0x1F1E6 + 65) + String.fromCodePoint(cp1 - 0x1F1E6 + 65);
            map[iso.toLowerCase()] = c;
            for (const dn of dns) { try { const n = dn?.of(iso); if (n) map[n.toLowerCase()] = c; } catch {} }
          }
        } catch {}
      }
    }
    return map;
  }, [countries, getLocalizedName]);

  useEffect(() => {
    const els = [autofillNameRef.current, autofillISORef.current];

    // Intercept .value setter immediately when NordPass writes (no events fired)
    const cleanups: (() => void)[] = [];
    for (const el of els) {
      if (!el) continue;
      const proto = Object.getPrototypeOf(el);
      const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
      if (!descriptor?.set || !descriptor?.get) continue;
      const origSet = descriptor.set;
      const origGet = descriptor.get;
      Object.defineProperty(el, 'value', {
        get() { return origGet.call(this); },
        set(val: string) {
          origSet.call(this, val);
          if (val) {
            const match = reverseMap[val.toLowerCase().trim()];
            if (match) onChangeRef.current(match);
            setTimeout(() => origSet.call(this, ''), 0);
          }
        },
        configurable: true,
      });
      cleanups.push(() => { try { Object.defineProperty(el, 'value', descriptor); } catch {} });
    }

    // Event listeners — some managers dispatch input/change events
    const handleEvent = (e: Event) => {
      const el = e.target as HTMLInputElement;
      if (el.value) {
        const match = reverseMap[el.value.toLowerCase().trim()];
        if (match) onChangeRef.current(match);
        el.value = '';
      }
    };
    for (const el of els) {
      el?.addEventListener('input', handleEvent);
      el?.addEventListener('change', handleEvent);
    }

    // Polling as fallback (NordPass sometimes writes before intercept is set)
    const interval = setInterval(() => {
      for (const el of els) {
        if (el?.value) {
          const match = reverseMap[el.value.toLowerCase().trim()];
          if (match) onChangeRef.current(match);
          el.value = '';
        }
      }
    }, 50);

    return () => {
      clearInterval(interval);
      cleanups.forEach(fn => fn());
      for (const el of els) {
        el?.removeEventListener('input', handleEvent);
        el?.removeEventListener('change', handleEvent);
      }
    };
  }, [reverseMap]);

  const filtered = query.trim()
    ? countries.filter(c => getLocalizedName(c).toLowerCase().startsWith(query.toLowerCase()))
    : countries;

  const selectedFlag = value ? COUNTRY_FLAGS[value] ?? '' : '';
  const selectedName = value ? getLocalizedName(value) : '';

  const select = useCallback((country: string) => {
    onChange(country);
    setOpen(false);
    setQuery('');
    setHighlighted(0);
  }, [onChange]);

  const openDropdown = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownH = 216;
    const spaceBelow = window.innerHeight - rect.bottom;
    const above = spaceBelow < dropdownH + 8;
    setDropdownStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
      ...(above
        ? { bottom: window.innerHeight - rect.top, top: 'auto' }
        : { top: rect.bottom + 4, bottom: 'auto' }),
    });
    setOpen(true);
    const idx = countries.findIndex(c => c === value);
    setHighlighted(idx >= 0 ? idx : 0);
    triggerRef.current.focus();
  };

  useEffect(() => { setHighlighted(0); }, [query]);

  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const el = list?.children[highlighted] as HTMLElement | undefined;
    if (!list || !el) return;
    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    if (elTop < list.scrollTop) list.scrollTop = elTop;
    else if (elBottom > list.scrollTop + list.clientHeight) list.scrollTop = elBottom - list.clientHeight;
  }, [highlighted, open]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (triggerRef.current?.contains(e.target as Node)) return;
      if (listRef.current?.parentElement?.contains(e.target as Node)) return;
      setOpen(false);
      setQuery('');
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleScroll = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const above = spaceBelow < 216 + 8;
      setDropdownStyle(prev => ({
        ...prev,
        left: rect.left,
        width: rect.width,
        ...(above
          ? { bottom: window.innerHeight - rect.top, top: 'auto' }
          : { top: rect.bottom + 4, bottom: 'auto' }),
      }));
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        openDropdown();
      }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); setQuery(''); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[highlighted]) select(filtered[highlighted]); }
    else if (e.key === 'Backspace') { e.preventDefault(); setQuery(q => q.slice(0, -1)); }
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { e.preventDefault(); setQuery(q => q + e.key); }
  };

  const hiddenStyle: React.CSSProperties = {
    position: 'absolute', inset: 0, opacity: 0.01,
    zIndex: 0, border: 'none', background: 'transparent',
    fontSize: 16, color: 'transparent',
  };

  return (
    <>
      <div style={{ position: 'relative' }}>
        <input ref={autofillNameRef} type="text" name="country-name" autoComplete="country-name" tabIndex={-1} style={hiddenStyle} />
        <input ref={autofillISORef}  type="text" name="country"      autoComplete="country"      tabIndex={-1} style={{ ...hiddenStyle, top: '50%' }} />
      <div
        ref={triggerRef}
        style={{ position: 'relative', zIndex: 1 }}
        tabIndex={0}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => open ? null : openDropdown()}
        onKeyDown={handleKeyDown}
        className={`w-full h-[50px] px-3 bg-white border rounded-xl flex items-center gap-2 cursor-pointer select-none outline-none
          ${hasError ? 'border-red-500' : open ? 'border-[var(--brand-title)]' : 'border-gray-300 focus:border-[var(--brand-title)]'}`}
      >
        {!query && selectedFlag && <span className="text-base shrink-0">{selectedFlag}</span>}
        <span className={`flex-1 min-w-0 truncate text-sm ${query || selectedName ? 'text-gray-900' : 'text-gray-400'}`}>
          {query || selectedName || placeholder}
        </span>
        {query && (
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); setQuery(''); }}
            className="text-gray-400 hover:text-gray-600 shrink-0"
          >
            <Icon name="x" size={14} />
          </button>
        )}
        <Icon
          name="chevronRight"
          size={14}
          className="text-gray-500 shrink-0"
          style={{ transform: open ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.15s' }}
        />
      </div>

      </div>{/* end relative wrapper */}

      {open && typeof document !== 'undefined' && createPortal(
        <div style={dropdownStyle} className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <ul ref={listRef} role="listbox" className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-400 text-center">—</li>
            )}
            {filtered.map((c, i) => (
              <li
                key={c}
                role="option"
                aria-selected={c === value}
                onMouseDown={() => select(c)}
                onMouseEnter={() => setHighlighted(i)}
                className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-2
                  ${i === highlighted ? 'bg-[var(--brand-title)]/10 text-[var(--brand-title)]' : 'text-gray-800 hover:bg-gray-50'}`}
              >
                {COUNTRY_FLAGS[c] && <span>{COUNTRY_FLAGS[c]}</span>}
                <span>{getLocalizedName(c)}</span>
              </li>
            ))}
          </ul>
        </div>,
        document.body
      )}
    </>
  );
}
