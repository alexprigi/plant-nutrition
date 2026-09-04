'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/icons/Icon';
import { COUNTRY_PREFIXES } from '@/lib/constants';

interface Props {
  value: string; // country name (unique key)
  onChange: (name: string) => void;
  hasError?: boolean;
}

export default function PhonePrefixSelect({ value, onChange, hasError = false }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const queryResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected = COUNTRY_PREFIXES.find(c => c.name === value) ?? COUNTRY_PREFIXES[0];


  const select = useCallback((name: string) => {
    onChange(name);
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
      width: Math.max(rect.width, 220),
      zIndex: 9999,
      ...(above
        ? { bottom: window.innerHeight - rect.top, top: 'auto' }
        : { top: rect.bottom + 4, bottom: 'auto' }),
    });
    setOpen(true);
    const idx = COUNTRY_PREFIXES.findIndex(c => c.name === value);
    setHighlighted(idx >= 0 ? idx : 0);
    triggerRef.current.focus();
  };

  useEffect(() => {
    if (!query.trim()) return;
    const q = query.replace('+', '');
    const idx = COUNTRY_PREFIXES.findIndex(c =>
      c.code.replace('+', '').startsWith(q) ||
      c.name.toLowerCase().startsWith(query.toLowerCase())
    );
    if (idx >= 0) setHighlighted(idx);
  }, [query]);

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
      if (queryResetRef.current) clearTimeout(queryResetRef.current);
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
        width: Math.max(rect.width, 220),
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
    const scheduleReset = () => {
      if (queryResetRef.current) clearTimeout(queryResetRef.current);
      queryResetRef.current = setTimeout(() => setQuery(''), 1000);
    };
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); setQuery(''); if (queryResetRef.current) clearTimeout(queryResetRef.current); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, COUNTRY_PREFIXES.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (COUNTRY_PREFIXES[highlighted]) select(COUNTRY_PREFIXES[highlighted].name); }
    else if (e.key === 'Backspace') { e.preventDefault(); setQuery(q => q.slice(0, -1)); scheduleReset(); }
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { e.preventDefault(); setQuery(q => q + e.key); scheduleReset(); }
  };

  return (
    <>
      <div
        ref={triggerRef}
        tabIndex={0}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => open ? null : openDropdown()}
        onKeyDown={handleKeyDown}
        className={`h-[50px] px-3 pr-2 bg-white border rounded-xl flex items-center gap-1.5 cursor-pointer select-none outline-none shrink-0 min-w-[5.5rem]
          ${hasError ? 'border-red-500' : open ? 'border-[var(--brand-title)]' : 'border-gray-300 focus:border-[var(--brand-title)]'}`}
      >
        <span className="text-base shrink-0">{selected.flag}</span>
        <span className="text-sm text-gray-900">{selected.code}</span>
        <Icon
          name="chevronRight"
          size={14}
          className="text-gray-500 shrink-0"
          style={{ transform: open ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.15s' }}
        />
      </div>

      {open && typeof document !== 'undefined' && createPortal(
        <div style={dropdownStyle} className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <ul ref={listRef} role="listbox" className="max-h-52 overflow-y-auto py-1">
            {COUNTRY_PREFIXES.map((c, i) => (
              <li
                key={c.name}
                role="option"
                aria-selected={c.name === value}
                onMouseDown={() => select(c.name)}
                onMouseEnter={() => setHighlighted(i)}
                className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-2
                  ${i === highlighted ? 'bg-[var(--brand-title)]/10 text-[var(--brand-title)]' : 'text-gray-1000 hover:bg-gray-50'}`}
              >
                <span className="shrink-0">{c.flag}</span>
                <span className="font-mono font-medium shrink-0">{c.code}</span>
                <span className="text-gray-500 truncate">{c.name}</span>
              </li>
            ))}
          </ul>
        </div>,
        document.body
      )}
    </>
  );
}
