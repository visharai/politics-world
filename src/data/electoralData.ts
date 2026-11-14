export interface BattlegroundRace {
  id: string;
  state: string;
  stateCode: string;
  currentLean: 'Democratic' | 'Republican' | 'Toss-Up';
  pollingMargin: number; // positive = Dem lead, negative = Rep lead
  incumbent: string;
  incumbentParty: 'Democratic' | 'Republican' | 'Independent';
  challenger: string;
  challengerParty: 'Democratic' | 'Republican';
  primaryIssue: string;
  electoralWeight: number; // 1 Senate seat
  turnoutProjection: string;
  recentDebateSummary: string;
}

export const BATTLEGROUND_RACES: BattlegroundRace[] = [
  {
    id: 'race-pa',
    state: 'Pennsylvania',
    stateCode: 'PA',
    currentLean: 'Toss-Up',
    pollingMargin: 0.8,
    incumbent: 'Bob Casey (D)',
    incumbentParty: 'Democratic',
    challenger: 'Dave McCormick (R)',
    challengerParty: 'Republican',
    primaryIssue: 'Manufacturing subsidies & Natural gas infrastructure',
    electoralWeight: 1,
    turnoutProjection: 'High (68% estimated)',
    recentDebateSummary: 'Both candidates clashed over energy export permits and suburban tax deductibility for dependent care.',
  },
  {
    id: 'race-az',
    state: 'Arizona',
    stateCode: 'AZ',
    currentLean: 'Toss-Up',
    pollingMargin: -0.4,
    incumbent: 'Ruben Gallego (D)',
    incumbentParty: 'Democratic',
    challenger: 'Kari Lake (R)',
    challengerParty: 'Republican',
    primaryIssue: 'Colorado River water rights & Border commerce logistics',
    electoralWeight: 1,
    turnoutProjection: 'High (65% estimated)',
    recentDebateSummary: 'Heated exchanges on groundwater pumping limits and semiconductor fabrication facility tax abatements.',
  },
  {
    id: 'race-ga',
    state: 'Georgia',
    stateCode: 'GA',
    currentLean: 'Democratic',
    pollingMargin: 2.1,
    incumbent: 'Jon Ossoff (D)',
    incumbentParty: 'Democratic',
    challenger: 'Brian Kemp (R)',
    challengerParty: 'Republican',
    primaryIssue: 'Clean energy battery corridor & Rural hospital solvency',
    electoralWeight: 1,
    turnoutProjection: 'Record (71% estimated)',
    recentDebateSummary: 'Economic metrics took center stage, with discussion centering on federal electric vehicle battery plant grants.',
  },
  {
    id: 'race-wi',
    state: 'Wisconsin',
    stateCode: 'WI',
    currentLean: 'Toss-Up',
    pollingMargin: 1.2,
    incumbent: 'Tammy Baldwin (D)',
    incumbentParty: 'Democratic',
    challenger: 'Eric Hovde (R)',
    challengerParty: 'Republican',
    primaryIssue: 'Dairy trade parity & Agricultural supply chain costs',
    electoralWeight: 1,
    turnoutProjection: 'High (69% estimated)',
    recentDebateSummary: 'Focus on domestic procurement mandates and federal dairy price stabilization mechanisms.',
  },
  {
    id: 'race-oh',
    state: 'Ohio',
    stateCode: 'OH',
    currentLean: 'Republican',
    pollingMargin: -1.9,
    incumbent: 'Sherrod Brown (D)',
    incumbentParty: 'Democratic',
    challenger: 'Bernie Moreno (R)',
    challengerParty: 'Republican',
    primaryIssue: 'Steel tariffs & Rail safety regulatory standards',
    electoralWeight: 1,
    turnoutProjection: 'Moderate (63% estimated)',
    recentDebateSummary: 'Intense cross-examination regarding freight train hazardous material routing and steel import quotas.',
  },
  {
    id: 'race-nv',
    state: 'Nevada',
    stateCode: 'NV',
    currentLean: 'Toss-Up',
    pollingMargin: -0.2,
    incumbent: 'Jacky Rosen (D)',
    incumbentParty: 'Democratic',
    challenger: 'Sam Brown (R)',
    challengerParty: 'Republican',
    primaryIssue: 'Hospitality union wage rules & Federal public land solar leases',
    electoralWeight: 1,
    turnoutProjection: 'Moderate (61% estimated)',
    recentDebateSummary: 'Dispute over federal water reclamation allocations and culinary service gratuity taxation laws.',
  },
];
