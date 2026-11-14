export interface Article {
  id: string;
  title: string;
  deck: string;
  category: 'White House & Congress' | 'Global Summits' | 'Geopolitics' | 'Economy & Trade' | 'Elections 2026';
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image?: string;
  caption?: string;
  leadParagraph?: string;
  bodyParagraphs: string[];
  keyTakeaways?: string[];
  tags: string[];
  impactScore?: string;
  featured?: boolean;
  priority?: 'lead' | 'secondary' | 'standard';
  sourceAgency?: string;
  sourceCountry?: string;
  sourceUrl?: string;
  publishedAt?: string;
  timestamp?: number;
}

export interface BillItem {
  id: string;
  billNumber: string;
  title: string;
  chamber: 'U.S. Senate' | 'House of Representatives' | 'European Parliament';
  status: 'Floor Debate' | 'Committee Markup' | 'Bipartisan Reconciliation' | 'Signed into Law';
  oddsOfPassage: number;
  voteEstimate: { yeas: number; nays: number; undecided: number };
  sponsors: string[];
  summary: string;
  nextMilestone: string;
}

export interface OpinionColumn {
  id: string;
  author: string;
  role: string;
  columnTitle: string;
  headline: string;
  quote: string;
  date: string;
  readTime: string;
  initials: string;
}

export interface BreakingDispatchItem {
  id: string;
  timestamp: string;
  category: string;
  title: string;
  urgent?: boolean;
}

export const BREAKING_DISPATCHES: BreakingDispatchItem[] = [
  {
    id: 'b1',
    timestamp: '2m ago · Live',
    category: 'G20 SUMMIT',
    title: 'New Delhi & Geneva Envoys Ratify Historic $120B Intercontinental Green Trade & Clean Energy Corridor',
    urgent: true,
  },
  {
    id: 'b2',
    timestamp: '5m ago · Live',
    category: 'BERLIN BUNDESTAG',
    title: 'German Lawmakers Clear €38B Baltic-Ruhr Hydrogen Backbone to Power Continental Heavy Industry',
    urgent: false,
  },
  {
    id: 'b3',
    timestamp: '9m ago · Live',
    category: 'CAPITOL HILL',
    title: 'Senate Bipartisan Accord Reached on $190B Semiconductor Packaging & Sovereign AI Compute Reserve',
    urgent: true,
  },
  {
    id: 'b4',
    timestamp: '14m ago · Live',
    category: 'INDO-PACIFIC ACCORD',
    title: 'Quad & Allied Navies Launch Unified Real-Time Maritime Domain Awareness Architecture in South China Sea',
    urgent: true,
  },
  {
    id: 'b5',
    timestamp: '18m ago · Live',
    category: 'WHITE HOUSE',
    title: 'President Issues Executive Order Establishing Sovereign Critical Mineral Stockpile and Rare-Earth Quotas',
    urgent: true,
  },
  {
    id: 'b6',
    timestamp: '22m ago · Live',
    category: 'SUPREME COURT',
    title: 'Justices Issue Decisive Ruling Upholding Federal Digital Commerce Framework Over State Patchworks',
    urgent: false,
  },
  {
    id: 'b7',
    timestamp: '27m ago · Live',
    category: 'CENTRAL BANK DESK',
    title: 'Global Central Banks Coordinate Liquidity Facility as Core Inflation Moderates to 2.0% Baseline',
    urgent: false,
  },
  {
    id: 'b8',
    timestamp: '31m ago · Live',
    category: 'TOKYO MARITIME HUB',
    title: 'Japan, Australia & ASEAN Formalize Automated Customs Fast-Lanes for Verified Green Cargo Fleets',
    urgent: false,
  },
  {
    id: 'b9',
    timestamp: '35m ago · Live',
    category: 'RIYADH SUMMIT',
    title: 'GCC Ratifies $65B Desalination & Solar Gigawatt Supergrid Linking Gulf with Eastern Mediterranean',
    urgent: true,
  },
  {
    id: 'b10',
    timestamp: '40m ago · Live',
    category: 'LONDON DESK',
    title: 'UK & EU Conclude Landmark Reciprocal High-Tech Intellectual Property and Silicon Treaty',
    urgent: false,
  },
  {
    id: 'b11',
    timestamp: '44m ago · Live',
    category: 'ELECTION DESK 2026',
    title: 'Federal Election Monitors Confirm 100% Cryptographic Audit Trail Clearance in Key Swing Districts',
    urgent: true,
  },
  {
    id: 'b12',
    timestamp: '48m ago · Live',
    category: 'GENEVA TRIBUNAL',
    title: 'World Trade Panel Rebuffs Carbon Tariff Challenge, Validating Reciprocal Green Manufacturing Standards',
    urgent: false,
  },
];

