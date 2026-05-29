import { notFound } from 'next/navigation';
import React from 'react';
import Icon from '@/components/icons/Icon';

const groups = [
  {
    label: 'Verde Menta',
    color: '#d1fae5',
    icons: ['leaf', 'sprout', 'apple', 'appleWorld', 'heartNature', 'alert', 'share', 'certificate', 'medal', 'mail', 'mapPin', 'chat', 'check', 'numberOne', 'shield', 'lightning', 'molecule', 'checkCircle'],
  },
  {
    label: 'Azzurro',
    color: '#dbeafe',
    icons: ['laptop', 'chart', 'document', 'book', 'calendar', 'helpCircle', 'users', 'bodyWorld', 'speech', 'userSingle', 'phone', 'numberTwo', 'drop', 'chevronLeft', 'chevronRight', 'video', 'info', 'refreshCcw', 'fileText', 'clipboard', 'messageCircle', 'bookOpen', 'settings', 'user'],
  },
  {
    label: 'Pesca',
    color: '#ffedd5',
    icons: ['route', 'carrot', 'pawHeart', 'numberThree', 'target'],
  },
  {
    label: 'Rosa',
    color: '#fce7f3',
    icons: ['heart', 'gift', 'clock', 'lotus', 'baby', 'pregnant', 'heartMom', 'tag'],
  },
  {
    label: 'Lavanda',
    color: '#ede9fe',
    icons: ['activity', 'puzzle', 'dna', 'numberFour', 'pill'],
  },
  {
    label: 'Lemon',
    color: '#fef9c3',
    icons: ['star', 'sparkles', 'coin', 'gradCap'],
  },
];

export default function IconsPreview() {
  if (process.env.NODE_ENV !== 'development') notFound();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-2xl font-bold mb-2">Anteprima icone</h1>
      <p className="text-sm text-gray-500 mb-10">Totale: {groups.reduce((acc, g) => acc + g.icons.length, 0)} icone</p>
      <div className="space-y-10">
        {groups.map(group => (
          <div key={group.label}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: group.color, border: '1px solid #ccc' }} />
              {group.label}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-6">
              {group.icons.map(name => (
                <div key={name} className="flex flex-col items-center gap-2">
                  <Icon name={name as any} size={36} shape="circle" />
                  <span className="text-xs text-gray-500 text-center break-all">{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
