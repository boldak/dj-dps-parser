
const parser = require('../index');
const fs = require('fs');

test('negative test of parsing', () => {
  function wrapper() {
    const text = fs.readFileSync('test/file1.js');
    return new parser().parse(text.toString());
  }

  expect(wrapper).toThrowError(/line 12/);
});
