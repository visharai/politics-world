export interface FactCheckItem {
  id: string;
  speaker: string;
  speakerRole: string;
  claim: string;
  verdict: 'Verified True' | 'Context Required' | 'Misleading / Unsubstantiated';
  verdictScore: number; // 0 (False) to 100 (True)
  topic: string;
  date: string;
  summary: string;
  sourceDocuments: string[];
  expandedAnalysis: string;
}

const getFactDate = (daysAgo: number) => {
  const d = new Date(Date.now() - daysAgo * 24 * 3600 * 1000);
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(d);
};

export const FACT_CHECK_DATA: FactCheckItem[] = [
  {
    id: 'fc-1',
    speaker: 'House Energy & Commerce Committee Spokesperson',
    speakerRole: 'Congressional Briefing',
    claim: '"The newly signed New Delhi & Geneva accord immediately eliminates domestic state discretion over clean energy manufacturing grants."',
    verdict: 'Misleading / Unsubstantiated',
    verdictScore: 22,
    topic: 'Trade & Industrial Policy',
    date: getFactDate(0),
    summary: 'The accord establishes reciprocal subsidy ceilings of 12% on raw critical minerals, but explicitly reserves sovereign authority over state-level tax incentives and domestic site selection.',
    sourceDocuments: [
      'New Delhi-Geneva Multilateral Industrial Compact Text, Article IV, § 3(b)',
      'Congressional Research Service Memorandum LTR-2026-1103',
    ],
    expandedAnalysis: 'While the treaty harmonizes origin standards to prevent punitive cross-border tariffs, Section 4 explicitly protects pre-existing sovereign block grants. Federal review is triggered only when total aggregate subsidies exceed the 12% ad valorem price ceiling.',
  },
  {
    id: 'fc-2',
    speaker: 'Commerce Undersecretary for International Trade',
    speakerRole: 'Press Briefing Statement',
    claim: '"Allied maritime shipping throughput in Pacific hub ports has increased by 18 percent since the automated logistics protocol was enacted."',
    verdict: 'Verified True',
    verdictScore: 94,
    topic: 'Pacific Maritime Commerce',
    date: getFactDate(1),
    summary: 'Federal Maritime Commission manifests and Singapore Port Authority telemetry corroborate an 18.2% acceleration in average TEU container turnaround times.',
    sourceDocuments: [
      'Federal Maritime Commission Monthly Throughput Ledger (Q3-Q4 2026)',
      'Singapore Maritime & Port Authority Cargo Telemetry Audits',
    ],
    expandedAnalysis: 'The expedited green-lane clearance system reduced average customs dwell times from 96 hours to 24 hours, validating the administration’s projection for high-volume allied container carriers.',
  },
  {
    id: 'fc-3',
    speaker: 'Senate Budget Ranking Member',
    speakerRole: 'Floor Debate Speech',
    claim: '"The bipartisan microchip and critical infrastructure resolution cuts sovereign research funding by nearly half for domestic quantum universities."',
    verdict: 'Context Required',
    verdictScore: 50,
    topic: 'Federal Budget & Quantum Research',
    date: getFactDate(2),
    summary: 'The resolution maintains current baseline outlays for basic science but channels capital through specialized multi-university computing hubs rather than direct university grants.',
    sourceDocuments: [
      'National Frontier Computing Infrastructure Resolution (S. 4102), Division B',
      'Congressional Budget Office Fiscal Estimate November 2026',
    ],
    expandedAnalysis: 'Immediate sovereign compute access was funded at $15 billion in emergency appropriations. The structural restructuring centralizes expensive GPU cluster maintenance while guaranteeing subsidized access for all accredited academic research faculties.',
  },
];
