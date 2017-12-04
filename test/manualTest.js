
const parser = require('../index');


const parsed = new parser().config()
  .parse(
    `set('tags')

<?html
 DB totals:<br/>datasets:&nbsp;
?>
// test

/*
 test
*/

url("test")

append({{datasets}})
wrap(tag:'div', style:'margin:0')
html()`
  );

console.log(parsed);

console.log(`parsed length: ${ parsed.length }`);
