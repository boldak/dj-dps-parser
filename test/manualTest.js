
const parser = require('../index');


const parsed = new parser().config()
  .parse(
    `// <?json
//     "58d140c6087c0e04000ecd7b"
// ?>
// set('id')
// <?json
//     ["трамп","українськ","вася"]
// ?>
// set('tags')
////////////////////////////////////////////////


lib(url:'https://dj-dps.herokuapp.com/api/extension', as:'def'
load(cache:{{id}}, as:'json')
set("news")

call(
    ext:'def.load.rss.newsWordTable',
    news:{{news}},
    tags:{{tags}}
)
cache()
select('$.data_id')
set('res')
get('res[0]')
 `
  );

console.log(parsed);

console.log(`parsed length: ${ parsed.length }`);
