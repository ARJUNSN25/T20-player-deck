import {
  Contingent,
  LeaderboardMetricDefinition,
  LeaderboardMetricId,
  PhaseKey,
  PlayerProfile,
} from '../types/player';

export const LEADERBOARD_METRICS: LeaderboardMetricDefinition[] = [
  {
    id: 'overallRuns',
    label: 'Overall T20 Runs',
    shortLabel: 'T20 Runs',
    category: 'batting',
    higherIsBetter: true,
    unit: 'runs',
    decimals: 0,
  },
  {
    id: 'iplRuns',
    label: 'IPL Career Runs',
    shortLabel: 'IPL Runs',
    category: 'batting',
    higherIsBetter: true,
    unit: 'runs',
    decimals: 0,
  },
  {
    id: 't20iRuns',
    label: 'T20I Career Runs',
    shortLabel: 'T20I Runs',
    category: 'batting',
    higherIsBetter: true,
    unit: 'runs',
    decimals: 0,
  },
  {
    id: 'iplStrikeRate',
    label: 'IPL Strike Rate',
    shortLabel: 'IPL SR',
    category: 'batting',
    higherIsBetter: true,
    unit: 'SR',
    decimals: 2,
  },
  {
    id: 't20iStrikeRate',
    label: 'T20I Strike Rate',
    shortLabel: 'T20I SR',
    category: 'batting',
    higherIsBetter: true,
    unit: 'SR',
    decimals: 2,
  },
  {
    id: 'iplAvg',
    label: 'IPL Batting Average',
    shortLabel: 'IPL Avg',
    category: 'batting',
    higherIsBetter: true,
    unit: 'avg',
    decimals: 2,
  },
  {
    id: 'overallWickets',
    label: 'Overall T20 Wickets',
    shortLabel: 'T20 Wkts',
    category: 'bowling',
    higherIsBetter: true,
    unit: 'wkts',
    decimals: 0,
  },
  {
    id: 'iplWickets',
    label: 'IPL Career Wickets',
    shortLabel: 'IPL Wkts',
    category: 'bowling',
    higherIsBetter: true,
    unit: 'wkts',
    decimals: 0,
  },
  {
    id: 't20iWickets',
    label: 'T20I Wickets',
    shortLabel: 'T20I Wkts',
    category: 'bowling',
    higherIsBetter: true,
    unit: 'wkts',
    decimals: 0,
  },
  {
    id: 'overallEconomy',
    label: 'Career T20 Economy',
    shortLabel: 'T20 Econ',
    category: 'bowling',
    higherIsBetter: false,
    unit: 'econ',
    decimals: 2,
  },
  {
    id: 't20iEconomy',
    label: 'T20I Economy',
    shortLabel: 'T20I Econ',
    category: 'bowling',
    higherIsBetter: false,
    unit: 'econ',
    decimals: 2,
  },
  {
    id: 't20iBowlingAvg',
    label: 'T20I Bowling Average',
    shortLabel: 'T20I Bowl Avg',
    category: 'bowling',
    higherIsBetter: false,
    unit: 'avg',
    decimals: 2,
  },
  {
    id: 'overallInnings',
    label: 'Overall T20 Innings',
    shortLabel: 'T20 Inns',
    category: 'experience',
    higherIsBetter: true,
    unit: 'inns',
    decimals: 0,
  },
  {
    id: 'overallMatches',
    label: 'Overall T20 Matches',
    shortLabel: 'T20 Matches',
    category: 'experience',
    higherIsBetter: true,
    unit: 'matches',
    decimals: 0,
  },
];

export interface FilterCriteria {
  contingent: 'all' | Contingent;
  phase: 'all' | PhaseKey;
  query: string;
}