export const LIVE_INCOMING_DISPATCHES: BreakingDispatchItem[] = [
  {
    id: 'b13',
    timestamp: 'JUST IN',
    category: 'DEFENSE PROCUREMENT',
    title: 'Allied Logistics Command Authorizes Multi-National Autonomous Maritime Patrol Fleet Deployment',
    urgent: true,
  },
  {
    id: 'b14',
    timestamp: 'JUST IN',
    category: 'TRADE DESK',
    title: 'Cross-Border Automated Port Dwell Times Reduced by 42% Across Major Transpacific Container Terminals',
    urgent: false,
  },
  {
    id: 'b15',
    timestamp: 'JUST IN',
    category: 'SEMICONDUCTOR WIRE',
    title: 'Dholera Silicon Mega-Hub Achieves First Test Run of 3nm High-Precision Wafer Packaging',
    urgent: true,
  },
  {
    id: 'b16',
    timestamp: 'JUST IN',
    category: 'CLEAN ENERGY',
    title: 'North Sea 50GW Offshore Direct-Current Subsea Cables Enter Final Energization Phase',
    urgent: false,
  },
  {
    id: 'b17',
    timestamp: 'JUST IN',
    category: 'NEARSHORING WIRE',
    title: 'Mexico-US Automated Rail Corridor Clears 25,000 Freight Containers in Record 24-Hour Turnaround',
    urgent: false,
  },
  {
    id: 'b18',
    timestamp: 'JUST IN',
    category: 'PARLIAMENTARY DISPATCH',
    title: 'Indian Parliament Standing Committee Adopts Comprehensive Sovereign AI & Data Protection Standard',
    urgent: true,
  },
];

export const CURRENT_DATE_FORMATTED = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());
export const YESTERDAY_DATE_FORMATTED = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(Date.now() - 24 * 3600 * 1000));

function formatDynamicOffsetTime(offsetMinutes: number): string {
  const dt = new Date(Date.now() - offsetMinutes * 60 * 1000);
  const timeStr = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  if (offsetMinutes < 60) {
    return `${offsetMinutes}m ago · ${timeStr}`;
  }
  return `${CURRENT_DATE_FORMATTED} · ${timeStr}`;
}

