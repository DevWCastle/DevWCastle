/**
 * Ícones de traço único (1.6px num grid de 20). Substituem as setas em
 * Unicode para manter peso e alinhamento iguais em todo o site.
 */
const PATHS = {
  'arrow-right': 'M4 10h12M11 5l5 5-5 5',
  'arrow-left': 'M16 10H4M9 5l-5 5 5 5',
  'arrow-down': 'M10 4v12M5 11l5 5 5-5',
  'arrow-up': 'M10 16V4M5 9l5-5 5 5',
  'arrow-up-right': 'M6 14L14 6M7 6h7v7',
  mail: 'M3 5.5h14v9H3zM3.5 6l6.5 5 6.5-5',
  check: 'M4.5 10.5l3.5 3.5 7.5-8',
  alert: 'M10 6v5M10 13.6v.4M10 2.8l7.6 13.4H2.4z',
  menu: 'M3 6.5h14M3 13.5h14',
  close: 'M5 5l10 10M15 5L5 15',
};

const DIRECTION_CLASS = {
  'arrow-right': 'icon--right',
  'arrow-down': 'icon--down',
  'arrow-up-right': 'icon--up-right',
};

export default function Icon({ name, size = 18, className = '' }) {
  const classes = ['icon', DIRECTION_CLASS[name], className].filter(Boolean).join(' ');

  return (
    <svg
      className={classes}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
