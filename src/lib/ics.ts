export function generateICS(params: {
  title: string;
  date: string;
  time: string;
  durationMinutes: number;
  description?: string;
}): string {
  const { title, date, time, durationMinutes, description = '' } = params;

  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);

  const pad = (n: number) => String(n).padStart(2, '0');

  const dtStart = `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}00`;

  const endDate = new Date(year, month - 1, day, hours, minutes + durationMinutes);
  const dtEnd = `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;

  const uid = `${dtStart}-${Math.random().toString(36).slice(2)}@vivaplantnutrition.com`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Viva Plant Nutrition//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART;TZID=Europe/Rome:${dtStart}`,
    `DTEND;TZID=Europe/Rome:${dtEnd}`,
    `SUMMARY:${title}`,
    description ? `DESCRIPTION:${description.replace(/\n/g, '\\n')}` : '',
    'LOCATION:Online / Studio Viva Plant Nutrition',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
}

export function icsToBase64(icsContent: string): string {
  return Buffer.from(icsContent, 'utf-8').toString('base64');
}