export const ARTICLES: Article[] = [
  {
    id: 'art-lead-1',
    title: 'The New Delhi Diplomatic Summit: Multi-Nation Trade Corridor Finalizes Historic Maritime Freight Accord',
    deck: 'Global delegations conclude marathon negotiations in New Delhi, establishing an automated green logistics and clean energy corridor connecting India, the Arabian Gulf, and European economic hubs.',
    category: 'Global Summits',
    author: 'Eleanor Vance & Rajesh K. Verma',
    authorRole: 'Chief Diplomatic & Geopolitical Correspondents',
    date: formatDynamicOffsetTime(5),
    publishedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    timestamp: Date.now() - 5 * 60 * 1000,
    readTime: '8 min read',
    image: '/src/assets/images/india_parliament_news_1792118846447.jpg',
    caption: 'Official delegation leaders and international trade envoys finalize the landmark multilateral economic corridor pact in New Delhi.',
    priority: 'lead',
    featured: true,
    sourceAgency: 'Reuters',
    sourceCountry: 'United Kingdom (UK)',
    sourceUrl: 'https://www.reuters.com/world/india/diplomatic-summit-2026',
    tags: ['India', 'Global Summits', 'Trade Corridor', 'Gulf Envoys', 'European Union', 'Reuters'],
    keyTakeaways: [
      'Reduces container transit dwell time between the Indian Ocean and Mediterranean ports by 38%.',
      'Unified customs harmonization treaty agreed upon with automated digital verification.',
      'Infrastructure allocations prioritized for high-capacity hydrogen rail lines and smart port terminals.',
      'Joint $120 billion multilateral financing facility backed by sovereign wealth funds.',
    ],
    leadParagraph: 'When the plenary session adjourned shortly after dawn on Tuesday in New Delhi, exhausted international negotiators had achieved what previous quarters of fraught diplomatic rounds could not: an airtight, legally binding framework creating an automated green shipping corridor linking Asia, the Middle East, and Europe.',
    bodyParagraphs: [
      'The milestone accord, signed by senior ministerial envoys from India, the Gulf Cooperation Council, and European member states, establishes standardized digital bills of lading and mutual recognition for certified zero-carbon container vessels.',
      'Under the treaty, member states commit $120 billion in joint sovereign and multilateral infrastructure bond guarantees over the next seven years. The primary arterial lines will connect western Indian deep-water harbors directly to Arabian Gulf railheads, terminating at Mediterranean transshipment hubs.',
      'Commerce ministers hailed the pact as a stabilizing pillar for global trade resilience, ensuring alternative intercontinental shipping routes that bypass vulnerable maritime chokepoints while slashing logistics emissions.',
      'Statutory ratification hearings are slated to commence across participating parliamentary bodies over the coming fortnight, with leading international trade organizations pledging full technical backing.',
    ],
  },
  {
    id: 'art-india-1',
    title: 'New Delhi Tech Summit: Parliament Approves Landmark $15B Semiconductor & Quantum Mission',
    deck: 'Indian legislative leaders enact comprehensive statutory incentives for domestic silicon foundries and quantum computing research, forging strategic tech accords with Quad and EU partners.',
    category: 'Economy & Trade',
    author: 'Vikramaditya Sharma & Eleanor Vance',
    authorRole: 'South Asia Geopolitics & Tech Policy Desk',
    date: formatDynamicOffsetTime(14),
    publishedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    timestamp: Date.now() - 14 * 60 * 1000,
    readTime: '7 min read',
    image: '/src/assets/images/india_parliament_news_1792118846447.jpg',
    caption: 'The Indian Parliament House Sansad Bhavan in New Delhi during the evening passage of the historic semiconductor legislation.',
    priority: 'secondary',
    featured: true,
    sourceAgency: 'Press Trust of India (PTI)',
    sourceCountry: 'India',
    sourceUrl: 'https://www.ptinews.com/national/semiconductor-act-2026',
    tags: ['India', 'Semiconductor Mission', 'New Delhi', 'Quad Tech Compact', 'PTI', 'Economy & Trade'],
    keyTakeaways: [
      'Statutory sanction of $15 Billion capital subsidies for 3 commercial fabrication and advanced packaging plants in Gujarat, Assam, and UP.',
      'Bilateral technology security protocols signed with EU and US under the Trade and Technology Council framework.',
      'Establishes the National Quantum Computing & Sovereign AI Research Facility with 10,000 sovereign GPU cluster access.',
    ],
    leadParagraph: 'Following an extensive bipartisan debate in both houses of Parliament, Indian lawmakers overwhelmingly enacted the National Semiconductor and Advanced Materials Shield Act, anchoring India as an indispensable node in the resilient global electronics supply chain.',
    bodyParagraphs: [
      'The legislation provides 50% central fiscal support on a pari-passu basis for mega semiconductor fabrication units, alongside guaranteed renewable power tariffs and dedicated water infrastructure corridors.',
      'External Affairs and Electronics ministers jointly announced that reciprocal supply chain resilience agreements have been executed with Tokyo, Washington, and Brussels to protect against geopolitical disruptions.',
      'Industry leaders hailed the statutory certainty, noting that domestic wafer fabrication and packaging will accelerate digital sovereignty and create hundreds of thousands of specialized technical careers across the subcontinent.',
    ],
  },
  {
    id: 'art-secondary-1',
    title: 'The Press Room Showdown: State Department Clarifies Maritime Freedom Doctrine in South China Sea',
    deck: 'In an unusually combative 90-minute briefing, the administration dismissed diplomatic protests and announced permanent joint aerial patrols with regional partners across international transit lanes.',
    category: 'Geopolitics',
    author: 'Cynthia Alvarez',
    authorRole: 'National Security Bureau Chief',
    date: formatDynamicOffsetTime(22),
    publishedAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    timestamp: Date.now() - 22 * 60 * 1000,
    readTime: '5 min read',
    image: '/src/assets/images/diplomatic_press_briefing_1791859432958.jpg',
    caption: 'State Department spokesperson addresses global correspondents during the emergency press conference.',
    priority: 'secondary',
    featured: true,
    sourceAgency: 'Associated Press (AP)',
    sourceCountry: 'United States (USA)',
    sourceUrl: 'https://apnews.com/international/maritime-doctrine-2026',
    tags: ['State Department', 'Indo-Pacific', 'Maritime Security', 'Naval Strategy', 'AP', 'Geopolitics'],
    keyTakeaways: [
      'Allied air and maritime patrols transition into continuous multilateral surveillance architecture.',
      'Joint operational command established in Honolulu with Australian, Japanese, and Philippine liaisons.',
      'Formal diplomatic dispatch reiterates unimpeded commercial navigation under UNCLOS Article 87.',
    ],
    leadParagraph: 'Facing an unsparing barrage of questions from international correspondents, the administration laid down its clearest foreign policy redline of the presidential cycle, reaffirming that multilateral freedom of navigation operations will remain permanent and non-negotiable.',
    bodyParagraphs: [
      'The spokesperson rebuffed allegations of unilateral provocation, asserting that multilateral freedom of navigation operations are grounded strictly in international maritime law and longstanding treaty obligations.',
      'Beginning next week, rotating squadrons of long-range maritime surveillance aircraft will conduct scheduled reconnaissance sweeps across international transit corridors, coordinated jointly with naval forces from Manila, Tokyo, and Canberra.',
      'Defense policy experts noted that the move codifies a decisive transition from episodic naval demonstrations to a persistent, synchronized allied security presence throughout high-density shipping arteries.',
    ],
  },
  {
    id: 'art-secondary-2',
    title: 'Supply Chains Under Scrutiny: Pacific Trade Envoys Tackle Pacific Basin Tariff Escalation',
    deck: 'Surging shipping container throughput and rising port handling surcharges prompt commerce ministers to convene an emergency Pacific logistics council in Singapore.',
    category: 'Economy & Trade',
    author: 'Hiroshi Tanaka',
    authorRole: 'Global Commerce Editor',
    date: formatDynamicOffsetTime(30),
    publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    timestamp: Date.now() - 30 * 60 * 1000,
    readTime: '6 min read',
    image: '/src/assets/images/geopolitical_trade_port_1791859433200.jpg',
    caption: 'Automated deep-water container terminal operations along the Pacific maritime corridor.',
    priority: 'secondary',
    featured: true,
    sourceAgency: 'Nikkei Asia',
    sourceCountry: 'Japan',
    sourceUrl: 'https://asia.nikkei.com/Economy/Pacific-supply-chains-summit-2026',
    tags: ['Supply Chain', 'Pacific Trade', 'Tariff War', 'Port Logistics', 'Nikkei Asia', 'Economy & Trade'],
    keyTakeaways: [
      'Singapore emergency summit drafts unified tariff suspension for certified green container vessels.',
      'Port terminal dwell times slated for reduction from 96 hours to under 24 hours via automated pre-clearance.',
      'Eight participating nations establish multilateral maritime supply chain monitoring cell.',
    ],
    leadParagraph: 'As maritime shipping rates rebounded to multi-year highs across major transpacific lanes, economic ministers from eight Asia-Pacific nations gathered in Singapore to formulate a unified response to rising customs friction and port bottlenecks.',
    bodyParagraphs: [
      'The emergency session was precipitated by sudden regulatory inspections at several pivotal maritime hubs, creating backlogs that have stretched average vessel dwell times and inflated demurrage expenses for manufacturers.',
      'Central to the talks is a proposal to establish expedited customs clearance lanes for verified green-certified cargo vessels, effectively bypassing non-tariff bureaucratic hurdles.',
      'Delegates expressed optimism that mutual recognition of electronic shipping manifests will restore predictability across transpacific electronics and automotive component supply chains before year-end.',
    ],
  },
  {
    id: 'art-gulf-1',
    title: 'GCC Riyadh Summit: Sovereign Leaders Approve $65B Clean Grid & Regional AI Supercluster',
    deck: 'Saudi Arabia, UAE, Qatar, Kuwait, Oman, and Bahrain enact landmark treaty uniting desert solar gigawatt corridors with high-performance computing centers.',
    category: 'Global Summits',
    author: 'Tariq Al-Mansoor & Eleanor Vance',
    authorRole: 'Middle East Geopolitics & Energy Desk',
    date: CURRENT_DATE_FORMATTED + ' · 10:45 GST',
    readTime: '6 min read',
    image: '/src/assets/images/gulf_summit_riyadh_1792380285437.jpg',
    caption: 'Gulf Cooperation Council delegations gather in the Grand Plenary Hall in Riyadh to ratify the renewable compute compact.',
    priority: 'standard',
    featured: true,
    sourceAgency: 'Al Jazeera',
    sourceCountry: 'Qatar',
    sourceUrl: 'https://www.aljazeera.com/economy/riyadh-summit-ai-grid-2026',
    tags: ['Gulf Summit', 'Riyadh', 'GCC', 'Clean Grid', 'AI Supercluster', 'Al Jazeera', 'Energy'],
    keyTakeaways: [
      'Ratifies binding multilateral compact uniting 35GW of solar capacity with low-latency AI data facilities.',
      'Direct undersea high-voltage DC connection to Eastern Mediterranean power exchanges.',
      'Establishes sovereign sovereign compute fund of $65 billion for regional industrial applications.',
    ],
    leadParagraph: 'Energy and technological statecraft converged in Riyadh today as six Gulf sovereign nations ratified a binding multilateral treaty to construct Europe-and-Asia facing clean transmission lines and sovereign AI data clusters.',
    bodyParagraphs: [
      'Under the framework, excess solar power from central desert arrays will directly supply low-latency inference supercomputers, positioning the Arabian Gulf as a premier neutral compute corridor between Europe and Asia.',
      'Sovereign wealth funds affirmed that domestic compute self-reliance will shield regional industries from external supply chokeholds while driving diversification beyond hydrocarbons.',
      'Ministers confirmed that private sector technology consortia from Europe, Japan, and North America will participate under strict sovereign data localization covenants.',
    ],
  },
  {
    id: 'art-mexico-1',
    title: 'Nearshoring Revolution: Mexico Activates $30B Pacific-to-Border Rail and Container Spine',
    deck: 'Intermodal freight logistics corridor directly links deep-water maritime ports to northern manufacturing clusters, slashing US border transit times by 45%.',
    category: 'Economy & Trade',
    author: 'Carlos Mendoza',
    authorRole: 'Americas Trade Bureau Chief',
    date: CURRENT_DATE_FORMATTED + ' · 09:20 CST',
    readTime: '5 min read',
    image: '/src/assets/images/mexico_nearshoring_rail_1792380630439.jpg',
    caption: 'Modern freight locomotives and intermodal container terminal in Monterrey connecting Pacific cargo routes to the border.',
    priority: 'standard',
    featured: true,
    sourceAgency: 'Agence France-Presse (AFP)',
    sourceCountry: 'France',
    sourceUrl: 'https://www.afp.com/americas/mexico-rail-nearshoring-2026',
    tags: ['Mexico', 'Nearshoring', 'USMCA', 'Logistics', 'Trade', 'AFP', 'Economy & Trade'],
    keyTakeaways: [
      'Dual-track electrified rail spine completed connecting Port of Manzanillo with Monterrey and Laredo.',
      'Automated US-Mexico customs pre-clearance reduces border crossing inspections from 48 hours to 3 hours.',
      'Projected to process over 4 million TEUs of industrial freight annually under USMCA provisions.',
    ],
    leadParagraph: 'Commercial freight authorities in Mexico officially flagged off the first high-throughput container train along the upgraded Manzanillo-Monterrey-Laredo corridor, cementing the nation’s role in global nearshoring.',
    bodyParagraphs: [
      'Automotive, medical device, and advanced electronics assemblers praised the dedicated customs fast-lanes, noting that predictable transit removes millions in inventory holding costs.',
      'Bilateral border officials announced joint automated inspection checkpoints that cut customs dwell times from days to under four hours, dramatically improving supply chain agility across North American manufacturing clusters.',
    ],
  },
  {
    id: 'art-standard-1',
    title: 'Bundestag Plenary Vote: Germany Authorizes €38B Hydrogen Backbone Linking Baltic Wind to Ruhr Foundries',
    deck: 'German lawmakers pass landmark industrial transformation measure, establishing a 9,700-kilometer dedicated hydrogen transmission network by 2030.',
    category: 'White House & Congress',
    author: 'Julian Barnes & Hannah Weber',
    authorRole: 'European Legislative Affairs Desk',
    date: CURRENT_DATE_FORMATTED + ' · 08:50 CET',
    readTime: '5 min read',
    image: '/src/assets/images/berlin_bundestag_plenary_1792380322998.jpg',
    caption: 'The German Bundestag chamber in Berlin during the roll-call vote approving the Core Hydrogen Network Act.',
    priority: 'standard',
    sourceAgency: 'Deutsche Welle (DW)',
    sourceCountry: 'Germany',
    sourceUrl: 'https://www.dw.com/en/germany-bundestag-hydrogen-act-2026',
    tags: ['Germany', 'Bundestag', 'Berlin', 'Clean Energy', 'DW', 'Industry', 'Hydrogen'],
    keyTakeaways: [
      'Repurposes 60% of existing natural gas pipes while constructing 3,800km of new high-pressure lines.',
      'Guarantees competitive wholesale green hydrogen pricing for domestic chemical and steel mills.',
      'Directly links North Sea offshore wind farms to southern German industrial centers.',
    ],
    leadParagraph: 'With a decisive cross-party majority in Berlin, German parliamentarians enacted the Core Hydrogen Network Act, setting up Europe’s largest clean industrial transmission spine to sustain domestic heavy manufacturing.',
    bodyParagraphs: [
      'The statutory measure repurposes existing natural gas lines while adding high-pressure pipelines to channel Baltic and North Sea offshore wind power straight into chemical and steel furnaces.',
      'Ministers described the outcome as a structural defense of Germany’s industrial foundation amid shifting global energy dynamics, preserving hundreds of thousands of high-wage engineering jobs.',
    ],
  },
  {
    id: 'art-standard-2',
    title: 'Democratic Voter Verification: International Observers Certify Unified Sovereign Cryptographic Audit Architecture',
    deck: 'Cryptographic offline verification and verifiable paper audit trails deployed across 380,000 polling stations to guarantee zero-tamper election integrity.',
    category: 'Elections 2026',
    author: 'Rachel Chen & Anandita Roy',
    authorRole: 'Chief Political & Electoral Analysts',
    date: CURRENT_DATE_FORMATTED + ' · 08:15 EST',
    readTime: '6 min read',
    image: '/src/assets/images/india_election_rally_crowd_1792380255382.jpg',
    caption: 'Enthusiastic citizens and polling monitors gather during voter awareness rallies and digital audit demonstrations.',
    priority: 'standard',
    sourceAgency: 'The Guardian',
    sourceCountry: 'United Kingdom (UK)',
    sourceUrl: 'https://www.theguardian.com/politics/elections-2026-audit-architecture',
    tags: ['Elections 2026', 'Democracy', 'Voter Roll', 'Audit Trail', 'The Guardian', 'Election Integrity'],
    keyTakeaways: [
      'Zero wireless or network connection on standalone voter verification audit terminals.',
      'Bipartisan observer certification conducted across all 50 states and international oversight missions.',
      'Cryptographic hash verification ensures total transparency with physical ballot reconciliation.',
    ],
    leadParagraph: 'Electoral authorities and independent democracy monitoring coalitions have unveiled an end-to-end cryptographic verification system, establishing an impenetrable audit barrier against any external network intrusion or duplicate registration.',
    bodyParagraphs: [
      'Representatives from all recognized political parties inspected the standalone counting units, certifying that zero wireless hardware exists on voter verification terminals.',
      'Civic organizations praised the transparency, noting that verified paper receipts combined with open-source cryptographic audit trees remain the gold standard for democratic legitimacy.',
    ],
  },
  {
    id: 'art-standard-3',
    title: 'The Sovereign Compute Directive: National Security Pre-Clearance Mandated for Advanced GPU Clusters',
    deck: 'New tech security rules mandate national security audits for any high-compute accelerator cluster exported beyond approved allied trade networks.',
    category: 'Geopolitics',
    author: 'Antoine Moreau',
    authorRole: 'Technology & Geopolitics Correspondent',
    date: CURRENT_DATE_FORMATTED + ' · 07:40 EST',
    readTime: '5 min read',
    image: '/src/assets/images/semiconductor_cleanroom_1792002503650.jpg',
    caption: 'Engineers monitor cleanroom semiconductor fabrication and advanced packaging lines inside the sovereign compute hub.',
    priority: 'standard',
    sourceAgency: 'Politico',
    sourceCountry: 'United States (USA)',
    sourceUrl: 'https://www.politico.com/news/tech-export-security-directive-2026',
    tags: ['Artificial Intelligence', 'Export Controls', 'Semiconductors', 'Politico', 'Cleanroom', 'Tech Sovereignty'],
    keyTakeaways: [
      'Mandatory pre-export verification for clusters exceeding 100,000 teraflops compute density.',
      'Allied compliance treaty signed by 18 semiconductor-producing nations.',
      'Exemptions created for verified academic cancer and climate research consortia.',
    ],
    leadParagraph: 'Allied economic and security councils unveiled an exhaustive framework classifying frontier artificial intelligence compute clusters as strategic dual-use assets subject to mandatory sovereign pre-clearance.',
    bodyParagraphs: [
      'The directive effectively aligns export policy across North America, Europe, and Asia-Pacific partners, closing regulatory loopholes that allowed intermediary entities to route strategic chipsets through third-party transit hubs.',
      'Tech industry leaders testified that statutory clarity shields long-term R&D investments while preserving technological leadership and preventing sensitive silicon leakage.',
    ],
  },
  {
    id: 'art-standard-4',
    title: 'Geneva Trade Panel Verdict: Binding 45-Day Arbitration Resolves Clean Tech Subsidy Gridlock',
    deck: 'Expedited dispute resolution tribunal issues landmark ruling upholding reciprocal rules of origin for battery and green technology supply chains.',
    category: 'Global Summits',
    author: 'Sarah Jenkins',
    authorRole: 'International Trade Correspondent',
    date: CURRENT_DATE_FORMATTED + ' · 07:10 CET',
    readTime: '6 min read',
    image: '/src/assets/images/geneva_trade_summit_1792380631472.jpg',
    caption: 'Diplomatic delegations and trade envoys at the multilateral Geneva Trade Summit conference hall.',
    priority: 'standard',
    sourceAgency: 'Euronews',
    sourceCountry: 'France / European Union',
    sourceUrl: 'https://www.euronews.com/business/geneva-trade-subsidy-verdict-2026',
    tags: ['Geneva Summit', 'Trade Arbitrations', 'Clean Tech', 'Euronews', 'Global Summits', 'Tariffs'],
    keyTakeaways: [
      'Tribunal upholds reciprocal tax credit eligibility for batteries made in treaty-partner nations.',
      'Averts threatened retaliatory tariffs on automotive and aerospace component exports.',
      'Establishes permanent multilateral consultative mechanism for emerging green technologies.',
    ],
    leadParagraph: 'Delivering its first expedited ruling under the new Transatlantic mechanism, the Geneva trade council established definitive parameters for reciprocal clean energy subsidies, averting what had threatened to become a costly trade dispute.',
    bodyParagraphs: [
      'The verdict eliminates multi-billion dollar tariff uncertainties that had hovered over automotive battery and industrial wind turbine manufacturers operating across allied borders.',
      'Ministers issuing a joint communiqué emphasized that rule-based democratic commerce is essential for preventing fragmented protectionist spirals and ensuring rapid deployment of decarbonization hardware.',
    ],
  },
  {
    id: 'art-standard-5',
    title: 'Judicial Supremacy: Supreme Court Hears Landmark Challenge on Interstate Digital Commerce and Regulation',
    deck: 'Oral arguments underway in high-stakes controversy testing federal Commerce Clause supremacy against conflicting state digital compliance acts.',
    category: 'White House & Congress',
    author: 'Miriam Goldstein',
    authorRole: 'Legal Affairs Correspondent',
    date: CURRENT_DATE_FORMATTED + ' · 06:30 EST',
    readTime: '5 min read',
    image: '/src/assets/images/supreme_court_bench_1792002466101.jpg',
    caption: 'The Supreme Court of the United States chamber ahead of landmark constitutional arguments.',
    priority: 'standard',
    sourceAgency: 'The Washington Post',
    sourceCountry: 'United States (USA)',
    sourceUrl: 'https://www.washingtonpost.com/politics/supreme-court-digital-commerce-2026',
    tags: ['Supreme Court', 'Constitutional Law', 'Commerce Clause', 'WaPo', 'Judicial Review'],
    keyTakeaways: [
      'Case consolidates legal challenges from 22 states testing preemption under federal interstate commerce statutes.',
      'Question centers on whether individual state data mandates impose unconstitutional burdens on cross-border cloud logistics.',
      'Ruling anticipated to establish the definitive national boundary for digital economic regulation.',
    ],
    leadParagraph: 'The Supreme Court heard oral arguments this morning in a pivotal consolidated lawsuit testing whether individual states can penalize out-of-state digital platforms under localized mandates.',
    bodyParagraphs: [
      'Advocates argued that a fragmented regulatory patchwork imposes unconstitutional friction on interstate commercial logistics and cloud backbones, advocating for a uniform federal standard.',
      'A ruling is expected before summer recess, with profound implications for digital commerce, privacy law harmonization, and national regulatory enforcement nationwide.',
    ],
  },
  {
    id: 'art-energy-1',
    title: 'Transatlantic 50GW Supergrid: Offshore Wind Interconnectors Reach Final Financial Authorization',
    deck: 'Eight-nation clean energy consortium seals binding agreements for subsea high-voltage direct current lines linking North Sea arrays with continental grids.',
    category: 'Economy & Trade',
    author: 'Greta Lindholm',
    authorRole: 'Energy Infrastructure Editor',
    date: CURRENT_DATE_FORMATTED + ' · 06:00 CET',
    readTime: '6 min read',
    image: '/src/assets/images/clean_energy_offshore_1792002484185.jpg',
    caption: 'Deep-water wind turbine arrays and substation platform anchoring the clean energy transmission corridor.',
    priority: 'standard',
    sourceAgency: 'Bloomberg News',
    sourceCountry: 'United States (USA)',
    sourceUrl: 'https://www.bloomberg.com/news/articles/2026-11-03/north-sea-supergrid-accord',
    tags: ['Clean Energy', 'Offshore Wind', 'HVDC Supergrid', 'Bloomberg', 'Europe', 'Infrastructure'],
    keyTakeaways: [
      'Eight participating European nations guarantee capital backing for 50GW subsea HVDC interconnector network.',
      'Reduces continental electricity spot price volatility by up to 32% during winter peak demand.',
      'Enables rapid cross-border power wheeling with line losses strictly constrained under 2.8%.',
    ],
    leadParagraph: 'Energy ministers and grid operators gathered in Copenhagen to authorize final construction contracts for the largest integrated offshore HVDC transmission system ever conceived.',
    bodyParagraphs: [
      'The multi-billion euro corridor will channel deep-water wind power across northern industrial corridors with line losses kept strictly below 3 percent, ensuring stable baseload electricity for green steel manufacturing.',
      'Engineers noted that instant cross-border wheeling capacity will dampen regional wholesale electricity volatility and provide an enduring structural buffer against global fossil-fuel supply shocks.',
    ],
  },
];

