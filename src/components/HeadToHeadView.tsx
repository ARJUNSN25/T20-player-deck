import { ArrowRight, ArrowLeftRight } from 'lucide-react';
import { PlayerProfile } from '../types/player';
import { PlayerAvatar } from './PlayerAvatar';

interface HeadToHeadViewProps {
  players: PlayerProfile[];
  playerAId: string;
  playerBId: string;
  onChangePair: (playerAId: string, playerBId: string) => void;
  onSelectPlayer: (playerId: string) => void;
}

const PRESET_MATCHUPS: Array<{ label: string; a: string; b: string }> = [
  { label: 'Kohli vs Buttler', a: 'virat-kohli', b: 'jos-buttler' },
  { label: 'Bumrah vs Rashid', a: 'jasprit-bumrah', b: 'rashid-khan' },
  { label: 'Russell vs Tim David', a: 'andre-russell', b: 'tim-david' },
  { label: 'Narine vs Chahal', a: 'sunil-narine', b: 'yuzvendra-chahal' },
];

export function HeadToHeadView({
  players,
  playerAId,
  playerBId,
  onChangePair,
  onSelectPlayer,
}: HeadToHeadViewProps) {
  const playerA = players.find((p) => p.id === playerAId) ?? players[0];
  const playerB = players.find((p) => p.id === playerBId) ?? players[3];

  interface ComparisonRow {
    label: string;
    valA: number | null;
    valB: number | null;
    format: (v: number) => string;
    higherIsBetter: boolean;
  }

  const rawComparisonRows: ComparisonRow[] = [
    {
      label: 'Overall T20 Matches',
      valA: playerA.metrics.overallMatches,
      valB: playerB.metrics.overallMatches,
      format: (v: number) => v.toLocaleString('en-US'),
      higherIsBetter: true,
    },
    {
      label: 'Overall T20 Innings',
      valA: playerA.metrics.overallInnings,
      valB: playerB.metrics.overallInnings,
      format: (v: number) => v.toLocaleString('en-US'),
      higherIsBetter: true,
    },
    {
      label: 'Overall T20 Runs',
      valA: playerA.metrics.overallRuns,
      valB: playerB.metrics.overallRuns,
      format: (v: number) => v.toLocaleString('en-US'),
      higherIsBetter: true,
    },
    {
      label: 'IPL Career Runs',
      valA: playerA.metrics.iplRuns,
      valB: playerB.metrics.iplRuns,
      format: (v: number) => v.toLocaleString('en-US'),
      higherIsBetter: true,
    },
    {
      label: 'IPL Strike Rate',
      valA: playerA.metrics.iplStrikeRate,
      valB: playerB.metrics.iplStrikeRate,
      format: (v: number) => v.toFixed(2),
      higherIsBetter: true,
    },
    {
      label: 'T20I Strike Rate',
      valA: playerA.metrics.t20iStrikeRate,
      valB: playerB.metrics.t20iStrikeRate,
      format: (v: number) => v.toFixed(2),
      higherIsBetter: true,
    },
    {
      label: 'Overall T20 Wickets',
      valA: playerA.metrics.overallWickets,
      valB: playerB.metrics.overallWickets,
      format: (v: number) => v.toLocaleString('en-US'),
      higherIsBetter: true,
    },
    {
      label: 'IPL Wickets',
      valA: playerA.metrics.iplWickets,
      valB: playerB.metrics.iplWickets,
      format: (v: number) => v.toLocaleString('en-US'),
      higherIsBetter: true,
    },
    {
      label: 'T20I Wickets',
      valA: playerA.metrics.t20iWickets,
      valB: playerB.metrics.t20iWickets,
      format: (v: number) => v.toLocaleString('en-US'),
      higherIsBetter: true,
    },
    {
      label: 'Career T20 Economy',
      valA: playerA.metrics.overallEconomy,
      valB: playerB.metrics.overallEconomy,
      format: (v: number) => v.toFixed(2),
      higherIsBetter: false,
    },
    {
      label: 'T20I Economy',
      valA: playerA.metrics.t20iEconomy,
      valB: playerB.metrics.t20iEconomy,
      format: (v: number) => v.toFixed(2),
      higherIsBetter: false,
    },
  ];

  const comparisonRows = rawComparisonRows.filter(
    (row) => row.valA !== null || row.valB !== null
  );

  return (
    <div className="space-y-8">
      {/* Header & Preset Matchups */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-mono font-medium text-blue-900">
            Side-by-Side Scouting Comparison
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
            Head-to-Head Player Matchup
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Compare any two specialists across career volume, IPL &amp; T20I benchmarks, and phase deployment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESET_MATCHUPS.map((preset) => {
            const isSelected = playerA.id === preset.a && playerB.id === preset.b;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChangePair(preset.a, preset.b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B1633] text-white border-[#0B1633]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dual Player Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* Player A Card */}
        <div className="md:col-span-5 rounded-xl bg-white border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="compare-player-a" className="text-xs font-mono text-blue-900 font-semibold">
              Player A
            </label>
            <button
              type="button"
              onClick={() => onSelectPlayer(playerA.id)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 hover:underline cursor-pointer"
            >
              <span>Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
          <select
            id="compare-player-a"
            value={playerA.id}
            onChange={(e) => onChangePair(e.target.value, playerB.id)}
            className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.contingent === 'batsman' ? 'Batsman' : 'Bowler'} #{p.rank})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-4">
            <PlayerAvatar
              name={playerA.name}
              imagePath={playerA.imagePath}
              contingent={playerA.contingent}
              size="lg"
              className="rounded-lg shrink-0"
            />
            <div className="min-w-0">
              <p className="text-lg font-bold text-slate-900 truncate">{playerA.name}</p>
              <p className="text-xs text-slate-600">{playerA.tacticalRole}</p>
              <p className="text-xs font-mono text-slate-500 mt-1">{playerA.country}</p>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center">
          <button
            type="button"
            onClick={() => onChangePair(playerB.id, playerA.id)}
            aria-label="Swap compared players"
            className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Player B Card */}
        <div className="md:col-span-5 rounded-xl bg-white border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="compare-player-b" className="text-xs font-mono text-amber-700 font-semibold">
              Player B
            </label>
            <button
              type="button"
              onClick={() => onSelectPlayer(playerB.id)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 hover:underline cursor-pointer"
            >
              <span>Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
          <select
            id="compare-player-b"
            value={playerB.id}
            onChange={(e) => onChangePair(playerA.id, e.target.value)}
            className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.contingent === 'batsman' ? 'Batsman' : 'Bowler'} #{p.rank})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-4">
            <PlayerAvatar
              name={playerB.name}
              imagePath={playerB.imagePath}
              contingent={playerB.contingent}
              size="lg"
              className="rounded-lg shrink-0"
            />
            <div className="min-w-0">
              <p className="text-lg font-bold text-slate-900 truncate">{playerB.name}</p>
              <p className="text-xs text-slate-600">{playerB.tacticalRole}</p>
              <p className="text-xs font-mono text-slate-500 mt-1">{playerB.country}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Deployment Side-by-Side Bars */}
      <section className="rounded-xl bg-white border border-slate-200 p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Phase Deployment Profile</h2>
          <div className="flex items-center gap-5 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#173680]" />
              {playerA.name}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
              {playerB.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {([0, 1, 2] as const).map((phaseIdx) => {
            const phaseA = playerA.phases[phaseIdx];
            const phaseB = playerB.phases[phaseIdx];
            const phaseLabel =
              phaseA.phase === 'powerplay'
                ? 'Powerplay (1–6)'
                : phaseA.phase === 'middle'
                ? 'Middle Overs (7–15)'
                : 'Death (16–20)';
            return (
              <div key={phaseLabel} className="space-y-3">
                <p className="text-sm font-semibold text-slate-900">{phaseLabel}</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span className="truncate pr-2">{phaseA.title}</span>
                      <span className="font-mono font-semibold tabular-nums text-slate-900">
                        {phaseA.intensity}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#173680] rounded-full"
                        style={{ width: `${phaseA.intensity}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span className="truncate pr-2">{phaseB.title}</span>
                      <span className="font-mono font-semibold tabular-nums text-slate-900">
                        {phaseB.intensity}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${phaseB.intensity}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Statistical Comparison Table */}
      <section className="rounded-xl bg-white border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">Career Statistical Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500">
                <th scope="col" className="py-3 px-4 font-medium">
                  Metric
                </th>
                <th scope="col" className="py-3 px-4 text-right font-semibold text-blue-900">
                  {playerA.name}
                </th>
                <th scope="col" className="py-3 px-4 text-right font-semibold text-amber-700">
                  {playerB.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonRows.map((row) => {
                const bothExist = row.valA !== null && row.valB !== null;
                let aLeads = false;
                let bLeads = false;
                if (bothExist) {
                  if (row.valA! !== row.valB!) {
                    aLeads = row.higherIsBetter
                      ? row.valA! > row.valB!
                      : row.valA! < row.valB!;
                    bLeads = !aLeads;
                  }
                }
                return (
                  <tr key={row.label} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-medium text-slate-700">{row.label}</td>
                    <td
                      className={`py-3 px-4 text-right font-mono tabular-nums ${
                        aLeads ? 'font-bold text-blue-900' : 'text-slate-600'
                      }`}
                    >
                      {row.valA !== null ? row.format(row.valA) : '—'}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono tabular-nums ${
                        bLeads ? 'font-bold text-amber-700' : 'text-slate-600'
                      }`}
                    >
                      {row.valB !== null ? row.format(row.valB) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
