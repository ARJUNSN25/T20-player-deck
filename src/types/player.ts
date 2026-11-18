export type Contingent = 'batsman' | 'bowler';

export type PhaseKey = 'powerplay' | 'middle' | 'death';

export interface PrimaryKpi {
  label: string;
  value: string;
  sublabel?: string;
}

export interface PhaseRole {
  phase: PhaseKey;
  overs: string;
  title: string;
  intensity: number; // 1 to 100 tactical deployment weighting
}

export interface HistoricalMilestone {
  year: string;
  event: string;
  statHighlight: string;
  format: 'IPL' | 'T20I' | 'Global T20';
}

export interface CareerSplitMetrics {
  overallInnings: number;
  overallMatches: number;
  overallInningsLabel: string;
  overallMatchesLabel: string;
  overallRuns: number | null;
  overallAvg: number | null;
  overallStrikeRate: number | null;
  overallWickets: number | null;
  overallEconomy: number | null;
  overallBowlingAvg: number | null;
  centuries: number | null;
  fifties: number | null;

  iplInnings: number;
  iplMatches: number;
  iplRuns: number | null;
  iplAvg: number | null;
  iplStrikeRate: number | null;
  iplWickets: number | null;
  iplEconomy: number | null;
  iplBowlingAvg: number | null;
  iplBbi: string | null;
  iplPeakNote: string | null;

  t20iInnings: number;
  t20iMatches: number;
  t20iRuns: number | null;
  t20iAvg: number | null;
  t20iStrikeRate: number | null;
  t20iWickets: number | null;
  t20iEconomy: number | null;
  t20iBowlingAvg: number | null;
  t20iBbi: string | null;
}

export interface PlayerProfile {
  id: string;
  rank: number;
  slideNumber: number;
  name: string;
  country: string;
  contingent: Contingent;
  isCoreAnchor: boolean;
  tacticalRole: string;
  shortRole: string;
  imagePath: string;
  imageSource: string;
  primaryKpis: [PrimaryKpi, PrimaryKpi, PrimaryKpi, PrimaryKpi];
  iplBenchmarkSummary: string;
  t20iBenchmarkSummary: string;
  metrics: CareerSplitMetrics;
  phases: [PhaseRole, PhaseRole, PhaseRole];
  rationale: [string, string, string];
  pedigree: string[];
  milestones: HistoricalMilestone[];
  primaryPhases: PhaseKey[];
}

export type LeaderboardCategory = 'batting' | 'bowling' | 'experience';

export type LeaderboardMetricId =
  | 'overallRuns'
  | 'iplRuns'
  | 't20iRuns'
  | 'iplStrikeRate'
  | 't20iStrikeRate'
  | 'iplAvg'
  | 'overallWickets'
  | 'iplWickets'
  | 't20iWickets'
  | 'overallEconomy'
  | 't20iEconomy'
  | 't20iBowlingAvg'
  | 'overallInnings'
  | 'overallMatches';

export interface LeaderboardMetricDefinition {
  id: LeaderboardMetricId;
  label: string;
  shortLabel: string;
  category: LeaderboardCategory;
  higherIsBetter: boolean;
  unit: string;
  decimals: number;
}
