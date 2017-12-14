
const ParserError = require('./exceptions/parserError');


class ParserPreprocessor {

  constructor() {
  }

  static bracketsAnalizator(commandMap) {
    let iter = -1;

    for (let i = 0; i < commandMap.length; i++) {

      if (commandMap[i]) {
        // skip comments
        if (commandMap[i].indexOf('/*') != -1) {
          while ((commandMap[i].indexOf('*/') == -1) && (i < commandMap.length))
            i++;

          continue;
        }

        if (commandMap[i].trim().indexOf('/') == 0)
          continue;

        if (commandMap[i].indexOf('<*') != -1) {
          while ((commandMap[i].indexOf('*>') == -1) && (i < commandMap.length))
            i++;

          continue;
        }

        // identify commands like "<?html something ?>"
        if (commandMap[i].indexOf('<?') != -1) {
          iter += 2;

          while ((commandMap[i].indexOf('?>') == -1) && (i < commandMap.length))
            i++;

          continue;
        }

        // identify commands like "command(something)"
        if (commandMap[i].indexOf('(') != -1) {
          iter++;

          while ((commandMap[i].indexOf(')') == -1) && (i < commandMap.length)) {
            i++;

            if ((commandMap[i].indexOf('(') != -1) || (commandMap[i].indexOf('<?') != -1))
              throw new ParserError("invalid number of brackets", iter + 1, i);
          }

          continue;
        }
      }
    }
    return;
  }
}


module.exports = ParserPreprocessor;
