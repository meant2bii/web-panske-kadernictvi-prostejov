import { mkdir, readFile, writeFile } from 'node:fs/promises';

const sourcePath = new URL('../www/data/provozni-zmeny.json', import.meta.url);
const outputDir = new URL('../www/feed/', import.meta.url);
const outputPath = new URL('../www/feed/firmy.json', import.meta.url);
const changes = JSON.parse(await readFile(sourcePath, 'utf8'));
const today = (() => {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Europe/Prague',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, value]));
  return `${value.year}-${value.month}-${value.day}`;
})();
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatTime(value) {
  const [hours, minutes] = value.split(':');
  return `${hours.padStart(2, '0')}:${minutes}`;
}

function osmDate(date) {
  const [year, month, day] = date.split('-').map(Number);
  return `${year} ${months[month - 1]} ${day}`;
}

function datesInRange(from, until) {
  const dates = [];
  const cursor = new Date(`${from}T12:00:00Z`);
  const end = new Date(`${until}T12:00:00Z`);
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

const exceptions = new Map();
for (const item of changes) {
  const from = item.from || item.date;
  const until = item.until || from;
  if (!from || until < today) continue;

  for (const date of datesInRange(from, until)) {
    if (item.type === 'closed') {
      exceptions.set(date, `${osmDate(date)} off`);
      continue;
    }

    const match = String(item.hours || '').match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
    if (!match) throw new Error(`Neplatný čas ve změně ${date}: ${item.hours}`);
    exceptions.set(date, `${osmDate(date)} ${formatTime(match[1])}-${formatTime(match[2])}`);
  }
}

const feed = {
  exportDate: new Date().toISOString(),
  premises: [{
    id: 'pvkadernictvi-prostejov-13038169',
    ic: '74768832',
    name: 'Pánské kadeřnictví Prostějov',
    description: 'Pánské kadeřnictví včetně dalších kosmetických služeb.',
    address: {
      city: 'Prostějov',
      street: 'Svatoplukova',
      houseNumber: '2473/35',
      zip: '796 01'
    },
    emails: [{ email: 'pvkadernictvi@email.cz', role: 'E-mail' }],
    phones: [{ countryCode: '420', number: '735082419', role: 'Telefon' }],
    socialNetworks: [{ socialNetwork: 'facebook', url: 'https://www.facebook.com/pvkadernictvi' }],
    url: 'https://www.pvkadernictvi.eu/',
    openingHours: [
      'Mo-Fr 06:30-18:00',
      'Sa 06:30-11:30',
      'Su off',
      ...exceptions.values()
    ].join('; '),
    filters: ['bezbarierove', 'family-friendly', 's-parkovistem', 'platba-v-hotovosti']
  }]
};

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, `${JSON.stringify(feed, null, 2)}\n`, 'utf8');
console.log(`Generated ${outputPath.pathname}`);
