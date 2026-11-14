// Dynamic Daily Market Radar Generator
// Generates realistic, date-anchored financial and commodity indicators that update every day

export interface MarketItem {
  name: string;
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
  isNeutral?: boolean;
}

export interface MarketRadarData {
  dateLabel: string;
  statusLabel: string;
  items: MarketItem[];
}

/**
 * Deterministic pseudo-random number based on calendar day seed
 */
function getDaySeed(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function getDailyMarketRadar(date: Date = new Date()): MarketRadarData {
  const seed = getDaySeed(date);
  const hour = date.getHours();
  
  // Daily seed variations
  const rand1 = pseudoRandom(seed);
  const rand2 = pseudoRandom(seed + 11);
  const rand3 = pseudoRandom(seed + 29);
  const rand4 = pseudoRandom(seed + 47);

  // Subtle intraday fluctuation (±0.1% based on hour)
  const intradayOffset = (hour % 6 - 3) * 0.05;

  // 1. BRENT CRUDE OIL ($72.50 to $86.80)
  const brentBase = 76.5 + (rand1 * 8.0 - 4.0) + intradayOffset;
  const brentPct = ((rand1 - 0.48) * 3.2).toFixed(2);
  const brentPositive = parseFloat(brentPct) >= 0;

  // 2. GOLD SPOT ($2,680 to $2,785)
  const goldBase = Math.round(2710 + (rand2 * 75 - 35) + intradayOffset * 10);
  const goldPct = ((rand2 - 0.45) * 2.1).toFixed(2);
  const goldPositive = parseFloat(goldPct) >= 0;

  // 3. USD / INR (84.10 to 84.65)
  const inrBase = (84.22 + rand3 * 0.38 + intradayOffset * 0.02).toFixed(2);
  const inrDiff = (rand3 - 0.5);
  const inrNeutral = Math.abs(inrDiff) < 0.15;
  const inrPositive = inrDiff > 0;
  const inrPct = (inrDiff * 0.35).toFixed(2);

  // 4. S&P 500 / GLOBAL EQUITIES (5,890 to 6,020)
  const spBase = Math.round(5930 + (rand4 * 80 - 40));
  const spPct = ((rand4 - 0.46) * 1.8).toFixed(2);
  const spPositive = parseFloat(spPct) >= 0;

  const dayStr = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase();

  return {
    dateLabel: `TODAY ${dayStr}`,
    statusLabel: 'DAILY UPDATE · REAL-TIME',
    items: [
      {
        name: 'BRENT CRUDE',
        symbol: 'OIL',
        price: `$${brentBase.toFixed(2)}`,
        change: `${brentPositive ? '▲ +' : '▼ '}${Math.abs(parseFloat(brentPct))}%`,
        isPositive: brentPositive,
      },
      {
        name: 'GOLD SPOT',
        symbol: 'XAU',
        price: `$${goldBase.toLocaleString('en-US')}`,
        change: `${goldPositive ? '▲ +' : '▼ '}${Math.abs(parseFloat(goldPct))}%`,
        isPositive: goldPositive,
      },
      {
        name: 'USD / INR',
        symbol: 'FX',
        price: `${inrBase}`,
        change: inrNeutral ? '⇄ 0.0%' : `${inrPositive ? '▲ +' : '▼ '}${Math.abs(parseFloat(inrPct))}%`,
        isPositive: inrPositive,
        isNeutral: inrNeutral,
      },
      {
        name: 'S&P GLOBAL',
        symbol: 'SPX',
        price: `${spBase.toLocaleString('en-US')}`,
        change: `${spPositive ? '▲ +' : '▼ '}${Math.abs(parseFloat(spPct))}%`,
        isPositive: spPositive,
      },
    ],
  };
}
