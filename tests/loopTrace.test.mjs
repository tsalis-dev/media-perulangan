import assert from 'node:assert/strict';
import test from 'node:test';
import { createForTrace, createWhileTrace } from '../src/lib/loopTrace.ts';

test('for assigns before printing, excludes stop, and retains the final assigned value', () => {
  const trace = createForTrace();
  assert.deepEqual(trace[0].output, []);
  assert.equal(trace[0].value, null);
  assert.equal(trace[1].line, 1);
  assert.equal(trace[1].value, 1);
  assert.deepEqual(trace[1].output, []);
  assert.equal(trace[2].line, 2);
  assert.deepEqual(trace[2].output, [1]);
  assert.equal(trace[3].value, 2);
  assert.deepEqual(trace[3].output, [1]);
  assert.deepEqual(trace.at(-1).output, [1, 2, 3, 4, 5]);
  assert.equal(trace.at(-1).value, 5);
  assert.equal(trace.at(-1).phase, 'done');
  assert.ok(trace.every(frame => frame.value !== 6));
});

test('empty ranges never assign or print; direction follows the sign of step', () => {
  for (const args of [[3, 3, 1], [6, 1, 1], [1, 6, -1]]) {
    const trace = createForTrace(...args);
    assert.equal(trace.length, 2);
    assert.equal(trace.at(-1).value, null);
    assert.deepEqual(trace.at(-1).output, []);
  }
  assert.deepEqual(createForTrace(5, 0, -1).at(-1).output, [5, 4, 3, 2, 1]);
  assert.deepEqual(createForTrace(1, 6, 2).at(-1).output, [1, 3, 5]);
});

test('invalid parameters and oversized demonstrations fail before any UI execution', () => {
  for (const args of [[1, 6, 0], [NaN, 6, 1], [1, Infinity, 1], [1, 6, 0.5], [Number.MAX_SAFE_INTEGER + 1, 6, 1], [1, 1000, 1]]) {
    assert.throws(() => createForTrace(...args), RangeError);
  }
  assert.equal(createForTrace(1, 51, 1).at(-1).output.length, 50);
});

test('while checks, prints, then updates, and finally rejects 6 without printing it', () => {
  const trace = createWhileTrace();
  assert.equal(trace[1].line, 1);
  assert.deepEqual(trace.slice(2, 5).map(frame => [frame.phase, frame.line, frame.value]), [
    ['check', 2, 1], ['print', 3, 1], ['update', 4, 2],
  ]);
  assert.deepEqual(trace[3].output, [1]);
  assert.deepEqual(trace[4].output, [1]);
  const last = trace.at(-1);
  assert.equal(last.line, 2);
  assert.equal(last.value, 6);
  assert.equal(last.phase, 'done');
  assert.deepEqual(last.output, [1, 2, 3, 4, 5]);
  assert.equal(trace.filter(frame => frame.phase === 'check').length, 5);
  assert.deepEqual(trace[2].output, []);
  assert.notStrictEqual(trace[2].output, trace[3].output);
});

test('missing and wrong-direction updates pause safely without pretending Python has stopped', () => {
  const missing = createWhileTrace('none');
  assert.deepEqual(missing.at(-1).output, [1, 1, 1]);
  assert.equal(missing.at(-1).value, 1);
  assert.equal(missing.at(-1).line, 2);
  assert.equal(missing.at(-1).phase, 'paused');
  assert.ok(missing.every(frame => frame.line !== 4));
  const decrement = createWhileTrace('decrement');
  assert.deepEqual(decrement.at(-1).output, [1, 0, -1]);
  assert.equal(decrement.at(-1).value, -2);
  assert.equal(decrement.at(-1).phase, 'paused');
  assert.ok(decrement.length < 20);
  assert.ok(!decrement.some(frame => frame.phase === 'done'));
  assert.equal(createWhileTrace('increment').at(-1).phase, 'done');
  assert.throws(() => createWhileTrace('invalid'), RangeError);
});
