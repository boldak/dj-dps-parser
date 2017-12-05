
const ParserError = require('./exceptions/parserError');
const os = require('os');


class ParserPreprocessor {

  constructor() {
  }

  static bracketsAnalizator(strs) {
    let iter = -1;

    const commandMap = strs.split(os.EOL);

    for (let i = 0; i < commandMap.length; i++) {

      if (commandMap[i]) {
        // skip comments
        if (commandMap[i].trim().indexOf('/') == 0)
          continue;

        if (commandMap[i].indexOf('/*') != -1) {
          while ((commandMap[i].indexOf('*/') == -1) && (i < commandMap.length))
            i++;

          continue;
        }

        // identify commands like "<?html something ?>"
        if (commandMap[i].indexOf('<?') != -1) {
          iter += 2;

          while ((commandMap[i].indexOf('?>') == -1) && (i < commandMap.length)) {
            i++;

            if ((commandMap[i].indexOf('(') != -1) || (commandMap[i].indexOf('<?') != -1))
              throw new ParserError("invalid number of brackets", iter + 1, i);
          }

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
        } // else {
          // if missing "()" after command
          // if ((commandMap[i].trim() != ')') && (commandMap[i].trim() != '?>'))
            // throw new ParserError("invalid number of brackets", iter, i + 1);
        // }
      }
    }
    return;
  }
}


module.exports = ParserPreprocessor;
