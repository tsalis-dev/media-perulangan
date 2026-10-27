import assert from 'node:assert/strict';
import test from 'node:test';
import { formatTicket, getLabTool, labTools, MANUAL_LIMIT, printNext } from '../src/lib/presentation.ts';

test('only known laboratory routes select a tool; article anchors and unknown routes stay in the material page', () => {
  for (const tool of labTools) assert.equal(getLabTool(`#lab/${tool.id}`), tool.id);
  for (const hash of ['', '#materi', '#materi-for', '#materi-rangkuman', '#lab/unknown', '#lab/for/extra', '#lab/for?mode=other']) {
    assert.equal(getLabTool(hash), undefined);
  }
});

test('each manual click prints exactly one ticket and stops at the exercise limit', () => {
  let count = 0;
  const printed = [];
  for (let click = 0; click < MANUAL_LIMIT; click++) {
    count = printNext(count);
    printed.push(count);
  }
  assert.deepEqual(printed, [1, 2, 3, 4, 5]);
  assert.equal(printNext(count), MANUAL_LIMIT);
  assert.equal(formatTicket(1), '001');
  assert.equal(formatTicket(500), '500');
  assert.equal(formatTicket(1000), '1000');
});
