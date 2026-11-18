import { useState } from 'react';
import { ArrowRight, LayoutGrid, List, RotateCcw, Search } from 'lucide-react';
import { Contingent, PhaseKey, PlayerProfile } from '../types/player';
import { filterPlayers } from '../utils/analytics';
import { PlayerAvatar } from './PlayerAvatar';

interface OverviewTrackListProps {
  players: PlayerProfile[];
  onSelectPlayer: (playerId: string) => void;
  onNavigateTab: (tab: 'leaderboards' | 'compare') => void;
}

export function OverviewTrackList({
  players,
  onSelectPlayer,
  onNavigateTab,
}: OverviewTrackListProps) {
  const [contingent, setContingent] = useState<'all' | Contingent>('all');
  const [phase, setPhase] = useState<'all' | PhaseKey>('all');
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('cards');

  const filtered = filterPlayers(players, { contingent, phase, query });
  const batsmenFiltered = filtered.filter((p) => p.contingent === 'batsman');
  const bowlersFiltered = filtered.filter((p) => p.contingent === 'bowler');
  const coreKohli = players.find((p) => p.id === 'virat-kohli');
  const coreBumrah = players.find((p) => p.id === 'jasprit-bumrah');

  const hasActiveFilters = contingent !== 'all' || phase !== 'all' || query.trim() !== '';

  const resetFilters = () => {
    setContingent('all');
    setPhase('all');
    setQuery('');
  };

  return (
    <div className="space-y-10">
      {/* Editorial Website Hero */}
      <section className="rounded-2xl bg-[#0B1633] text-white p-6 md:p-10 border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <p className="text-xs font-mono tracking-wider text-amber-400">
                Official Scouting Dossier · 20-Player Analytics Edition
              </p>
              <h1 className="text-[clamp(2rem,3.6vw,3.1rem)] leading-[1.1] font-bold tracking-tight text-white [text-wrap:balance]">
                T20 Squad Selection &amp; Player Intelligence
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Explore complete career profiles, historical IPL &amp; T20I benchmarks, tactical
                phase deployment, and interactive leaderboards across 10 elite batsmen and 10
                specialist bowlers.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#roster"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Explore 20 Players</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => onNavigateTab('leaderboards')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-600 text-slate-100 text-sm font-medium hover:bg-slate-800/80 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Squad Leaderboards</span>
              </button>
            </div>
          </div>

          {/* Core Anchors Spotlight */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            {coreKohli && (
              <button
                type="button"
                onClick={() => onSelectPlayer(coreKohli.id)}
                className="group text-left rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-blue-400 p-4 flex items-center gap-4 transition-colors cursor-pointer"
              >
                <PlayerAvatar
                  name={coreKohli.name}
                  imagePath={coreKohli.imagePath}
                  contingent={coreKohli.contingent}
                  size="lg"
                  className="rounded-lg shrink-0 border-slate-700"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-mono text-blue-300">
                    Batsman #1 · Fixed / Core
                  </p>
                  <p className="text-base font-bold text-white group-hover:text-blue-200 transition-colors truncate">
                    {coreKohli.name}
                  </p>
                  <p className="text-xs text-slate-300 truncate">{coreKohli.tacticalRole}</p>
                  <p className="mt-1.5 text-xs font-mono font-semibold tabular-nums text-white">
                    14,218 T20 Runs · 42.44 Avg
                  </p>
                </div>
              </button>
            )}
            {coreBumrah && (
              <button
                type="button"
                onClick={() => onSelectPlayer(coreBumrah.id)}
                className="group text-left rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-400 p-4 flex items-center gap-4 transition-colors cursor-pointer"
              >
                <PlayerAvatar
                  name={coreBumrah.name}
                  imagePath={coreBumrah.imagePath}
                  contingent={coreBumrah.contingent}
                  size="lg"
                  className="rounded-lg shrink-0 border-slate-700"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-mono text-amber-400">
                    Bowler #1 · Fixed / Core
                  </p>
                  <p className="text-base font-bold text-white group-hover:text-amber-200 transition-colors truncate">
                    {coreBumrah.name}
                  </p>
                  <p className="text-xs text-slate-300 truncate">{coreBumrah.tacticalRole}</p>
                  <p className="mt-1.5 text-xs font-mono font-semibold tabular-nums text-white">
                    354 T20 Wkts · 6.52 T20I Econ
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* 4-Column Full-Width KPI Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div>
            <p className="text-xs text-slate-400">Tracked Squad Pool</p>
            <p className="mt-1 text-lg sm:text-2xl font-display font-bold tabular-nums text-white">
              20 Specialists
            </p>
            <p className="mt-0.5 text-xs text-slate-400">10 Batsmen · 10 Bowlers</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Fixed Core Anchors</p>
            <p className="mt-1 text-lg sm:text-2xl font-display font-bold tabular-nums text-amber-400">
              Kohli &amp; Bumrah
            </p>
            <p className="mt-0.5 text-xs text-slate-400">Rank #1 Bat · Rank #1 Bowl</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">All-Time T20 Run Leader</p>
            <p className="mt-1 text-lg sm:text-2xl font-display font-bold tabular-nums text-white">
              14,833 Runs
            </p>
            <p className="mt-0.5 text-xs text-slate-400">Jos Buttler · 14,218 Virat Kohli</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">All-Time T20 Wicket Leader</p>
            <p className="mt-1 text-lg sm:text-2xl font-display font-bold tabular-nums text-white">
              736 Wickets
            </p>
            <p className="mt-0.5 text-xs text-slate-400">Rashid Khan · 6.13 Econ Sunil Narine</p>
          </div>
        </div>
      </section>

      {/* Section Heading for Roster */}
      <div id="roster" className="scroll-mt-8 pt-2">
        <p className="text-xs font-mono font-medium text-blue-900">
          Squad Roster · 10 Batsmen &amp; 10 Bowlers
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
          Player Scouting Profiles
        </h2>
      </div>

      {/* Filter & Search Toolbar */}
      <section
        aria-label="Roster filters"
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200"
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Contingent Segmented Control */}
          <div
            role="group"
            aria-label="Filter by contingent"
            className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80"
          >
            {(
              [
                { id: 'all', label: 'All Players (20)' },
                { id: 'batsman', label: 'Batsmen (10)' },
                { id: 'bowler', label: 'Bowlers (10)' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setContingent(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  contingent === item.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Phase Specialization Filter */}
          <div
            role="group"
            aria-label="Filter by phase role"
            className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80"
          >
            {(
              [
                { id: 'all', label: 'All Phases' },
                { id: 'powerplay', label: 'Powerplay (1–6)' },
                { id: 'middle', label: 'Middle (7–15)' },
                { id: 'death', label: 'Death (16–20)' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPhase(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  phase === item.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <label htmlFor="roster-search" className="sr-only">
              Search players, countries, or tactical roles
            </label>
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="roster-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search player, country, role..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
            />
          </div>

          {/* View Toggle */}
          <div
            role="group"
            aria-label="Roster layout mode"
            className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80 shrink-0"
          >
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              aria-label="Scouting grid view"
              aria-pressed={viewMode === 'cards'}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              aria-label="Matrix table view"
              aria-pressed={viewMode === 'matrix'}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Matrix</span>
            </button>
          </div>
        </div>
      </section>

      {/* Active Result Count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="tabular-nums" data-testid="filtered-player-count">
          Showing {filtered.length} of {players.length} tracked players
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-blue-900 font-medium hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white border border-slate-200 p-12 text-center space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">No players match your current filters</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try clearing your search query or switching contingent and phase specialization filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset all filters</span>
          </button>
        </div>
      ) : viewMode === 'matrix' ? (
        <div className="space-y-10">
          {batsmenFiltered.length > 0 && (
            <ContingentTable
              title="10-Player Batsman Track List"
              kicker="Batting Roster Matrix · Slides 4–13"
              principle="Fixed core anchor Virat Kohli stabilizes equilibrium while boundary finishers maximize death strike rate."
              accent="blue"
              players={batsmenFiltered}
              onSelectPlayer={onSelectPlayer}
            />
          )}

          {bowlersFiltered.length > 0 && (
            <ContingentTable
              title="10-Player Specialist Bowler Track List"
              kicker="Bowling Roster Matrix · Slides 14–23"
              principle="Fixed spearhead Jasprit Bumrah guarantees death economy while new-ball and wrist-spin weapons secure breakthroughs."
              accent="amber"
              players={bowlersFiltered}
              onSelectPlayer={onSelectPlayer}
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((player) => (
            <button
              key={player.id}
              type="button"
              onClick={() => onSelectPlayer(player.id)}
              className="group text-left rounded-xl bg-white border border-slate-200 p-5 hover:border-slate-400 transition-colors flex flex-col justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-900"
            >
              <div className="flex items-start gap-4">
                <PlayerAvatar
                  name={player.name}
                  imagePath={player.imagePath}
                  contingent={player.contingent}
                  size="lg"
                  className="rounded-lg shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-xs font-mono text-slate-500">
                    {player.contingent === 'batsman' ? 'Bat' : 'Bowl'} #{player.rank} ·{' '}
                    {player.country}
                    {player.isCoreAnchor ? ' · Core' : ''}
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors truncate">
                    {player.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{player.tacticalRole}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                {player.primaryKpis.slice(0, 2).map((kpi) => (
                  <div key={kpi.label}>
                    <p className="text-[11px] text-slate-500 truncate">{kpi.label}</p>
                    <p className="text-base font-mono font-semibold tabular-nums text-slate-900">
                      {kpi.value}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 truncate">{player.pedigree[0]}</p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span className="truncate font-mono">{player.metrics.overallInningsLabel}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-blue-900 shrink-0">
                  <span>View Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ContingentTableProps {
  title: string;
  kicker: string;
  principle: string;
  accent: 'blue' | 'amber';
  players: PlayerProfile[];
  onSelectPlayer: (playerId: string) => void;
}

function ContingentTable({
  title,
  kicker,
  principle,
  accent,
  players,
  onSelectPlayer,
}: ContingentTableProps) {
  const headerBg = accent === 'blue' ? 'bg-[#173680]' : 'bg-[#0F172A]';
  const kickerColor = accent === 'blue' ? 'text-blue-800' : 'text-amber-700';

  return (
    <section className="space-y-3">
      <div>
        <p className={`text-xs font-mono font-medium ${kickerColor}`}>{kicker}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{title}</h2>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${headerBg} text-white text-xs font-medium tracking-wide`}>
                <th scope="col" className="py-3 px-4 whitespace-nowrap">
                  Rank &amp; Player
                </th>
                <th scope="col" className="py-3 px-4 whitespace-nowrap">
                  Primary Tactical Role
                </th>
                <th scope="col" className="py-3 px-4 whitespace-nowrap">
                  Career Innings &amp; Matches
                </th>
                <th scope="col" className="py-3 px-4 text-right whitespace-nowrap">
                  Key Benchmark
                </th>
                <th scope="col" className="py-3 px-4 text-right whitespace-nowrap">
                  Profile
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {players.map((player) => {
                const rowHighlight = player.isCoreAnchor
                  ? accent === 'blue'
                    ? 'bg-blue-50/60 hover:bg-blue-50'
                    : 'bg-amber-50/70 hover:bg-amber-50'
                  : 'hover:bg-slate-50';

                return (
                  <tr key={player.id} className={`transition-colors ${rowHighlight}`}>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onSelectPlayer(player.id)}
                        className="flex items-center gap-3 text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-900 rounded"
                      >
                        <PlayerAvatar
                          name={player.name}
                          imagePath={player.imagePath}
                          contingent={player.contingent}
                          size="sm"
                          className="rounded-md shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                            <span className="font-mono text-slate-500 mr-1.5 tabular-nums">
                              #{player.rank}
                            </span>
                            <span>{player.name}</span>
                            {player.isCoreAnchor && (
                              <span className="ml-2 text-xs font-mono font-semibold text-amber-700">
                                [FIXED / CORE]
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{player.country}</div>
                        </div>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{player.tacticalRole}</td>
                    <td className="py-3 px-4 text-slate-600 tabular-nums">
                      {player.metrics.overallInningsLabel} ({player.metrics.iplInnings} IPL,{' '}
                      {player.metrics.t20iInnings} T20I)
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 whitespace-nowrap">
                      <span className="font-semibold">{player.primaryKpis[0].value}</span>
                      <span className="text-xs text-slate-500 ml-1.5">
                        {player.primaryKpis[0].label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectPlayer(player.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 hover:text-blue-700 cursor-pointer"
                      >
                        <span>Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-600">
        <span className="font-semibold text-slate-900">Selection Principle:</span> {principle}
      </p>
    </section>
  );
}
