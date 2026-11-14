export interface TranscriptSegment {
  time: string;
  seconds: number;
  speaker: string;
  text: string;
}

export interface PodcastEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  series: string;
  host: string;
  hostRole: string;
  date: string;
  durationSeconds: number;
  durationFormatted: string;
  description: string;
  topics: string[];
  keyQuotes: string;
  transcriptSample: TranscriptSegment[];
}

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: 'pod-1',
    episodeNumber: 142,
    title: 'Morning Global Briefing: The Brussels Tariff Settlement',
    series: 'Daily Dispatch',
    host: 'Eleanor Vance',
    hostRole: 'Chief Diplomatic Correspondent',
    date: 'October 14, 2026',
    durationSeconds: 150, // 2:30 spoken duration
    durationFormatted: '02:30',
    description: 'Inside the pre-dawn G7 clean tech subsidy compromise in Brussels, overnight Senate cloture maneuvers on Capitol Hill, and the state department’s clarified maritime freedom doctrine.',
    topics: ['G7 Accord', 'Senate Cloture', 'Subsidies Cap', 'Pacific Logistics'],
    keyQuotes: 'The twelve percent subsidy ceiling nullifies dozens of active trade grievances before dawn.',
    transcriptSample: [
      {
        time: '00:00',
        seconds: 0,
        speaker: 'Announcer',
        text: 'Politics World Daily Dispatch. Episode 142: Morning Global Briefing with Chief Diplomatic Correspondent Eleanor Vance.'
      },
      {
        time: '00:10',
        seconds: 10,
        speaker: 'Eleanor Vance',
        text: 'Good morning from Washington. We lead today with the late-breaking pre-dawn accord reached between White House economic envoys and European Union trade directors in Brussels.'
      },
      {
        time: '00:30',
        seconds: 30,
        speaker: 'Eleanor Vance',
        text: 'Following three grueling days of closed-door sessions, negotiators established an across-the-board twelve percent subsidy ceiling on clean energy technologies and critical minerals.'
      },
      {
        time: '00:52',
        seconds: 52,
        speaker: 'Marcus Sterling',
        text: 'The core breakthrough revolves around origin definitions. By recognizing processed critical minerals equally across allied partner jurisdictions, supply chain friction drops overnight.'
      },
      {
        time: '01:14',
        seconds: 74,
        speaker: 'Eleanor Vance',
        text: 'On Capitol Hill, Senate leadership has already pledged an expedited floor vote for statutory ratification this Thursday, with both party whips projecting a comfortable majority.'
      },
      {
        time: '01:36',
        seconds: 96,
        speaker: 'Marcus Sterling',
        text: 'Key members of the Senate Finance Committee affirmed this morning that the compromise effectively averts retaliatory tariffs ahead of the fiscal quarter deadline.'
      },
      {
        time: '01:58',
        seconds: 118,
        speaker: 'Eleanor Vance',
        text: 'As financial markets open, sovereign bonds in Paris and Tokyo have rallied on the news. This is Eleanor Vance for Politics World. Stay tuned for further bulletins.'
      }
    ],
  },
  {
    id: 'pod-2',
    episodeNumber: 88,
    title: 'The 2026 Policy Breakdown: Transatlantic Compact',
    series: 'In-Depth Statutory Analysis',
    host: 'Marcus Sterling & Sarah Jenkins',
    hostRole: 'Senior Legislative & Trade Analysts',
    date: 'October 13, 2026',
    durationSeconds: 165, // 2:45
    durationFormatted: '02:45',
    description: 'A deep-dive dissection of the Transatlantic Industrial Compact: the Geneva dispute arbitration mechanism, critical mineral origin thresholds, and congressional committee dynamics.',
    topics: ['Statutory Analysis', 'Geneva Arbitration', 'Finance Committee', 'Clean Energy Tax Credits'],
    keyQuotes: 'When tax code definitions intersect with national security export lists, standard lobbying playbooks collapse.',
    transcriptSample: [
      {
        time: '00:00',
        seconds: 0,
        speaker: 'Announcer',
        text: 'Politics World In-Depth Statutory Analysis. Episode 88: The 2026 Policy Breakdown, featuring Marcus Sterling and Sarah Jenkins.'
      },
      {
        time: '00:11',
        seconds: 11,
        speaker: 'Marcus Sterling',
        text: 'Welcome to The Policy Breakdown. Today we are walking line by line through all forty-six pages of the newly released statutory text of the Transatlantic Industrial Compact.'
      },
      {
        time: '00:32',
        seconds: 32,
        speaker: 'Sarah Jenkins',
        text: 'Pay close attention to Section Four. It establishes an automated dispute resolution panel in Geneva that operates under a strictly enforced forty-five day adjudication deadline.'
      },
      {
        time: '00:54',
        seconds: 54,
        speaker: 'Marcus Sterling',
        text: 'That immediately eliminates the multi-year stalemate loopholes that previously crippled cross-border investments in battery gigafactories and offshore wind.'
      },
      {
        time: '01:16',
        seconds: 76,
        speaker: 'Sarah Jenkins',
        text: 'Notice also that tax code definitions now directly intersect with national security export control lists, completely overturning conventional lobbying playbooks.'
      },
      {
        time: '01:38',
        seconds: 98,
        speaker: 'Marcus Sterling',
        text: 'The statutory implementation clock officially starts the moment the President signs the legislation. We will be tracking the regulatory rulemaking schedule closely.'
      }
    ],
  },
  {
    id: 'pod-3',
    episodeNumber: 54,
    title: 'Capitol Cloakroom Confidential: Midnight Cloture',
    series: 'Behind the Gavel',
    host: 'Julian Barnes',
    hostRole: 'Congressional Bureau Chief',
    date: 'October 12, 2026',
    durationSeconds: 155, // 2:35
    durationFormatted: '02:35',
    description: 'Behind closed mahogany doors as the midnight government funding cliff approached: how a quiet bipartisan Senate coalition locked down seventy-four votes with hours to spare.',
    topics: ['Appropriations', 'Continuing Resolution', 'Filibuster Math', 'Disaster Relief'],
    keyQuotes: 'Behind the televised posturing, seasoned committee members were quietly assembling three-digit majorities.',
    transcriptSample: [
      {
        time: '00:00',
        seconds: 0,
        speaker: 'Announcer',
        text: 'Politics World Behind the Gavel. Episode 54: Capitol Cloakroom Confidential, reported by Congressional Bureau Chief Julian Barnes.'
      },
      {
        time: '00:10',
        seconds: 10,
        speaker: 'Julian Barnes',
        text: 'It was 11:15 PM under the Capitol rotunda when the decisive cloture motion cleared the cloakroom. Here is how that final bipartisan compromise crystallized.'
      },
      {
        time: '00:31',
        seconds: 31,
        speaker: 'Julian Barnes',
        text: 'Behind closed mahogany doors, senior appropriators assembled a seventy-four vote Senate supermajority with barely three hours remaining before the midnight funding cliff.'
      },
      {
        time: '00:53',
        seconds: 53,
        speaker: 'Julian Barnes',
        text: 'The pivotal breakthrough came when negotiators carved out sixteen billion dollars in emergency agricultural flood relief, decoupling it from contentious defense expenditure caps.'
      },
      {
        time: '01:15',
        seconds: 75,
        speaker: 'Julian Barnes',
        text: 'While television cameras broadcasted fierce partisan rhetoric on the steps outside, seasoned committee veterans were methodically counting votes aisle by aisle.'
      },
      {
        time: '01:36',
        seconds: 96,
        speaker: 'Julian Barnes',
        text: 'With the continuing resolution signed into law, the federal government enters the new fiscal year with uninterrupted funding stability. This is Julian Barnes on Capitol Hill.'
      }
    ],
  },
  {
    id: 'pod-4',
    episodeNumber: 39,
    title: 'The Diplomatic Dispatch: Hardware Statecraft',
    series: 'Global Statecraft',
    host: 'Amb. Julian Richter',
    hostRole: 'Senior Fellow & Former Assistant Secretary',
    date: 'October 10, 2026',
    durationSeconds: 160, // 2:40
    durationFormatted: '02:40',
    description: 'Why modern bilateral alliances are forged in lithium refineries, semiconductor fabrication foundries, and deep-water container ports rather than traditional ceremonial communiqués.',
    topics: ['Statecraft', 'Semiconductors', 'Lithium Supply Chains', 'Indo-Pacific'],
    keyQuotes: 'Diplomacy without industrial stamina is merely theater.',
    transcriptSample: [
      {
        time: '00:00',
        seconds: 0,
        speaker: 'Announcer',
        text: 'Politics World Global Statecraft. Episode 39: The Diplomatic Dispatch with Ambassador Julian Richter.'
      },
      {
        time: '00:10',
        seconds: 10,
        speaker: 'Julian Richter',
        text: 'In twenty-first century statecraft, we used to measure diplomatic weight by ceremonial treaty signatures. Today, we measure it by foundry throughput and sovereign grid resilience.'
      },
      {
        time: '00:32',
        seconds: 32,
        speaker: 'Julian Richter',
        text: 'Modern bilateral alliances are no longer forged in palace banquet halls. They are hammered out in lithium refineries, semiconductor fabs, and deep-water container terminals.'
      },
      {
        time: '00:54',
        seconds: 54,
        speaker: 'Julian Richter',
        text: 'The new Pacific logistics security pact demonstrates that shipping container turnaround speed is now an active instrument of geopolitical deterrence.'
      },
      {
        time: '01:16',
        seconds: 76,
        speaker: 'Julian Richter',
        text: 'As foreign ministers conclude their multilateral summit, remember this reality: diplomacy without industrial stamina is merely theater. Thank you for listening.'
      }
    ],
  },
  {
    id: 'pod-5',
    episodeNumber: 143,
    title: 'The New Delhi Digital Corridor: Semiconductor Independence & Quad Diplomacy',
    series: 'South Asia Strategic Dispatch',
    host: 'Vikramaditya Sharma & Eleanor Vance',
    hostRole: 'Senior Geopolitical & Tech Correspondents',
    date: 'Live Today Edition',
    durationSeconds: 155,
    durationFormatted: '02:35',
    description: 'Inside the Indian Parliament’s passage of the $15B Semiconductor Mission, New Delhi’s bilateral digital security accords with the US and EU, and the Quad naval intelligence network.',
    topics: ['India Tech Mission', 'Semiconductors', 'New Delhi', 'Quad Alliance', 'Digital Public Infrastructure'],
    keyQuotes: 'When digital public infrastructure scales across a billion citizens, sovereign semiconductor fabrication becomes a strategic imperative.',
    transcriptSample: [
      {
        time: '00:00',
        seconds: 0,
        speaker: 'Announcer',
        text: 'Politics World South Asia Strategic Dispatch. Episode 143: The New Delhi Digital Corridor with Vikramaditya Sharma and Eleanor Vance.'
      },
      {
        time: '00:10',
        seconds: 10,
        speaker: 'Vikramaditya Sharma',
        text: 'Good evening from New Delhi. Today Parliament completed statutory enactment of the historic fifteen billion dollar Semiconductor and Quantum Shield Act.'
      },
      {
        time: '00:30',
        seconds: 30,
        speaker: 'Vikramaditya Sharma',
        text: 'With three commercial fabrication plants sanctioned in Gujarat and Assam, India anchors a sovereign silicon manufacturing corridor connecting the Global South to western allied markets.'
      },
      {
        time: '00:52',
        seconds: 52,
        speaker: 'Eleanor Vance',
        text: 'In Washington and Brussels, trade envoys welcomed the breakthrough, noting that diversified chip packaging protects against single-chokepoint supply chain freezes.'
      },
      {
        time: '01:14',
        seconds: 74,
        speaker: 'Vikramaditya Sharma',
        text: 'Simultaneously, the Quad maritime agreement guarantees encrypted radar data sharing from the Strait of Malacca to the Arabian Sea, ensuring open commercial navigation.'
      },
      {
        time: '01:36',
        seconds: 96,
        speaker: 'Eleanor Vance',
        text: 'As global technology leaders expand investments in Bengaluru and Noida, this marks an unprecedented inflection point for twenty-first century industrial statecraft.'
      },
      {
        time: '01:58',
        seconds: 118,
        speaker: 'Vikramaditya Sharma',
        text: 'This is Vikramaditya Sharma with Eleanor Vance for Politics World. Stay tuned for continuous hourly dispatches.'
      }
    ],
  },
];
