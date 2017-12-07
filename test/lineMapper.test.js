

const os = require('os');
const LineMapper = require('../src/utils/lineMapper');


const scripts = `set('tags')

<?html
  DB totals:<br/>datasets:&nbsp;
?>
// test

/*
  test
*/

append({{datasets}})
wrap(
  tag:'div', style:'margin:0'
)
html()`;

const script = scripts.parse('\n');

test('positive test of command mapping', () => {
  expect(LineMapper.findLineOfCommandStart(script, 0)).toBe(1);

  expect(LineMapper.findLineOfCommandStart(script, 3)).toBe(12);
  expect(LineMapper.findLineOfCommandStart(script, 5)).toBe(16);

  expect(LineMapper.findLineOfCommandStart(script, 1)).toBe(3);
  expect(LineMapper.findLineOfCommandStart(script, 2)).toBe(3);
});

test('negative test of command mapping', () => {
  expect(LineMapper.findLineOfCommandStart(script, -1)).toBe(-1);
  expect(LineMapper.findLineOfCommandStart(script, 100)).toBe(-1);

  expect(LineMapper.findLineOfCommandStart(script, 20)).toBe(-1);
});
