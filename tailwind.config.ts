import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        deep: '#F6F1E9',      // page background (warm paper)
        depth2: '#FFFFFF',    // card / panel background
        depth3: '#E7DFCF',    // soft hairline (used sparingly now)
        foam: '#1B1712',      // ink — also the brutalist border/shadow color
        seafoam: '#6E6255',   // muted text
        // Customizable-from-admin accents. RGB channel format so /alpha utilities work.
        lure: 'rgb(var(--clay) / <alpha-value>)',
        catch: 'rgb(var(--gold) / <alpha-value>)',
        danger: '#C1382E',
      },
      fontFamily: {
        display: ['var(--font-fredoka)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jbmono)', 'monospace'],
      },
      backgroundImage: {
        'depth-gradient': 'linear-gradient(180deg, #F8F4EC 0%, #F6F1E9 60%, #F1E9D8 100%)',
      },
      boxShadow: {
        brutal: '4px 4px 0 0 #1B1712',
        'brutal-sm': '2px 2px 0 0 #1B1712',
        'brutal-lg': '6px 6px 0 0 #1B1712',
      },
    },
  },
  plugins: [],
};
export default config;
