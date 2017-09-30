
// TODO refactor code

class ErrorMapper {

// function to find correct line of code, which contains invalid COMMAND
// strs - script from input
// num - number of invalid command
  static findLineOfCode(strs, num) {
    const commandMap = strs.split('\n');

    let iter = 0;

    for (let i = 0; i < commandMap.length; i++) {

      if (commandMap[i]) {
        if (commandMap[i].indexOf('<?') != -1) {
          iter++;

          if (iter == num || iter - 1 == num)
            return i;

          while ((commandMap[i].indexOf('?>') == -1) && (i < commandMap.length))
            i++;
        }

        if (commandMap[i].indexOf('(') != -1) {
          iter++;

          if (iter == num)
            return i;

          while ((commandMap[i].indexOf(')') == -1) && (i < commandMap.length))
            i++;
        }
      }
    }
  }
}

module.exports = ErrorMapper;
