export default function Icon({ name }: { name: 'next' | 'back' | 'expand' | 'shrink' | 'reset' | 'play' | 'ticket' | 'loop' }) {
  const paths = {
    next: 'm9 5 7 7-7 7', back: 'm15 5-7 7 7 7',
    expand: 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5',
    shrink: 'M3 8h5V3m8 0v5h5M8 21v-5H3m13 5v-5h5',
    reset: 'M3 10a9 9 0 1 1 2 8M3 4v6h6',
    play: 'm8 4 12 8-12 8Z',
    ticket: 'M4 4h16v5a3 3 0 0 0 0 6v5H4v-5a3 3 0 0 0 0-6Zm8 1v2m0 3v2m0 3v2',
    loop: 'M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5M4 16a8 8 0 0 0 14 3l3-3m-5 0h5v5',
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
