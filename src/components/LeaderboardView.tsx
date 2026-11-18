import { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, GitCompareArrows } from 'lucide-react';
import {
  LeaderboardCategory,
  LeaderboardMetricId,
  PlayerProfile,
} from '../types/player';
import { LEADERBOARD_METRICS, rankPlayersByMetric } from '../utils/analytics';
import { PlayerAvatar } from './PlayerAvatar';

interface LeaderboardViewProps {
  players: PlayerProfile[];
  initialMetricId?: LeaderboardMetricId;
  onSelectPlayer: (playerId: string) => void;
  onComparePlayers: (playerAId: string, playerBId: string) => void;
}

export function LeaderboardView({
  players,
  initialMetricId = 'overallRuns',
  onSelectPlayer,
  onComparePlayers,
}: LeaderboardViewProps) {
  const initialMetric =
    LEADERBOARD_METRICS.find((m) => m.id === initialMetricId) ?? LEADERBOARD_METRICS[0];

  const [category, setCategory] = useState<LeaderboardCategory>(initialMetric.category);
  const [metricId, setMetricId] = useState<LeaderboardMetricId>(initialMetric.id);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    initialMetric.higherIsBetter ? 'desc' : 'asc'
  );

  const categoryMetrics = LEADERBOARD_METRICS.filter((m) => m.category === category);
  const activeMetric =
    LEADERBOARD_METRICS.find((m) => m.id === metricId) ?? categoryMetrics[0];

  const handleCategoryChange = (nextCategory: LeaderboardCategory) => {
    setCategory(nextCategory);
    const firstMetric = LEADERBOARD_METRICS.find((m) => m.category === nextCategory);
    if (firstMetric) {
      setMetricId(firstMetric.id);
      setSortOrder(firstMetric.higherIsBetter ? 'desc' : 'asc');
    }
  };

  const handleMetricChange = (nextMetricId: LeaderboardMetricId) => {
    const def = LEADERBOARD_METRICS.find((m) => m.id === nextMetricId);
    setMetricId(nextMetricId);
    if (def) {
      setSortOrder(def.higherIsBetter ? 'desc' : 'asc');
    }
  };

  const contingentScope =
    category === 'batting' ? 'batsman' : category === 'bowling' ? 'bowler' : 'all';

  const rankedRows = rankPlayersByMetric(
    players,
    activeMetric.id,
    contingentScope,
    sortOrder
  );

  const leaderRow = rankedRows[0];
  const runnerUpRow = rankedRows[1];

  return (
    <div className="space-y-8">
      {/* Header & Category Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-mono font-medium text-blue-900">
            Interactive Squad Rankings · Career &amp; Benchmark Metrics
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
            20-Player Performance Leaderboards
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Rank specialists dynamically across career volume, IPL &amp; T20I efficiency, economy, and longevity.
          </p>
        </div>

        <div
          role="group"
          aria-label="Leaderboard category"
          className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80 self-start"
        >
          {(
            [
              { id: 'batting', label: 'Batting Leaders' },
              { id: 'bowling', label: 'Bowling Leaders' },
              { id: 'experience', label: 'Experience (All 20)' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleCategoryChange(tab.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                category === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Select ranking metric"
          className="flex flex-wrap items-center gap-2"
        >
          {categoryMetrics.map((metric) => {
            const isActive = metric.id === activeMetric.id;
            return (
              <button
                key={metric.id}
                type="button"
                onClick={() => handleMetricChange(metric.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#0B1633] text-white border-[#0B1633]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {metric.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {sortOrder === 'desc' ? (
            <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>{sortOrder === 'desc' ? 'Highest First' : 'Lowest First'}</span>
        </button>
      </div>

      {/* Leader Spotlight Strip */}
      {leaderRow && runnerUpRow && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#0B1633] text-white p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <PlayerAvatar
                name={leaderRow.player.name}
                imagePath={leaderRow.player.imagePath}
                contingent={leaderRow.player.contingent}
                size="lg"
                className="rounded-lg shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-mono text-amber-400">
                  #1 Leader · {activeMetric.label}
                </p>
                <button
                  type="button"
                  onClick={() => onSelectPlayer(leaderRow.player.id)}
                  className="text-lg font-bold text-white hover:underline text-left truncate block cursor-pointer"
                >
                  {leaderRow.player.name}
                </button>
                <p className="text-xs text-slate-300 truncate">{leaderRow.player.tacticalRole}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl sm:text-3xl font-mono font-bold tabular-nums text-white">
                {leaderRow.formattedValue}
              </p>
              <p className="text-xs text-slate-400">{activeMetric.unit}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <PlayerAvatar
                name={runnerUpRow.player.name}
                imagePath={runnerUpRow.player.imagePath}
                contingent={runnerUpRow.player.contingent}
                size="lg"
                className="rounded-lg shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-mono text-blue-900">
                  #2 Contender · {activeMetric.label}
                </p>
                <button
                  type="button"
                  onClick={() => onSelectPlayer(runnerUpRow.player.id)}
                  className="text-lg font-bold text-slate-900 hover:text-blue-900 text-left truncate block cursor-pointer"
                >
                  {runnerUpRow.player.name}
                </button>
                <p className="text-xs text-slate-500 truncate">{runnerUpRow.player.tacticalRole}</p>
              </div>
            </div>
            <div className="text-right shrink-0 space-y-1">
              <p className="text-2xl sm:text-3xl font-mono font-bold tabular-nums text-slate-900">
                {runnerUpRow.formattedValue}
              </p>
              <button
                type="button"
                onClick={() => onComparePlayers(leaderRow.player.id, runnerUpRow.player.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 hover:underline cursor-pointer"
              >
                <GitCompareArrows className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Compare #1 vs #2</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Bar Chart & Full Tabular Leaderboard */}
      <section className="rounded-xl bg-white border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900">
            {activeMetric.label} Rankings ({rankedRows.length} Players)
          </h2>
          <span className="text-xs text-slate-500">
            {activeMetric.higherIsBetter ? 'Higher is better' : 'Lower is better'} · Click any player for profile
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500">
                <th scope="col" className="py-3 px-4 w-16">
                  Rank
                </th>
                <th scope="col" className="py-3 px-4">
                  Player
                </th>
                <th scope="col" className="py-3 px-4 hidden md:table-cell">
                  Role &amp; Country
                </th>
                <th scope="col" className="py-3 px-4 w-56 hidden sm:table-cell">
                  Relative Scale
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  {activeMetric.shortLabel}
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {rankedRows.map((row) => (
                <tr key={row.player.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold tabular-nums text-slate-700">
                    #{row.rank}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => onSelectPlayer(row.player.id)}
                      className="flex items-center gap-3 text-left group cursor-pointer"
                    >
                      <PlayerAvatar
                        name={row.player.name}
                        imagePath={row.player.imagePath}
                        contingent={row.player.contingent}
                        size="sm"
                        className="rounded-md shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                          {row.player.name}
                        </p>
                        <p className="text-xs text-slate-500 sm:hidden">
                          {row.player.country} · {row.player.shortRole}
                        </p>
                      </div>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-slate-600 hidden md:table-cell">
                    <span>{row.player.shortRole}</span>
                    <span className="mx-1.5 text-slate-300" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-slate-500">{row.player.country}</span>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          row.rank === 1
                            ? 'bg-amber-500'
                            : row.player.contingent === 'batsman'
                            ? 'bg-[#173680]'
                            : 'bg-slate-800'
                        }`}
                        style={{ width: `${row.barPercentage}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                    {row.formattedValue}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectPlayer(row.player.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 hover:underline cursor-pointer"
                    >
                      <span>Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
