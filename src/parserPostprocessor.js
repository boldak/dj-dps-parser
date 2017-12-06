
const LineMapper = require('./utils/lineMapper.js');
const ParserUtils = require('./utils/parserUtils');

const REF_PROCESS_ID = 'ref';


class ParserPostprocessor {

  constructor() {
  }

  static processContext(result, urlLookup) {
    result.forEach(c => {
        if (c.processId == "context" && c.settings.value.replace) {
            c.settings.value = c.settings.value.replace(urlLookup, ParserUtils.getUrl);
        }
    });
  }

  static processLineNumbers(result, strs) {
    result.forEach((c, i) => {

        c.line = LineMapper.findLineOfCommandStart(strs, i);
    });
  }

  static processRefferences(result, strs) {
    result.forEach(c => {
        if (c.processId == REF_PROCESS_ID) {
            c.settings = ParserUtils.parseRef(strs[c.line - 1])
        }
    });
  }
}


module.exports = ParserPostprocessor;