export const BILLS_DATA: BillItem[] = [
  {
    id: 'bill-1',
    billNumber: 'S. 4102',
    title: 'Transatlantic Industrial & Energy Security Compact Act',
    chamber: 'U.S. Senate',
    status: 'Floor Debate',
    oddsOfPassage: 82,
    voteEstimate: { yeas: 66, nays: 31, undecided: 3 },
    sponsors: ['Sen. Elizabeth Warren (D-MA)', 'Sen. Todd Young (R-IN)', 'Sen. Mark Warner (D-VA)'],
    summary: 'Codifies reciprocal mineral processing standards and establishes federal oversight for critical industrial supply chain exemptions under allied trade agreements.',
    nextMilestone: 'Full Senate Cloture Vote scheduled for Thursday, 10:00 AM EST.',
  },
  {
    id: 'bill-2',
    billNumber: 'H.R. 7820',
    title: 'National Frontier Computing Infrastructure & Sovereign AI Reserve Act',
    chamber: 'House of Representatives',
    status: 'Committee Markup',
    oddsOfPassage: 71,
    voteEstimate: { yeas: 248, nays: 172, undecided: 15 },
    sponsors: ['Rep. Ro Khanna (D-CA)', 'Rep. Mike Gallagher (R-WI)'],
    summary: 'Mandates end-use monitoring for advanced GPU export licenses and creates a federal research compute reserve accessible to domestic academic and medical institutions.',
    nextMilestone: 'House Science & Commerce Committee final vote on reported amendments.',
  },
  {
    id: 'bill-3',
    billNumber: 'S. 3911',
    title: 'Bipartisan Campaign Transparency & Foreign Digital Ad Modernization Act',
    chamber: 'U.S. Senate',
    status: 'Bipartisan Reconciliation',
    oddsOfPassage: 65,
    voteEstimate: { yeas: 58, nays: 40, undecided: 2 },
    sponsors: ['Sen. Amy Klobuchar (D-MN)', 'Sen. Lindsey Graham (R-SC)'],
    summary: 'Requires commercial digital ad platforms to maintain public disclosure archives for political issue advertising funded by foreign-linked entities.',
    nextMilestone: 'Joint conference committee drafting final statutory compromise text.',
  },
  {
    id: 'bill-4',
    billNumber: 'H.R. 8105',
    title: 'Strategic Maritime Logistics & Deep-Water Port Modernization Act',
    chamber: 'House of Representatives',
    status: 'Signed into Law',
    oddsOfPassage: 100,
    voteEstimate: { yeas: 356, nays: 74, undecided: 0 },
    sponsors: ['Rep. Peter DeFazio (D-OR)', 'Rep. Sam Graves (R-MO)'],
    summary: 'Authorizes $28 billion over five fiscal years for deep-water port automation, channel dredging, and cybersecurity hardening against hostile intrusion.',
    nextMilestone: 'Federal Maritime Commission begins rulemaking notice period.',
  },
];

