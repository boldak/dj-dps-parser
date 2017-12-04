
const parser = require('../index');
const fs = require('fs');

fs.readFile('./file1.js', (err, data) => {
  const parsed = new parser().config().parse(data.toString());

  console.log(parsed);

  console.log(`parsed length: ${ parsed.length }`);
});