export function filterPlayers(players: PlayerProfile[], criteria: FilterCriteria): PlayerProfile[] {
  const normalizedQuery = criteria.query.trim().toLowerCase();
  return players.filter((player) => {
    if (criteria.contingent !== 'all' && player.contingent !== criteria.contingent) {
      return false;
    }
    if (criteria.phase !== 'all' && !player.primaryPhases.includes(criteria.phase)) {
      return false;
    }
    if (normalizedQuery.length > 0) {
      const searchable = [
        player.name,
        player.country,
        player.tacticalRole,
        player.pedigree.join(' '),
        player.rationale.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return searchable.includes(normalizedQuery);
    }
    return true;
  });
}

export function getMetricValue(player: PlayerProfile, metricId: LeaderboardMetricId): number | null {
  const value = player.metrics[metricId];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export interface RankedPlayerRow {
  rank: number;
  player: PlayerProfile;
  value: number;
  formattedValue: string;
  barPercentage: number;
}

export function formatMetricValue(value: number, metric: LeaderboardMetricDefinition): string {
  if (metric.decimals === 0) {
    return Math.round(value).toLocaleString('en-US');
  }
  return value.toFixed(metric.decimals);
}

export function rankPlayersByMetric(
  players: PlayerProfile[],
  metricId: LeaderboardMetricId,
  contingentScope: 'all' | Contingent = 'all',
  sortOrderOverride?: 'asc' | 'desc'
): RankedPlayerRow[] {
  const metric = LEADERBOARD_METRICS.find((m) => m.id === metricId);
  if (!metric) return [];

  const scoped = players.filter((p) => {
    if (contingentScope !== 'all' && p.contingent !== contingentScope) return false;
    return getMetricValue(p, metricId) !== null;
  });

  if (scoped.length === 0) return [];

  const direction = sortOrderOverride ?? (metric.higherIsBetter ? 'desc' : 'asc');

  const sorted = [...scoped].sort((a, b) => {
    const valA = getMetricValue(a, metricId) ?? 0;
    const valB = getMetricValue(b, metricId) ?? 0;
    if (valA === valB) {
      return a.rank - b.rank;
    }
    return direction === 'desc' ? valB - valA : valA - valB;
  });

  const values = sorted.map((p) => getMetricValue(p, metricId) ?? 0);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);

  return sorted.map((player, index) => {
    const value = getMetricValue(player, metricId) ?? 0;
    let barPercentage = 0;
    if (metric.higherIsBetter) {
      barPercentage = maxVal > 0 ? Math.max(12, Math.round((value / maxVal) * 100)) : 0;
    } else {
      // For economy / bowling avg where lower is better, invert smoothly so the top leader gets 100% bar
      const span = Math.max(0.5, maxVal - minVal);
      const normalized = 1 - (value - minVal) / (span * 1.35);
      barPercentage = Math.max(18, Math.min(100, Math.round(normalized * 100)));
    }
    return {
      rank: index + 1,
      player,
      value,
      formattedValue: formatMetricValue(value, metric),
      barPercentage,
    };
  });
}

export interface CircuitBreakdown {
  iplSharePct: number;
  t20iSharePct: number;
  otherSharePct: number;
  iplValue: number;
  t20iValue: number;
  otherValue: number;
  totalValue: number;
  unitLabel: string;
}

export function computeCircuitBreakdown(player: PlayerProfile): CircuitBreakdown {
  if (player.contingent === 'batsman') {
    const total = player.metrics.overallRuns ?? 0;
    const ipl = player.metrics.iplRuns ?? 0;
    const t20i = player.metrics.t20iRuns ?? 0;
    const other = Math.max(0, total - ipl - t20i);
    const safeTotal = Math.max(1, ipl + t20i + other);
    return {
      iplValue: ipl,
      t20iValue: t20i,
      otherValue: other,
      totalValue: total,
      iplSharePct: Math.round((ipl / safeTotal) * 100),
      t20iSharePct: Math.round((t20i / safeTotal) * 100),
      otherSharePct: Math.max(0, 100 - Math.round((ipl / safeTotal) * 100) - Math.round((t20i / safeTotal) * 100)),
      unitLabel: 'Runs',
    };
  }

  const total = player.metrics.overallWickets ?? 0;
  const ipl = player.metrics.iplWickets ?? 0;
  const t20i = player.metrics.t20iWickets ?? 0;
  const other = Math.max(0, total - ipl - t20i);
  const safeTotal = Math.max(1, ipl + t20i + other);
  return {
    iplValue: ipl,
    t20iValue: t20i,
    otherValue: other,
    totalValue: total,
    iplSharePct: Math.round((ipl / safeTotal) * 100),
    t20iSharePct: Math.round((t20i / safeTotal) * 100),
    otherSharePct: Math.max(0, 100 - Math.round((ipl / safeTotal) * 100) - Math.round((t20i / safeTotal) * 100)),
    unitLabel: 'Wickets',
  };
}

export function buildPlayersCsv(players: PlayerProfile[]): string {
  const headers = [
    'Contingent',
    'Rank',
    'Player',
    'Country',
    'Core Anchor',
    'Tactical Role',
    'Overall Matches',
    'Overall Innings',
    'Overall T20 Runs',
    'Overall T20 Wickets',
    'IPL Runs',
    'IPL Wickets',
    'T20I Runs',
    'T20I Wickets',
    'Pedigree',
  ];
  const escape = (val: string | number | boolean | null) => {
    const str = val === null ? '' : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replaceAll('"', '""')}"`;
    }
    return str;
  };
  const rows = players.map((p) =>
    [
      p.contingent === 'batsman' ? 'Batsman' : 'Bowler',
      p.rank,
      p.name,
      p.country,
      p.isCoreAnchor ? 'FIXED / CORE' : 'Track List',
      p.tacticalRole,
      p.metrics.overallMatches,
      p.metrics.overallInnings,
      p.metrics.overallRuns,
      p.metrics.overallWickets,
      p.metrics.iplRuns,
      p.metrics.iplWickets,
      p.metrics.t20iRuns,
      p.metrics.t20iWickets,
      p.pedigree.join(' | '),
    ]
      .map(escape)
      .join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}