export const OPINION_COLUMNS: OpinionColumn[] = [
  {
    id: 'op-1',
    author: 'Amb. Julian Richter',
    role: 'Former Assistant Secretary of State for European & Eurasian Affairs',
    columnTitle: 'The Diplomatic Lens',
    headline: 'Why Sovereign Trade Guarantees Still Dictate the Terms of Modern Alliances',
    quote: 'Diplomacy without industrial stamina is merely theater. What the New Delhi accord proves is that national security in this century is forged in semiconductor foundries and lithium refineries, not in polite communiqué banquets.',
    date: CURRENT_DATE_FORMATTED + '',
    readTime: '4 min read',
    initials: 'JR',
  },
  {
    id: 'op-2',
    author: 'Sarah Jenkins',
    role: 'Senior Congressional Analyst & Capitol Hill Bureau Chief Emeritus',
    columnTitle: 'The Hill Whispers',
    headline: 'The Quiet Realignment Inside the Senate Appropriations Cloakroom',
    quote: 'Behind the televised posturing, seasoned committee members are quietly assembling three-digit majorities on discrete infrastructure riders. Pragmatism is not dead; it has merely learned to whisper.',
    date: CURRENT_DATE_FORMATTED + '',
    readTime: '5 min read',
    initials: 'SJ',
  },
  {
    id: 'op-3',
    author: 'Dr. Aris Thorne',
    role: 'Fellow at the Institute for Geoeconomic Studies & Macroeconomic Policy',
    columnTitle: 'Economic Statecraft',
    headline: 'Central Banks Are Geopolitical Actors Whether They Like It or Not',
    quote: 'The illusion of pure technocratic monetary isolation has dissolved. When interest rate differentials determine the speed of sovereign clean energy transitions, every basis point is inherently a foreign policy calculation.',
    date: CURRENT_DATE_FORMATTED + '',
    readTime: '6 min read',
    initials: 'AT',
  },
];

export const POLL_DATA = {
  id: 'poll-2026-w44',
  question: 'Should democratic nations establish an automated sovereign strategic mineral reserve to insulate global supply chains from geopolitical embargoes?',
  description: 'As G20 and G7 trade ministers finalize tariff and mineral regulations in New Delhi and Geneva, international debate is intensifying over whether multinational strategic stockpiles safeguard manufacturing or distort open commodity markets.',
  totalVotes: 44210,
  options: [
    { id: 'opt-1', label: 'Yes — essential to prevent mineral extortion and protect clean tech jobs', percentage: 58, votes: 25642 },
    { id: 'opt-2', label: 'No — risks market distortions, trade retaliation, and bloated inventory costs', percentage: 28, votes: 12379 },
    { id: 'opt-3', label: 'Conditional — only if coupled with transparent multilateral audit rules', percentage: 14, votes: 6189 },
  ],
};
