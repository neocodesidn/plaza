import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        deep: '#0B1C2C',      // deep water navy - base bg
        depth2: '#122B40',    // panel bg
        depth3: '#1B3A52',    // border / hairline
        foam: '#EAF4F0',      // primary text on dark
        seafoam: '#9FC9C4',   // muted text
        lure: '#2FBFA3',      // teal accent - primary action
        catch: '#F2B441',     // gold - rarity / highlight
        danger: '#E2694B',    // reject / cancel
      },
      fontFamily: {
        display: ['var(--font-fredoka)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jbmono)', 'monospace'],
      },
      backgroundImage: {
        'depth-gradient': 'linear-gradient(180deg, #0B1C2C 0%, #0E2233 60%, #122B40 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
