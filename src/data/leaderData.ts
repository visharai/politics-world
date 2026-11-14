export interface GlobalLeader {
  id: string;
  rank: number;
  name: string;
  title: string;
  country: string;
  flagCode: string;
  image: string;
  approvalRating: number;
  disapprovalRating: number;
  approvalChange: number; // e.g. +2.4 or -1.2
  economicConfidence: number;
  geopoliticalInfluence: number; // 0 - 100
  tenureYears: number;
  keyInitiatives: string[];
  bioExcerpt: string;
  pollingSource: string;
  recentDevelopment: string;
}

export const GLOBAL_LEADERS: GlobalLeader[] = [
  {
    id: 'leader-5',
    rank: 1,
    name: 'Narendra Modi',
    title: 'Prime Minister of India',
    country: 'India',
    flagCode: 'IND',
    image: '/src/assets/images/narendra_modi_real_portrait.jpg',
    approvalRating: 73.6,
    disapprovalRating: 21.4,
    approvalChange: +3.2,
    economicConfidence: 78,
    geopoliticalInfluence: 94,
    tenureYears: 10,
    keyInitiatives: [
      'Digital Public Infrastructure (India Stack)',
      'India Semiconductor Mission & Make in India',
      'International Solar Alliance & Green Hydrogen Hub',
    ],
    bioExcerpt: 'Leads global approval ratings driven by 7.2% annual GDP expansion, nationwide digital public infrastructure, and strategic multipolar diplomacy spanning the Global South, G20, and Quad.',
    pollingSource: 'Morning Consult Global Leader Tracker / PW New Delhi Bureau',
    recentDevelopment: 'Presided over parliamentary sanction of the $15B National Semiconductor Fabrication Hub in Gujarat and UP.',
  },
  {
    id: 'leader-1',
    rank: 2,
    name: 'Alexander Sterling',
    title: 'President of the United States',
    country: 'United States',
    flagCode: 'USA',
    image: '/src/assets/images/leader_us_executive_1791863782267.jpg',
    approvalRating: 61.4,
    disapprovalRating: 34.2,
    approvalChange: +2.8,
    economicConfidence: 68,
    geopoliticalInfluence: 96,
    tenureYears: 2,
    keyInitiatives: [
      'G7 Transatlantic Clean Tech Accord',
      'Frontier AI Compute Security Standards',
      'Maritime Freedom Freedom Patrols',
    ],
    bioExcerpt: 'Benefiting from robust domestic GDP growth and the newly finalized Brussels subsidy agreement, the administration maintains high marks among independent and suburban constituencies.',
    pollingSource: 'Politics World / Morning Consult Global Tracker',
    recentDevelopment: 'Signed the $180B Bipartisan Infrastructure & Microchip Pact into law yesterday.',
  },
  {
    id: 'leader-2',
    rank: 2,
    name: 'Helena Bergstrom',
    title: 'President of the European Commission',
    country: 'European Union',
    flagCode: 'EU',
    image: '/src/assets/images/leader_germany_chancellor_1791863784038.jpg',
    approvalRating: 57.8,
    disapprovalRating: 36.5,
    approvalChange: +1.9,
    economicConfidence: 62,
    geopoliticalInfluence: 91,
    tenureYears: 3,
    keyInitiatives: [
      'European Sovereign Semiconductor Shield',
      'Critical Raw Materials Allied Alliance',
      'Cross-Border Carbon Tariff Framework',
    ],
    bioExcerpt: 'Praised across Brussels for steering the delicate 48-hour negotiations that averted a transatlantic tariff rift, cementing unified European industrial bargaining power.',
    pollingSource: 'Eurobarometer / PW International Desk',
    recentDevelopment: 'Addressed the European Parliament on common defense procurement integration.',
  },
  {
    id: 'leader-3',
    rank: 3,
    name: 'Kenji Takahashi',
    title: 'Prime Minister of Japan',
    country: 'Japan',
    flagCode: 'JPN',
    image: '/src/assets/images/leader_japan_premier_1791863782084.jpg',
    approvalRating: 54.2,
    disapprovalRating: 38.0,
    approvalChange: -0.6,
    economicConfidence: 59,
    geopoliticalInfluence: 88,
    tenureYears: 2,
    keyInitiatives: [
      'Pacific Logistics Resiliency Council',
      'Automated Port Throughput Modernization',
      'Indo-Pacific Trilateral Defense Compact',
    ],
    bioExcerpt: 'Maintains decisive parliamentary backing through targeted semiconductor manufacturing investments in Kumamoto and active Pacific maritime diplomacy.',
    pollingSource: 'Nikkei / Kyodo News Polling Unit',
    recentDevelopment: 'Concluded trilateral naval coordination talks with Manila and Canberra.',
  },
  {
    id: 'leader-4',
    rank: 4,
    name: 'James Montgomery',
    title: 'Prime Minister of the United Kingdom',
    country: 'United Kingdom',
    flagCode: 'GBR',
    image: '/src/assets/images/leader_uk_prime_minister_1791863783540.jpg',
    approvalRating: 51.6,
    disapprovalRating: 42.1,
    approvalChange: +0.4,
    economicConfidence: 55,
    geopoliticalInfluence: 85,
    tenureYears: 1,
    keyInitiatives: [
      'Clean Power 2030 Grid Reauthorization',
      'Anglo-European Customs Streamlining',
      'National AI Safety Institute Expansion',
    ],
    bioExcerpt: 'Focused on disciplined macroeconomic stabilization and renewed trade dialogues with European capitals following parliamentary passage of planning reform.',
    pollingSource: 'YouGov / PW Westminster Bureau',
    recentDevelopment: 'Secured bipartisan approval for regional high-speed logistics corridors.',
  },
];
