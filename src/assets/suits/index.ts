import ecke from './ecke.svg';
import herz from './herz.svg';
import schaufel from './schaufel.svg';
import kreuz from './kreuz.svg';
import bells from './schellen.svg';
import roses from './rosen.svg';
import shields from './schilten.svg';
import acorns from './eichel.svg';

export const SUIT_IMAGES = {
  // German / French suit images
  ecke,
  herz,
  schaufel,
  kreuz,
  // Swiss suit images
  bells, // schellen
  roses,
  shields, // schilten
  acorns, // eicheln
} as const;
