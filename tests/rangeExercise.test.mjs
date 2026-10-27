import assert from 'node:assert/strict';
import test from 'node:test';
import { challengeIds, challenges, newRangeExercise, newRangeLabState, nextRangeChallenge, rangeLiteral, runRangeExercise, selectRangeChallenge } from '../src/lib/rangeExercise.ts';

test('both exercises accept the requested output, including equivalent exclusive boundaries', () => {
  for (const stop of ['11', '12']) {
    const result = runRangeExercise('even', { start: '2', stop, step: '2' });
    assert.equal(result.ok, true);
    assert.equal(result.solved, true);
    assert.deepEqual(result.output, [2, 4, 6, 8, 10]);
  }
  const countdown = runRangeExercise('countdown', { start: '5', stop: '0', step: '-1' });
  assert.equal(countdown.solved, true);
  assert.deepEqual(countdown.output, [5, 4, 3, 2, 1]);
});

test('exclusive-stop mistakes and valid empty ranges are explained without being rejected', () => {
  const short = runRangeExercise('even', { start: '2', stop: '10', step: '2' });
  assert.equal(short.ok, true);
  assert.equal(short.solved, false);
  assert.deepEqual(short.output, [2, 4, 6, 8]);
  for (const fields of [{ start: '5', stop: '0', step: '1' }, { start: '1', stop: '6', step: '-1' }, { start: '2', stop: '2', step: '1' }]) {
    const empty = runRangeExercise('countdown', fields);
    assert.equal(empty.ok, true);
    assert.equal(empty.solved, false);
    assert.deepEqual(empty.output, []);
    assert.match(empty.message, /Tidak ada output/);
  }
});

test('blank, decimal, exponent, unsafe, zero-step and oversized inputs cannot run', () => {
  for (const invalid of ['', ' ', '-', '2.5', '1e2', 'Infinity', '9007199254740992']) {
    const result = runRangeExercise('even', { start: invalid, stop: '11', step: '2' });
    assert.equal(result.ok, false);
    assert.equal(result.field, 'start');
  }
  assert.equal(runRangeExercise('even', { start: '2', stop: '11', step: '0' }).field, 'step');
  assert.equal(runRangeExercise('even', { start: '1', stop: '1000', step: '1' }).ok, false);
  assert.equal(runRangeExercise('even', { start: ' +2 ', stop: '11', step: '2' }).solved, true);
  assert.equal(rangeLiteral('02'), '2');
  assert.equal(rangeLiteral('-01'), '-1');
  assert.equal(rangeLiteral('1e2'), '…');
  assert.equal(rangeLiteral(''), '…');
  assert.equal(runRangeExercise('even', { start: '02', stop: '011', step: '02' }).solved, true);
});

test('reset produces independent empty results and fields for each exercise', () => {
  const first = newRangeExercise();
  const second = newRangeExercise();
  first.fields.start = '2';
  assert.equal(second.fields.start, '1');
  assert.equal(first.result, null);
  assert.equal(second.result, null);
});

test('all 20 challenges have distinct targets and accept equivalent exclusive boundaries', () => {
  assert.equal(challengeIds.length, 20);
  assert.equal(new Set(challengeIds.map(id => JSON.stringify(challenges[id].target))).size, 20);
  for (const id of challengeIds) {
    const target = challenges[id].target;
    const step = target[1] - target[0];
    for (const stop of [target.at(-1) + Math.sign(step), target.at(-1) + step]) {
      const result = runRangeExercise(id, { start: String(target[0]), stop: String(stop), step: String(step) });
      assert.equal(result.solved, true, id);
      assert.deepEqual(result.output, target, id);
    }
  }
});

test('random rounds visit every challenge exactly once, including repeated rounds', t => {
  t.mock.method(Math, 'random', () => 0.37);
  let state = newRangeLabState();
  let previous;
  for (let round = 0; round < 3; round++) {
    const visited = [];
    for (let index = 0; index < challengeIds.length; index++) {
      assert.notEqual(state.challenge, previous);
      visited.push(state.challenge);
      previous = state.challenge;
      assert.equal(state.remaining.length, challengeIds.length - index - 1);
      state = nextRangeChallenge(state);
    }
    assert.deepEqual([...visited].sort(), [...challengeIds].sort());
  }
});

test('the shuffle responds to randomness and a new round avoids an immediate repeat while clearing old attempts', t => {
  let randomValue = 0;
  t.mock.method(Math, 'random', () => randomValue);
  const first = newRangeLabState();
  randomValue = 0.999999;
  const different = newRangeLabState();
  assert.notDeepEqual([first.challenge, ...first.remaining], [different.challenge, ...different.remaining]);
  randomValue = 0;
  first.remaining = [];
  first.exercises.even.fields.start = '2';
  first.exercises.even.result = runRangeExercise('even', { start: '2', stop: '11', step: '2' });
  const next = nextRangeChallenge(first);
  assert.notEqual(next.challenge, first.challenge);
  assert.equal(next.remaining.length, 19);
  assert.deepEqual(next.exercises.even, newRangeExercise());
  assert.equal(first.exercises.even.result.solved, true);
  assert.deepEqual([...next.remaining, next.challenge].sort(), [...challengeIds].sort());
});

test('manual selection removes an unseen challenge once and preserves independent attempts', () => {
  const initial = newRangeLabState();
  const selected = initial.remaining[0];
  initial.exercises[selected].fields.start = '22';
  const opened = selectRangeChallenge(initial, selected);
  assert.equal(opened.challenge, selected);
  assert.equal(opened.remaining.length, 18);
  assert.equal(opened.remaining.includes(selected), false);
  assert.equal(initial.remaining.length, 19);
  assert.equal(selectRangeChallenge(opened, selected).remaining.length, 18);
  assert.equal(opened.exercises[selected].fields.start, '22');
  assert.equal(opened.exercises[initial.challenge].fields.start, '1');
  assert.equal(newRangeLabState().exercises[selected].fields.start, '1');
});

test('feedback identifies the starting value, step direction, or exclusive stop for the active target', () => {
  assert.match(runRangeExercise('offset', { start: '21', stop: '33', step: '3' }).message, /pertama target adalah 20/);
  assert.match(runRangeExercise('negativeDown', { start: '-1', stop: '-8', step: '-2' }).message, /selisih antarangka target: -1/);
  assert.match(runRangeExercise('even', { start: '2', stop: '10', step: '2' }).message, /Start dan Step sudah sesuai.*10.*eksklusif/);
});
