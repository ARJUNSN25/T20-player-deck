import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  BarChart3,
  Clock,
  GitCompareArrows,
} from 'lucide-react';
import { LeaderboardMetricId, PlayerProfile } from '../types/player';
import {
  computeCircuitBreakdown,
  LEADERBOARD_METRICS,
  rankPlayersByMetric,
} from '../utils/analytics';
import { PlayerAvatar } from './PlayerAvatar';

interface PlayerProfileViewProps {
  players: PlayerProfile[];
  selectedPlayerId: string;
  onSelectPlayer: (playerId: string) => void;
  onBackToOverview: () => void;
  onComparePlayer: (playerId: string) => void;
  onOpenLeaderboard: (metricId?: LeaderboardMetricId) => void;
}

export function PlayerProfileView({
  players,
  selectedPlayerId,
  onSelectPlayer,
  onBackToOverview,
  onComparePlayer,
  onOpenLeaderboard,
}: PlayerProfileViewProps) {
  const [historyView, setHistoryView] = useState<'circuits' | 'milestones'>('circuits');

  const currentIndex = Math.max(
    0,
    players.findIndex((p) => p.id === selectedPlayerId)
  );
  const player = players[currentIndex] ?? players[0];
  const prevPlayer = players[(currentIndex - 1 + players.length) % players.length];
  const nextPlayer = players[(currentIndex + 1) % players.length];

  const isBatsman = player.contingent === 'batsman';
  const primaryKpiCardBg = isBatsman ? 'bg-[#173680]' : 'bg-[#0F172A]';
  const contingentLabel = isBatsman ? 'Batsman' : 'Bowler';
  const circuit = computeCircuitBreakdown(player);

  // Compute live leaderboard standings for this player across relevant squad metrics
  const playerStandingMetrics: LeaderboardMetricId[] = isBatsman
    ? ['overallRuns', 'iplRuns', 't20iRuns', 'iplStrikeRate', 't20iStrikeRate', 'iplAvg']
    : ['overallWickets', 'iplWickets', 't20iWickets', 'overallEconomy', 't20iEconomy', 't20iBowlingAvg'];

  const playerRankings = playerStandingMetrics
    .map((metricId) => {
      const def = LEADERBOARD_METRICS.find((m) => m.id === metricId)!;
      const rows = rankPlayersByMetric(players, metricId, player.contingent);
      const match = rows.find((r) => r.player.id === player.id);
      if (!match) return null;
      return {
        metric: def,
        rank: match.rank,
        total: rows.length,
        formattedValue: match.formattedValue,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="space-y-8">
      {/* Profile Navigation & Quick Switcher Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToOverview}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>All Players</span>
          </button>
          <span className="text-slate-300" aria-hidden="true">
            /
          </span>
          <label htmlFor="player-quick-select" className="sr-only">
            Select player dossier
          </label>
          <select
            id="player-quick-select"
            value={player.id}
            onChange={(e) => onSelectPlayer(e.target.value)}
            className="text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          >
            <optgroup label="10 Elite Batsmen">
              {players
                .filter((p) => p.contingent === 'batsman')
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.rank} {p.name} {p.isCoreAnchor ? '(CORE)' : ''}
                  </option>
                ))}
            </optgroup>
            <optgroup label="10 Specialist Bowlers">
              {players
                .filter((p) => p.contingent === 'bowler')
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.rank} {p.name} {p.isCoreAnchor ? '(CORE)' : ''}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onComparePlayer(player.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <GitCompareArrows className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Compare Head-to-Head</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectPlayer(prevPlayer.id)}
            aria-label={`Previous player: ${prevPlayer.name}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{prevPlayer.name.split(' ').pop()}</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectPlayer(nextPlayer.id)}
            aria-label={`Next player: ${nextPlayer.name}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{nextPlayer.name.split(' ').pop()}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Main Dossier Header */}
      <header className="space-y-1">
        <p className="text-xs font-mono font-medium text-amber-700">
          {contingentLabel} #{player.rank} · {player.isCoreAnchor ? 'Fixed / Core · ' : ''}
          {player.tacticalRole} · {player.country}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {player.name} — Career Profile &amp; Scouting Analysis
        </h1>
      </header>

      {/* Primary Dossier Split: Left Portrait Ledger + Right KPIs & Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Identity Column */}
        <aside className="lg:col-span-4 rounded-xl bg-white border border-slate-200 p-5 space-y-5">
          <PlayerAvatar
            name={player.name}
            imagePath={player.imagePath}
            contingent={player.contingent}
            size="xl"
            className="rounded-lg"
          />

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-900">{player.name}</h2>
            <p className="text-sm text-slate-600">{player.tacticalRole}</p>
          </div>

          <dl className="pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-slate-500">Overall T20</dt>
              <dd className="font-mono font-medium tabular-nums text-slate-900">
                {player.metrics.overallInnings} inns ({player.metrics.overallMatches} matches)
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-slate-500">IPL Benchmark</dt>
              <dd className="font-mono font-medium tabular-nums text-slate-900">
                {player.metrics.iplInnings} inns ({player.metrics.iplMatches} matches)
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-slate-500">T20 International</dt>
              <dd className="font-mono font-medium tabular-nums text-slate-900">
                {player.metrics.t20iInnings} inns ({player.metrics.t20iMatches} matches)
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-slate-500">Portrait Source</dt>
              <dd className="text-slate-600">{player.imageSource}</dd>
            </div>
          </dl>
        </aside>

        {/* Right Analytics Column */}
        <div className="lg:col-span-8 space-y-5">
          {/* 4 Primary KPI Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {player.primaryKpis.map((kpi, idx) => {
              const isPrimary = idx === 0;
              const isHighlight = idx === 3;
              return (
                <div
                  key={kpi.label}
                  className={`rounded-xl p-4 ${
                    isPrimary
                      ? `${primaryKpiCardBg} text-white`
                      : 'bg-white border border-slate-200 text-slate-900'
                  }`}
                >
                  <p
                    className={`text-xs font-medium ${
                      isPrimary ? 'text-slate-200' : 'text-slate-500'
                    }`}
                  >
                    {kpi.label}
                  </p>
                  <p
                    className={`mt-1.5 text-2xl sm:text-3xl font-mono font-bold tabular-nums ${
                      isPrimary
                        ? 'text-white'
                        : isHighlight
                        ? 'text-amber-600'
                        : 'text-slate-900'
                    }`}
                  >
                    {kpi.value}
                  </p>
                  {kpi.sublabel && (
                    <p
                      className={`mt-0.5 text-[11px] font-mono ${
                        isPrimary ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {kpi.sublabel}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* IPL Benchmark vs T20 International Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-1.5">
              <p className="text-xs font-mono font-semibold text-blue-900">IPL Benchmark</p>
              <p className="text-[13px] leading-snug font-mono tabular-nums text-slate-800">
                {player.iplBenchmarkSummary}
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-1.5">
              <p className="text-xs font-mono font-semibold text-slate-700">T20 International</p>
              <p className="text-[13px] leading-snug font-mono tabular-nums text-slate-800">
                {player.t20iBenchmarkSummary}
              </p>
            </div>
          </div>

          {/* 3-Phase Tactical Deployment Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {player.phases.map((phase) => (
              <div
                key={phase.phase}
                className={`rounded-xl p-4 border ${
                  isBatsman
                    ? 'bg-blue-50/70 border-blue-100'
                    : 'bg-amber-50/70 border-amber-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-xs font-mono font-semibold ${
                      isBatsman ? 'text-blue-900' : 'text-amber-800'
                    }`}
                  >
                    {phase.phase === 'powerplay'
                      ? 'Powerplay'
                      : phase.phase === 'middle'
                      ? 'Middle Overs'
                      : 'Death'}{' '}
                    ({phase.overs})
                  </p>
                  <span className="text-xs font-mono tabular-nums text-slate-600">
                    {phase.intensity}/100
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-900">{phase.title}</p>
                <div
                  className="mt-2.5 h-1.5 w-full rounded-full bg-white/80 overflow-hidden"
                  aria-hidden="true"
                >
                  <div
                    className={`h-full rounded-full ${
                      isBatsman ? 'bg-blue-800' : 'bg-amber-600'
                    }`}
                    style={{ width: `${phase.intensity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tactical Selection Rationale */}
          <section className="rounded-xl bg-white border border-slate-200 p-5 space-y-3">
            <h3 className="text-xs font-mono font-semibold tracking-wider text-slate-500">
              Tactical Selection Rationale
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-700">
              {player.rationale.map((bullet, idx) => {
                const [lead, ...rest] = bullet.split(':');
                return (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                    <span>
                      <strong className="font-semibold text-slate-900">{lead}:</strong>
                      {rest.join(':')}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>

      {/* Historical Performance Data & Career Circuit Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 rounded-xl bg-white border border-slate-200 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Historical Performance Data</h3>
              <p className="text-xs text-slate-500">
                Circuit output breakdown and verified career tournament progression
              </p>
            </div>
            <div
              role="group"
              aria-label="Historical data view"
              className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80 self-start"
            >
              <button
                type="button"
                onClick={() => setHistoryView('circuits')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  historyView === 'circuits'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Format Split</span>
              </button>
              <button
                type="button"
                onClick={() => setHistoryView('milestones')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  historyView === 'milestones'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Career Timeline ({player.milestones.length})</span>
              </button>
            </div>
          </div>

          {historyView === 'circuits' ? (
            <div className="space-y-6">
              {/* Stacked Circuit Proportion Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">
                    Career {circuit.unitLabel} Distribution Across Circuits
                  </span>
                  <span className="font-mono font-semibold tabular-nums text-slate-900">
                    Total: {circuit.totalValue.toLocaleString('en-US')} {circuit.unitLabel}
                  </span>
                </div>
                <div
                  className="h-4 w-full rounded-lg overflow-hidden flex bg-slate-100"
                  role="img"
                  aria-label={`IPL ${circuit.iplSharePct}%, T20I ${circuit.t20iSharePct}%, Other T20 ${circuit.otherSharePct}%`}
                >
                  <div
                    className="bg-[#173680] h-full transition-all"
                    style={{ width: `${circuit.iplSharePct}%` }}
                    title={`IPL: ${circuit.iplValue.toLocaleString()} (${circuit.iplSharePct}%)`}
                  />
                  <div
                    className="bg-amber-500 h-full transition-all"
                    style={{ width: `${circuit.t20iSharePct}%` }}
                    title={`T20I: ${circuit.t20iValue.toLocaleString()} (${circuit.t20iSharePct}%)`}
                  />
                  <div
                    className="bg-slate-400 h-full transition-all"
                    style={{ width: `${circuit.otherSharePct}%` }}
                    title={`Global T20 Circuits: ${circuit.otherValue.toLocaleString()} (${circuit.otherSharePct}%)`}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600 pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#173680]" />
                    IPL: <strong className="font-mono tabular-nums text-slate-900">{circuit.iplValue.toLocaleString()}</strong> ({circuit.iplSharePct}%)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                    T20I: <strong className="font-mono tabular-nums text-slate-900">{circuit.t20iValue.toLocaleString()}</strong> ({circuit.t20iSharePct}%)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-slate-400" />
                    Other T20 Leagues: <strong className="font-mono tabular-nums text-slate-900">{circuit.otherValue.toLocaleString()}</strong> ({circuit.otherSharePct}%)
                  </span>
                </div>
              </div>

              {/* Historical Efficiency Comparison SVG Bar Chart */}
              <div className="rounded-lg bg-slate-50 border border-slate-200/70 p-4 space-y-3">
                <p className="text-xs font-semibold text-slate-700">
                  {isBatsman
                    ? 'Strike Rate & Average Trajectory Across Circuits'
                    : 'Economy & Bowling Average Control Across Circuits'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(
                    [
                      {
                        label: 'IPL Benchmark',
                        primary: isBatsman
                          ? player.metrics.iplStrikeRate
                          : player.metrics.iplEconomy,
                        secondary: isBatsman
                          ? player.metrics.iplAvg
                          : player.metrics.iplBowlingAvg,
                        color: 'bg-[#173680]',
                      },
                      {
                        label: 'T20 International',
                        primary: isBatsman
                          ? player.metrics.t20iStrikeRate
                          : player.metrics.t20iEconomy,
                        secondary: isBatsman
                          ? player.metrics.t20iAvg
                          : player.metrics.t20iBowlingAvg,
                        color: 'bg-amber-500',
                      },
                      {
                        label: 'Overall T20',
                        primary: isBatsman
                          ? player.metrics.overallStrikeRate
                          : player.metrics.overallEconomy,
                        secondary: isBatsman
                          ? player.metrics.overallAvg
                          : player.metrics.overallBowlingAvg,
                        color: 'bg-slate-800',
                      },
                    ] as const
                  ).map((item) => {
                    const maxRef = isBatsman ? 200 : 10;
                    const barWidth = item.primary
                      ? Math.min(100, Math.max(15, Math.round((item.primary / maxRef) * 100)))
                      : 0;
                    return (
                      <div key={item.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="font-mono font-bold tabular-nums text-slate-900">
                            {item.primary !== null ? item.primary.toFixed(2) : '—'}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200/80 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.color}`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <p className="text-[11px] font-mono tabular-nums text-slate-500">
                          {isBatsman ? 'Avg' : 'Bowl Avg'}:{' '}
                          {item.secondary !== null ? item.secondary.toFixed(2) : '—'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Historical Efficiency Comparison Table (IPL vs T20I vs Overall) */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500">
                      <th scope="col" className="py-2 pr-4 font-medium">
                        Circuit / Format
                      </th>
                      <th scope="col" className="py-2 px-3 text-right font-medium">
                        Matches
                      </th>
                      <th scope="col" className="py-2 px-3 text-right font-medium">
                        Innings
                      </th>
                      <th scope="col" className="py-2 px-3 text-right font-medium">
                        {isBatsman ? 'Runs' : 'Wickets'}
                      </th>
                      <th scope="col" className="py-2 px-3 text-right font-medium">
                        {isBatsman ? 'Batting Avg' : 'Bowling Avg'}
                      </th>
                      <th scope="col" className="py-2 pl-3 text-right font-medium">
                        {isBatsman ? 'Strike Rate' : 'Economy'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-xs sm:text-sm">
                    <tr>
                      <td className="py-2.5 pr-4 font-sans font-semibold text-slate-900">
                        IPL Benchmark
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">
                        {player.metrics.iplMatches}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">
                        {player.metrics.iplInnings}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                        {isBatsman
                          ? player.metrics.iplRuns?.toLocaleString() ?? '—'
                          : player.metrics.iplWickets?.toLocaleString() ?? '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">
                        {isBatsman
                          ? player.metrics.iplAvg?.toFixed(2) ?? '—'
                          : player.metrics.iplBowlingAvg?.toFixed(2) ?? '—'}
                      </td>
                      <td className="py-2.5 pl-3 text-right font-semibold text-blue-900">
                        {isBatsman
                          ? player.metrics.iplStrikeRate?.toFixed(2) ?? '—'
                          : player.metrics.iplEconomy?.toFixed(2) ?? '—'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-sans font-semibold text-slate-900">
                        T20 International
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">
                        {player.metrics.t20iMatches}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">
                        {player.metrics.t20iInnings}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                        {isBatsman
                          ? player.metrics.t20iRuns?.toLocaleString() ?? '—'
                          : player.metrics.t20iWickets?.toLocaleString() ?? '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">
                        {isBatsman
                          ? player.metrics.t20iAvg?.toFixed(2) ?? '—'
                          : player.metrics.t20iBowlingAvg?.toFixed(2) ?? '—'}
                      </td>
                      <td className="py-2.5 pl-3 text-right font-semibold text-amber-700">
                        {isBatsman
                          ? player.metrics.t20iStrikeRate?.toFixed(2) ?? '—'
                          : player.metrics.t20iEconomy?.toFixed(2) ?? '—'}
                      </td>
                    </tr>
                    <tr className="bg-slate-50/70">
                      <td className="py-2.5 pr-4 font-sans font-bold text-slate-900">
                        Overall T20 Career
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-900">
                        {player.metrics.overallMatches}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-900">
                        {player.metrics.overallInnings}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        {isBatsman
                          ? player.metrics.overallRuns?.toLocaleString() ?? '—'
                          : player.metrics.overallWickets?.toLocaleString() ?? '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-900">
                        {isBatsman
                          ? player.metrics.overallAvg?.toFixed(2) ?? '—'
                          : player.metrics.overallBowlingAvg?.toFixed(2) ?? '—'}
                      </td>
                      <td className="py-2.5 pl-3 text-right font-bold text-slate-900">
                        {isBatsman
                          ? player.metrics.overallStrikeRate?.toFixed(2) ?? '—'
                          : player.metrics.overallEconomy?.toFixed(2) ?? '—'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Chronological Career Milestones Timeline */
            <ol className="space-y-4">
              {player.milestones.map((milestone, idx) => (
                <li
                  key={`${milestone.year}-${idx}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-sm font-bold tabular-nums text-blue-900 w-12 shrink-0">
                      {milestone.year}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{milestone.event}</p>
                      <p className="text-xs text-slate-500">{milestone.format}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-amber-700 sm:text-right shrink-0">
                    {milestone.statHighlight}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* Interactive Profile Leaderboard Standings */}
        <section className="lg:col-span-5 rounded-xl bg-white border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Squad Leaderboard Ranks</h3>
              <p className="text-xs text-slate-500">
                Position within the 10-player {contingentLabel.toLowerCase()} contingent
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenLeaderboard(playerStandingMetrics[0])}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 hover:underline cursor-pointer shrink-0"
            >
              <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Full Board</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {playerRankings.map((item) => (
              <button
                key={item.metric.id}
                type="button"
                onClick={() => onOpenLeaderboard(item.metric.id)}
                className="w-full py-3 flex items-center justify-between gap-4 text-left hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.metric.label}</p>
                  <p className="text-xs text-slate-500 font-mono tabular-nums">
                    {item.formattedValue} {item.metric.unit}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`font-mono text-sm font-bold tabular-nums ${
                      item.rank === 1
                        ? 'text-amber-600'
                        : item.rank <= 3
                        ? 'text-blue-900'
                        : 'text-slate-700'
                    }`}
                  >
                    #{item.rank}
                  </span>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">
                    /{item.total}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Pedigree Footer Bar */}
      <footer className="pt-4 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono font-semibold text-slate-800">PEDIGREE:</span>
        {player.pedigree.map((item, idx) => (
          <span key={item} className="inline-flex items-center gap-3">
            <span>{item}</span>
            {idx < player.pedigree.length - 1 && (
              <span className="text-slate-300" aria-hidden="true">
                |
              </span>
            )}
          </span>
        ))}
      </footer>
    </div>
  );
}
