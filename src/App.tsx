import { useState } from 'react';
import { Download } from 'lucide-react';
import { PLAYERS } from './data/players';
import { LeaderboardMetricId } from './types/player';
import { buildPlayersCsv } from './utils/analytics';
import { OverviewTrackList } from './components/OverviewTrackList';
import { PlayerProfileView } from './components/PlayerProfileView';
import { LeaderboardView } from './components/LeaderboardView';
import { HeadToHeadView } from './components/HeadToHeadView';

type WebsiteView = 'home' | 'profile';

export default function App() {
  const [view, setView] = useState<WebsiteView>('home');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(PLAYERS[0].id);
  const [leaderboardMetricId, setLeaderboardMetricId] =
    useState<LeaderboardMetricId>('overallRuns');
  const [comparePair, setComparePair] = useState<[string, string]>([
    'virat-kohli',
    'jos-buttler',
  ]);

  const scrollToSection = (sectionId: string) => {
    setView('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 30);
  };

  const handleSelectPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLeaderboard = (metricId?: LeaderboardMetricId) => {
    if (metricId) {
      setLeaderboardMetricId(metricId);
    }
    scrollToSection('leaderboards');
  };

  const handleCompareFromProfile = (playerId: string) => {
    const player = PLAYERS.find((p) => p.id === playerId) ?? PLAYERS[0];
    const peer =
      PLAYERS.find((p) => p.contingent === player.contingent && p.id !== player.id) ??
      PLAYERS[1];
    setComparePair([player.id, peer.id]);
    scrollToSection('head-to-head');
  };

  const handleComparePair = (aId: string, bId: string) => {
    setComparePair([aId, bId]);
    scrollToSection('head-to-head');
  };

  const handleExportCsv = () => {
    const csv = buildPlayersCsv(PLAYERS);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 't20-scouting-deck-20-players.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Three-Zone Top Bar Contract */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => {
              setView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            T20 Scouting Deck
          </button>

          {/* Zone 2: 4 Clean Single-Line Nav Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            <button
              type="button"
              onClick={() => scrollToSection('roster')}
              className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'home'
                  ? 'border-blue-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Roster
            </button>
            <button
              type="button"
              onClick={() => setView('profile')}
              aria-current={view === 'profile' ? 'page' : undefined}
              className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'profile'
                  ? 'border-blue-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Player Profiles
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('leaderboards')}
              className="py-5 border-b-2 border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Leaderboards
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('head-to-head')}
              className="py-5 border-b-2 border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Head-to-Head
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1633] text-white text-xs font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip (visible only below md) */}
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-1 overflow-x-auto"
        >
          <button
            type="button"
            onClick={() => scrollToSection('roster')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
              view === 'home' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Roster
          </button>
          <button
            type="button"
            onClick={() => setView('profile')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
              view === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Profiles
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('leaderboards')}
            className="px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Leaderboards
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('head-to-head')}
            className="px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Compare
          </button>
        </nav>
      </header>

      {/* Main Website Content */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8">
        {view === 'home' ? (
          <div className="space-y-16">
            <OverviewTrackList
              players={PLAYERS}
              onSelectPlayer={handleSelectPlayer}
              onNavigateTab={(tab) =>
                scrollToSection(tab === 'leaderboards' ? 'leaderboards' : 'head-to-head')
              }
            />

            <section id="leaderboards" className="scroll-mt-8 pt-10 border-t border-slate-200">
              <LeaderboardView
                key={leaderboardMetricId}
                players={PLAYERS}
                initialMetricId={leaderboardMetricId}
                onSelectPlayer={handleSelectPlayer}
                onComparePlayers={handleComparePair}
              />
            </section>

            <section id="head-to-head" className="scroll-mt-8 pt-10 border-t border-slate-200">
              <HeadToHeadView
                players={PLAYERS}
                playerAId={comparePair[0]}
                playerBId={comparePair[1]}
                onChangePair={(a, b) => setComparePair([a, b])}
                onSelectPlayer={handleSelectPlayer}
              />
            </section>
          </div>
        ) : (
          <PlayerProfileView
            players={PLAYERS}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={(id) => setSelectedPlayerId(id)}
            onBackToOverview={() => {
              setView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onComparePlayer={handleCompareFromProfile}
            onOpenLeaderboard={handleOpenLeaderboard}
          />
        )}
      </main>

      {/* Website Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-1">
            <p className="font-display font-bold text-sm text-slate-900">T20 Scouting Deck</p>
            <p>
              20-Player Track List &amp; Analytics · 10 Elite Batsmen &amp; 10 Specialist Bowlers
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => scrollToSection('roster')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Roster
            </button>
            <button
              type="button"
              onClick={() => setView('profile')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Player Profiles
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('leaderboards')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Leaderboards
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('head-to-head')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Head-to-Head
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
