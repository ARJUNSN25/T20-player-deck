import test from 'node:test';
import assert from 'node:assert/strict';
import { PLAYERS } from '../data/players';
import {
  buildPlayersCsv,
  computeCircuitBreakdown,
  filterPlayers,
  rankPlayersByMetric,
} from './analytics';

test('dataset contains exactly 10 batsmen and 10 bowlers with 2 core anchors', () => {
  const batsmen = PLAYERS.filter((p) => p.contingent === 'batsman');
  const bowlers = PLAYERS.filter((p) => p.contingent === 'bowler');
  const cores = PLAYERS.filter((p) => p.isCoreAnchor);
  assert.equal(PLAYERS.length, 20);
  assert.equal(batsmen.length, 10);
  assert.equal(bowlers.length, 10);
  assert.equal(cores.length, 2);
  assert.deepEqual(
    cores.map((c) => c.name),
    ['Virat Kohli', 'Jasprit Bumrah']
  );
});

test('filterPlayers narrows by contingent, phase, and search query', () => {
  const bowlersOnly = filterPlayers(PLAYERS, {
    contingent: 'bowler',
    phase: 'all',
    query: '',
  });
  assert.equal(bowlersOnly.length, 10);

  const deathBatsmen = filterPlayers(PLAYERS, {
    contingent: 'batsman',
    phase: 'death',
    query: '',
  });
  assert.ok(deathBatsmen.some((p) => p.id === 'andre-russell'));
  assert.ok(deathBatsmen.some((p) => p.id === 'tim-david'));

  const searchRashid = filterPlayers(PLAYERS, {
    contingent: 'all',
    phase: 'all',
    query: 'rashid',
  });
  assert.equal(searchRashid.length, 1);
  assert.equal(searchRashid[0].id, 'rashid-khan');
});

test('rankPlayersByMetric orders batting runs descending and bowling economy ascending', () => {
  const runsLeaderboard = rankPlayersByMetric(PLAYERS, 'overallRuns', 'batsman');
  assert.equal(runsLeaderboard[0].player.id, 'jos-buttler');
  assert.equal(runsLeaderboard[0].value, 14833);
  assert.equal(runsLeaderboard[1].player.id, 'virat-kohli');

  const econLeaderboard = rankPlayersByMetric(PLAYERS, 'overallEconomy', 'bowler');
  assert.equal(econLeaderboard[0].player.id, 'sunil-narine');
  assert.equal(econLeaderboard[0].value, 6.13);
  assert.equal(econLeaderboard[1].player.id, 'rashid-khan');
  assert.equal(econLeaderboard[2].player.id, 'jasprit-bumrah');
});

test('computeCircuitBreakdown reconciles IPL, T20I, and Global T20 totals', () => {
  const kohli = PLAYERS.find((p) => p.id === 'virat-kohli')!;
  const breakdown = computeCircuitBreakdown(kohli);
  assert.equal(breakdown.iplValue, 9336);
  assert.equal(breakdown.t20iValue, 4188);
  assert.equal(breakdown.otherValue, 14218 - 9336 - 4188);
  assert.equal(breakdown.iplSharePct + breakdown.t20iSharePct + breakdown.otherSharePct, 100);
});

test('buildPlayersCsv includes header and all 20 player rows', () => {
  const csv = buildPlayersCsv(PLAYERS);
  const lines = csv.trim().split('\n');
  assert.equal(lines.length, 21);
  assert.ok(lines[0].startsWith('Contingent,Rank,Player'));
  assert.ok(csv.includes('Virat Kohli'));
  assert.ok(csv.includes('Jasprit Bumrah'));
});
