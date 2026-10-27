import assert from 'node:assert/strict';
import test from 'node:test';
import { nameLoopFrame } from '../src/lib/nameLoop.ts';

test('manual prints once per source line while loop separates taking a value from printing', () => {
  assert.equal(nameLoopFrame('manual', 5, 3).printed, 3);
  assert.equal(nameLoopFrame('manual', 5, 3).line, 3);
  assert.equal(nameLoopFrame('manual', 5, 3).iteration, 3);
  assert.equal(nameLoopFrame('loop', 5, 1).printed, 0);
  assert.equal(nameLoopFrame('loop', 5, 2).printed, 1);
  assert.equal(nameLoopFrame('loop', 5, 3).printed, 1);
  for (const count of [5, 100]) {
    const end = nameLoopFrame('loop', count, 0).end;
    let prints = 0;
    for (let step = 1; step <= end; step++) {
      const frame = nameLoopFrame('loop', count, step);
      if (frame.line === 2) prints++;
      assert.equal(frame.done, step === end);
    }
    assert.equal(prints, count);
    assert.equal(nameLoopFrame('loop', count, end).printed, count);
    assert.equal(nameLoopFrame('loop', count, end).line, null);
  }
  assert.throws(() => nameLoopFrame('manual', 100, 0), RangeError);
  assert.throws(() => nameLoopFrame('loop', 5, 12), RangeError);
  assert.throws(() => nameLoopFrame('loop', 5, -1), RangeError);
});
