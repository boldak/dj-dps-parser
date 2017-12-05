
const os = require('os');


class LineMapper {

// function to find correct line of code, which contains invalid COMMAND
// strs - script from input
// num - number of invalid command
  static findLineOfCommandStart(strs, num) {
    if (num < 0)
      return -1;

    const commandMap = strs.split(os.EOL);

    if (num >= commandMap.length)
      return -1;

    let iter = -1;

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

          if (iter == num || iter - 1 == num)
            return i + 1;

          while ((commandMap[i].indexOf('?>') == -1) && (i < commandMap.length))
            i++;

          continue;
        }

        // identify commands like "html(something)"
        if (commandMap[i].indexOf('(') != -1) {
          iter++;

          if (iter == num)
            return i + 1;

          while ((commandMap[i].indexOf(')') == -1) && (i < commandMap.length))
            i++;

          continue;
        } else {
          // if missing "()" after command
          if ((commandMap[i].trim() != ')') && (commandMap[i].trim() != '?>'))
            return i + 1;
        }
      }
    }

    return -1;
  }
}

module.exports = LineMapper;
