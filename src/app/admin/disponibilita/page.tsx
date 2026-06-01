'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Icon from '@/components/icons/Icon';
import Button from '@/components/ui/Button';

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
];

type Block = {
  id: string;
  date: string;
  type: 'BLOCK' | 'OPEN';
  startTime: string | null;
  endTime: string | null;
  note: string;
};

const pad = (n: number) => String(n).padStart(2, '0');
const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const isWeekend = (d: string) => { const day = new Date(d).getDay(); return day === 0 || day === 6; };

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(weekStart: Date): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return toDateStr(d);
  });
}

function DisponibilitaPage() {
  const { status } = useSession();
  const router = useRouter();

  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selezione celle: Set di "date|time"
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');
  const lastPosRef = React.useRef<{ x: number; y: number } | null>(null);

  // Modal nota
  const [showModal, setShowModal] = useState(false);
  const [modalNote, setModalNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const today = toDateStr(new Date());

  const loadBlocks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/availability?from=${weekDays[0]}&to=${weekDays[6]}`);
      const data = await res.json();
      setBlocks(Array.isArray(data) ? data : []);
    } catch { setBlocks([]); }
    setIsLoading(false);
  }, [weekDays]);

  useEffect(() => { loadBlocks(); }, [loadBlocks]);

  // Determina se uno slot è bloccato da un blocco esistente
  const isBlocked = useCallback((date: string, time: string): boolean => {
    const weekend = isWeekend(date);
    const dayBlocks = blocks.filter(b => b.date === date);
    const openBlocks = dayBlocks.filter(b => b.type === 'OPEN');
    const blockBlocks = dayBlocks.filter(b => b.type === 'BLOCK');

    if (weekend) {
      // Weekend chiuso se nessun OPEN lo copre
      const coveredByOpen = openBlocks.some(b =>
        !b.startTime || !b.endTime || (time >= b.startTime && time < b.endTime)
      );
      if (!coveredByOpen) return true;
    }

    // Controlla blocchi espliciti
    return blockBlocks.some(b => {
      if (!b.startTime || !b.endTime) return true;
      return time >= b.startTime && time < b.endTime;
    });
  }, [blocks]);

  const isWeekendOpen = useCallback((date: string) =>
    blocks.some(b => b.date === date && b.type === 'OPEN'), [blocks]);

  const cellKey = (date: string, time: string) => `${date}|${time}`;

  const [dragIsWeekend, setDragIsWeekend] = useState(false);

  const handleMouseDown = (date: string, time: string) => {
    if (date < today) return;
    const key = cellKey(date, time);
    const newMode = selected.has(key) ? 'deselect' : 'select';
    const startingWeekend = isWeekend(date);
    setDragMode(newMode);
    setDragIsWeekend(startingWeekend);
    setIsDragging(true);
    lastPosRef.current = null;
    // Se tipo diverso dalla selezione esistente, azzera
    const existingIsWeekend = selected.size > 0 && Array.from(selected).every(k => isWeekend(k.split('|')[0]));
    const existingIsWorkday = selected.size > 0 && Array.from(selected).every(k => !isWeekend(k.split('|')[0]));
    if ((startingWeekend && existingIsWorkday) || (!startingWeekend && existingIsWeekend)) {
      setSelected(new Set([key]));
    } else {
      setSelected(prev => {
        const next = new Set(prev);
        newMode === 'select' ? next.add(key) : next.delete(key);
        return next;
      });
    }
  };

  const handleMouseEnter = (date: string, time: string) => {
    if (!isDragging || date < today) return;
    if (isWeekend(date) !== dragIsWeekend) return; // blocca mix
    const key = cellKey(date, time);
    setSelected(prev => {
      if (dragMode === 'select' && prev.has(key)) return prev;
      if (dragMode === 'deselect' && !prev.has(key)) return prev;
      const next = new Set(prev);
      dragMode === 'select' ? next.add(key) : next.delete(key);
      return next;
    });
  };

  // Gestisce drag con interpolazione tra posizione precedente e attuale
  const handleGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const curr = { x: e.clientX, y: e.clientY };
    const last = lastPosRef.current ?? curr;
    lastPosRef.current = curr;

    // Interpola punti tra last e curr per non saltare celle
    const dx = curr.x - last.x;
    const dy = curr.y - last.y;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const points = steps <= 1
      ? [curr]
      : Array.from({ length: steps + 1 }, (_, i) => ({
          x: last.x + (dx * i) / steps,
          y: last.y + (dy * i) / steps,
        }));

    const keysToUpdate = new Set<string>();
    for (const point of points) {
      const elements = document.elementsFromPoint(point.x, point.y) as HTMLElement[];
      for (const el of elements) {
        const cellDate = el?.dataset.date;
        const cellTime = el?.dataset.time;
        if (cellDate && cellTime && cellDate >= today && isWeekend(cellDate) === dragIsWeekend) {
          keysToUpdate.add(cellKey(cellDate, cellTime));
          break;
        }
      }
    }

    if (keysToUpdate.size === 0) return;
    setSelected(prev => {
      let changed = false;
      const next = new Set(prev);
      keysToUpdate.forEach(key => {
        if (dragMode === 'select' && !prev.has(key)) { next.add(key); changed = true; }
        if (dragMode === 'deselect' && prev.has(key)) { next.delete(key); changed = true; }
      });
      return changed ? next : prev;
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Seleziona/deseleziona giorno intero
  const toggleDay = (date: string) => {
    if (date < today) return;
    const allSlots = TIME_SLOTS.map(t => cellKey(date, t));
    const allSelected = allSlots.every(k => selected.has(k));
    setSelected(prev => {
      const next = new Set(prev);
      allSlots.forEach(k => allSelected ? next.delete(k) : next.add(k));
      return next;
    });
  };

  const saveBlocks = async () => {
    if (selected.size === 0) return;
    setIsSaving(true);

    // Raggruppa per data e calcola intervalli contigui
    const byDate = new Map<string, string[]>();
    selected.forEach(key => {
      const [date, time] = key.split('|');
      if (!byDate.has(date)) byDate.set(date, []);
      byDate.get(date)!.push(time);
    });

    const promises: Promise<any>[] = [];
    byDate.forEach((times, date) => {
      const weekend = isWeekend(date);
      const sortedTimes = [...times].sort();

      // Raggruppa in intervalli contigui
      const intervals: { start: string; end: string }[] = [];
      let start = sortedTimes[0];
      let prev = sortedTimes[0];

      for (let i = 1; i <= sortedTimes.length; i++) {
        const curr = sortedTimes[i];
        const prevIdx = TIME_SLOTS.indexOf(prev);
        const currIdx = curr ? TIME_SLOTS.indexOf(curr) : -1;

        if (currIdx !== prevIdx + 1) {
          // Fine intervallo
          const endIdx = Math.min(prevIdx + 1, TIME_SLOTS.length - 1);
          intervals.push({ start, end: TIME_SLOTS[endIdx] ?? '20:30' });
          if (curr) start = curr;
        }
        if (curr) prev = curr;
      }

      // Controlla se è giorno intero
      const isAllDay = sortedTimes.length === TIME_SLOTS.length;

      if (weekend) {
        // Per weekend: salva come OPEN per ogni intervallo contiguo
        const openIntervals = isAllDay ? [{ start: null, end: null }] : intervals;
        openIntervals.forEach(({ start, end }) => {
          promises.push(fetch('/api/admin/availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              date,
              type: 'OPEN',
              startTime: start ?? null,
              endTime: end ?? null,
              note: modalNote,
            }),
          }));
        });
      } else {
        // Per feriali: salva come BLOCK per ogni intervallo
        intervals.forEach(({ start, end }) => {
          promises.push(fetch('/api/admin/availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              date,
              type: 'BLOCK',
              startTime: isAllDay ? null : start,
              endTime: isAllDay ? null : end,
              note: modalNote,
            }),
          }));
        });
      }
    });

    await Promise.all(promises);
    setSelected(new Set());
    setShowModal(false);
    setModalNote('');
    await loadBlocks();
    setIsSaving(false);
  };

  const deleteBlock = async (id: string) => {
    await fetch(`/api/admin/availability?id=${id}`, { method: 'DELETE' });
    loadBlocks();
  };

  const unblockSelected = async () => {
    // Raggruppa slot selezionati per data
    const byDate = new Map<string, string[]>();
    selected.forEach(key => {
      const [date, time] = key.split('|');
      if (!byDate.has(date)) byDate.set(date, []);
      byDate.get(date)!.push(time);
    });

    const promises: Promise<any>[] = [];

    byDate.forEach((times, date) => {
      if (isWeekend(date)) {
        const allSlotsSelected = times.length === TIME_SLOTS.length;
        if (allSlotsSelected) {
          // Chiudi tutto il giorno: cancella il blocco OPEN
          blocks.filter(b => b.date === date && b.type === 'OPEN').forEach(b => {
            promises.push(fetch(`/api/admin/availability?id=${b.id}`, { method: 'DELETE' }));
          });
        } else {
          // Chiudi solo quegli slot: aggiungi BLOCK per ogni slot selezionato
          const sortedTimes = [...times].sort();
          // Raggruppa in intervalli contigui
          let start = sortedTimes[0];
          let prev = sortedTimes[0];
          for (let i = 1; i <= sortedTimes.length; i++) {
            const curr = sortedTimes[i];
            const prevIdx = TIME_SLOTS.indexOf(prev);
            const currIdx = curr ? TIME_SLOTS.indexOf(curr) : -1;
            if (currIdx !== prevIdx + 1) {
              const endIdx = Math.min(prevIdx + 1, TIME_SLOTS.length - 1);
              const endTime = TIME_SLOTS[endIdx] ?? '20:30';
              promises.push(fetch('/api/admin/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, type: 'BLOCK', startTime: start, endTime, note: '' }),
              }));
              if (curr) start = curr;
            }
            if (curr) prev = curr;
          }
        }
      } else {
        // Feriali: cancella i blocchi che coprono quegli slot
        const affectedIds = new Set<string>();
        times.forEach(time => {
          blocks.filter(b => b.date === date && b.type === 'BLOCK').forEach(b => {
            if (!b.startTime || !b.endTime) affectedIds.add(b.id);
            else if (time >= b.startTime && time < b.endTime) affectedIds.add(b.id);
          });
        });
        affectedIds.forEach(id => {
          promises.push(fetch(`/api/admin/availability?id=${id}`, { method: 'DELETE' }));
        });
      }
    });

    await Promise.all(promises);
    setSelected(new Set());
    await loadBlocks();
  };

  // Determina se la selezione è tutta weekend
  const selectionIsAllWeekend = useMemo(() =>
    selected.size > 0 && Array.from(selected).every(k => isWeekend(k.split('|')[0])),
    [selected]
  );

  // Se tutte le celle selezionate sono già bloccate DA ARIANNA (non weekend di default) → modalità sblocca
  const selectionIsAllBlocked = useMemo(() => {
    if (selected.size === 0) return false;
    if (selectionIsAllWeekend) return false; // i weekend hanno logica propria
    return Array.from(selected).every(k => {
      const [date, time] = k.split('|');
      const dayBlocks = blocks.filter(b => b.date === date && b.type === 'BLOCK');
      return dayBlocks.some(b => (!b.startTime || !b.endTime) || (time >= b.startTime! && time < b.endTime!));
    });
  }, [selected, selectionIsAllWeekend, blocks]);

  // Stato della selezione weekend — basato sugli slot individuali
  const weekendSelectionState = useMemo((): 'open' | 'close' | 'unblock' | null => {
    if (!selectionIsAllWeekend || selected.size === 0) return null;
    const slots = Array.from(selected).map(k => k.split('|') as [string, string]);
    // Conta slot per stato
    const openSlots = slots.filter(([date, time]) => !isBlocked(date, time)).length;
    const closedSlots = slots.filter(([date, time]) => isBlocked(date, time)).length;
    const blockedByBlock = slots.filter(([date, time]) => {
      if (!isWeekend(date)) return false;
      return blocks.filter(b => b.date === date && b.type === 'BLOCK').some(b =>
        !b.startTime || (time >= (b.startTime ?? '') && time < (b.endTime ?? ''))
      );
    }).length;

    if (blockedByBlock > 0) return 'unblock'; // slot bloccati dentro weekend aperto → riapri
    if (openSlots > 0 && closedSlots === 0) return 'close'; // tutti aperti → richiudi
    return 'open'; // tutti o in parte chiusi → apri
  }, [selectionIsAllWeekend, selected, isBlocked, isWeekend, blocks]);

  const selectionIsOpenWeekend = weekendSelectionState === 'close';

  const navLabel = `${new Date(weekDays[0]).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} — ${new Date(weekDays[6]).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-12 h-12 border-4 border-[var(--brand-title)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" onMouseUp={handleMouseUp}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium">
            <Icon name="chevronLeft" size={16} /> Dashboard
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Disponibilità</h1>
        </div>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <>
              <button onClick={() => setSelected(new Set())} className="text-sm text-gray-500 hover:text-gray-700">
                Deseleziona tutto
              </button>
              <Button
                onClick={() => {
                  if (selectionIsAllBlocked || weekendSelectionState === 'close' || weekendSelectionState === 'unblock') {
                    unblockSelected();
                  } else {
                    setShowModal(true);
                  }
                }}
                className={`text-white text-sm px-4 py-2 rounded-xl ${
                  selectionIsAllBlocked || weekendSelectionState === 'close' ? 'bg-gray-600' :
                  weekendSelectionState === 'unblock' ? 'bg-orange-500' :
                  weekendSelectionState === 'open' ? 'bg-green-600' :
                  'bg-red-500'
                }`}
              >
                {selectionIsAllBlocked ? `Sblocca ${selected.size} slot` :
                 weekendSelectionState === 'close' ? `Richiudi ${selected.size} slot` :
                 weekendSelectionState === 'unblock' ? `Apri ${selected.size} slot` :
                 weekendSelectionState === 'open' ? `Apri ${selected.size} slot` :
                 `Blocca ${selected.size} slot`}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Navigazione settimana */}
      <div className="bg-white border-b border-gray-100 px-6 py-2 flex items-center justify-between">
        <button onClick={() => { setWeekStart(d => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; }); setSelected(new Set()); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <Icon name="chevronLeft" size={18} className="text-gray-600" />
        </button>
        <span className="text-sm font-semibold text-gray-700">{navLabel}</span>
        <button onClick={() => { setWeekStart(d => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; }); setSelected(new Set()); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <Icon name="chevronRight" size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Griglia calendario */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[700px]">
          {/* Header giorni */}
          <div className="grid sticky top-0 z-10 bg-white border-b border-gray-200" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
            <div className="border-r border-gray-100" />
            {weekDays.map(date => {
              const weekend = isWeekend(date);
              const weekendOpen = isWeekendOpen(date);
              const isToday = date === today;
              const allSelected = TIME_SLOTS.every(t => selected.has(cellKey(date, t)));
              return (
                <div
                  key={date}
                  className={`py-2 px-1 text-center border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50' : ''}`}
                  onClick={() => toggleDay(date)}
                >
                  <p className={`text-xs font-bold uppercase ${weekend && !weekendOpen ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(date).toLocaleDateString('it-IT', { weekday: 'short' })}
                  </p>
                  <p className={`text-xl font-bold leading-tight ${isToday ? 'text-[var(--brand-title)]' : weekend && !weekendOpen ? 'text-gray-300' : allSelected ? 'text-red-600' : 'text-gray-800'}`}>
                    {new Date(date).getDate()}
                  </p>
                  {weekend && !weekendOpen && <p className="text-[10px] text-gray-400">chiuso</p>}
                  {weekend && weekendOpen && <p className="text-[10px] text-green-600 font-bold">aperto</p>}
                </div>
              );
            })}
          </div>

          {/* Corpo griglia */}
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Caricamento...</div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }} onMouseMove={handleGridMouseMove}>
              {TIME_SLOTS.map(time => (
                <React.Fragment key={time}>
                  {/* Label orario */}
                  <div className="border-r border-b border-gray-100 px-2 py-1 text-right">
                    <span className="text-[11px] text-gray-400 font-medium">{time}</span>
                  </div>

                  {/* Celle giorni */}
                  {weekDays.map(date => {
                    const key = cellKey(date, time);
                    const blocked = isBlocked(date, time);
                    const isSelected = selected.has(key);
                    const isPast = date < today;
                    const weekend = isWeekend(date);
                    const weekendOpen = isWeekendOpen(date);

                    // Per weekend: verde = aperto, grigio = chiuso, arancione = bloccato dentro weekend aperto
                    const isWeekendBlocked = weekend && weekendOpen && blocked;
                    let bgClass = 'bg-white';
                    if (isPast) bgClass = 'bg-gray-50/50';
                    else if (isSelected) bgClass = 'bg-blue-200 border-blue-300';
                    else if (weekend && !weekendOpen) bgClass = 'bg-gray-100';
                    else if (isWeekendBlocked) bgClass = 'bg-orange-300/80';
                    else if (weekend && weekendOpen) bgClass = 'bg-green-400/60';
                    else if (blocked) bgClass = 'bg-red-400/70';
                    else bgClass = 'bg-white hover:bg-gray-50';

                    return (
                      <div
                        key={key}
                        className={`border-r border-b border-gray-100 h-7 cursor-pointer select-none transition-colors ${bgClass} ${isPast ? 'cursor-default' : ''}`}
                        data-date={date}
                        data-time={time}
                        onMouseDown={() => handleMouseDown(date, time)}
                        onMouseEnter={() => handleMouseEnter(date, time)}
                      >
                        {blocked && !isSelected && !isPast && (
                          <div className={`w-full h-full flex items-center px-1 ${weekend && !weekendOpen ? '' : 'bg-red-100'}`}>
                            {/* mostra ✕ per eliminare blocco */}
                            {blocks.filter(b => b.date === date && b.type !== 'OPEN').some(b => {
                              if (!b.startTime || !b.endTime) return true;
                              return time >= b.startTime && time < b.endTime;
                            }) && (
                              <button
                                className="hidden group-hover:block text-red-400 text-[10px] leading-none"
                                onClick={e => {
                                  e.stopPropagation();
                                  const block = blocks.find(b => b.date === date && b.type === 'BLOCK' && (
                                    (!b.startTime) || (time >= b.startTime && time < (b.endTime ?? ''))
                                  ));
                                  if (block) deleteBlock(block.id);
                                }}
                              >✕</button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legenda */}
      <div className="bg-white border-t border-gray-100 px-6 py-2 flex gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-red-100 border border-red-200" /> Bloccato</div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" /> Weekend chiuso</div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-green-100 border border-green-200" /> Weekend aperto</div>
        <div className="flex items-center gap-1.5 ml-auto text-gray-400 italic">Clicca e trascina per selezionare · Clicca intestazione giorno per selezionare tutto</div>
      </div>

      {/* Lista blocchi esistenti */}
      {blocks.length > 0 && (
        <div className="bg-white border-t border-gray-100 px-6 py-3">
          <div className="flex flex-wrap gap-2">
            {blocks.map(b => (
              <div key={b.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${b.type === 'OPEN' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                <span>
                  {new Date(b.date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
                  {' '}
                  {b.startTime ? `${b.startTime}–${b.endTime}` : 'tutto il giorno'}
                  {b.note && ` · ${b.note}`}
                </span>
                <button onClick={() => deleteBlock(b.id)} className="hover:opacity-70 leading-none">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal nota */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {selectionIsAllWeekend ? 'Apri disponibilità weekend' : 'Blocca disponibilità'}
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              {selected.size} slot selezionati
            </p>
            <div className="mb-5">
              <label className="text-xs text-gray-500 block mb-1">Nota (opzionale)</label>
              <input
                type="text"
                value={modalNote}
                onChange={e => setModalNote(e.target.value)}
                placeholder="Es. Pausa pranzo, Ferie..."
                className="w-full p-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[var(--brand-title)] text-gray-900"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50">
                Annulla
              </button>
              <Button
                onClick={saveBlocks}
                disabled={isSaving}
                className={`flex-1 rounded-xl font-bold text-white ${isSaving ? 'bg-gray-300 cursor-not-allowed' : selectionIsAllWeekend ? 'bg-green-600' : 'bg-red-500'}`}
              >
                {isSaving ? 'Salvataggio...' : 'Conferma'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(DisponibilitaPage), { ssr: false });
