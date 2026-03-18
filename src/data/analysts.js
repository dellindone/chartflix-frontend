// src/data/analysts.js
export const ANALYSTS = [
  {
    id: 'A1',
    name: 'Arjun Mehta',
    tag: 'Technical Analyst · 8 yrs',
    initials: 'AM',
    avatarBg: '#0d2349',
    avatarColor: '#388bfd',
    recommendations: [
      { sym: 'RELIANCE', name: 'Reliance Industries', action: 'buy', sector: 'Energy', cmp: 2870, target: 3200, stopLoss: 2750, note: 'Strong breakout above 200 DMA. Volume surge confirms momentum.', date: 'Mar 18, 2026' },
      { sym: 'TCS', name: 'Tata Consultancy Svcs', action: 'buy', sector: 'IT', cmp: 3940, target: 4300, stopLoss: 3800, note: 'Consolidation near ATH. IT index showing strength.', date: 'Mar 17, 2026' },
      { sym: 'HDFC', name: 'HDFC Bank', action: 'hold', sector: 'Banking', cmp: 1720, target: 1850, stopLoss: 1650, note: 'Awaiting RBI policy clarity. Range-bound short term.', date: 'Mar 16, 2026' },
      { sym: 'WIPRO', name: 'Wipro', action: 'buy', sector: 'IT', cmp: 480, target: 540, stopLoss: 455, note: 'Cheap valuation vs peers. Turnaround underway.', date: 'Mar 15, 2026' },
    ],
  },
  {
    id: 'A2',
    name: 'Priya Sharma',
    tag: 'Fundamental Analyst · 12 yrs',
    initials: 'PS',
    avatarBg: '#1e0d2d',
    avatarColor: '#bc8cff',
    recommendations: [
      { sym: 'INFY', name: 'Infosys', action: 'sell', sector: 'IT', cmp: 1540, target: 1350, stopLoss: 1620, note: 'Weak Q3 guidance. Margin pressure expected to continue.', date: 'Mar 18, 2026' },
      { sym: 'TCS', name: 'Tata Consultancy Svcs', action: 'buy', sector: 'IT', cmp: 3940, target: 4200, stopLoss: 3820, note: 'Strong deal pipeline. Dollar revenue growth beat estimates.', date: 'Mar 17, 2026' },
      { sym: 'BAJFINANCE', name: 'Bajaj Finance', action: 'buy', sector: 'NBFC', cmp: 7200, target: 8000, stopLoss: 6900, note: 'Credit growth robust. Premium valuation justified.', date: 'Mar 15, 2026' },
      { sym: 'RELIANCE', name: 'Reliance Industries', action: 'buy', sector: 'Energy', cmp: 2870, target: 3150, stopLoss: 2760, note: 'Jio monetization + retail growth story intact.', date: 'Mar 16, 2026' },
    ],
  },
  {
    id: 'A3',
    name: 'Vikram Rao',
    tag: 'Quant Analyst · 6 yrs',
    initials: 'VR',
    avatarBg: '#0f2d1a',
    avatarColor: '#3fb950',
    recommendations: [
      { sym: 'NIFTY', name: 'Nifty 50 Index', action: 'buy', sector: 'Index', cmp: 23100, target: 24500, stopLoss: 22500, note: 'Quant model signals strong uptrend. 85% confidence.', date: 'Mar 18, 2026' },
      { sym: 'RELIANCE', name: 'Reliance Industries', action: 'buy', sector: 'Energy', cmp: 2870, target: 3100, stopLoss: 2780, note: 'Momentum factor score: 92/100. High conviction.', date: 'Mar 17, 2026' },
      { sym: 'TCS', name: 'Tata Consultancy Svcs', action: 'hold', sector: 'IT', cmp: 3940, target: 4050, stopLoss: 3870, note: 'Neutral momentum. Wait for earnings confirmation.', date: 'Mar 16, 2026' },
      { sym: 'MARUTI', name: 'Maruti Suzuki', action: 'sell', sector: 'Auto', cmp: 12400, target: 11200, stopLoss: 13000, note: 'EV transition risk underpriced. Short term overbought.', date: 'Mar 16, 2026' },
      { sym: 'HDFC', name: 'HDFC Bank', action: 'buy', sector: 'Banking', cmp: 1720, target: 1950, stopLoss: 1640, note: 'Strong deposit growth. NIM expansion expected.', date: 'Mar 15, 2026' },
    ],
  },
];
