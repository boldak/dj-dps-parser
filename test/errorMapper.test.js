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


test('positive test of command mapping', () => {
  expect(LineMapper.findLineOfCommandStart(scripts, 0)).toBe(1);

  expect(LineMapper.findLineOfCommandStart(scripts, 3)).toBe(12);
  expect(LineMapper.findLineOfCommandStart(scripts, 5)).toBe(16);

  expect(LineMapper.findLineOfCommandStart(scripts, 1)).toBe(3);
  expect(LineMapper.findLineOfCommandStart(scripts, 2)).toBe(3);
});

test('negative test of command mapping', () => {
  expect(LineMapper.findLineOfCommandStart(scripts, -1)).toBe(-1);
  expect(LineMapper.findLineOfCommandStart(scripts, 100)).toBe(-1);

  expect(LineMapper.findLineOfCommandStart(scripts, 20)).toBe(-1);
});
