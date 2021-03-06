
const util = require('util');
// TODO comment when launch
const refUtils = require('../../../dj-utils').reference;

const values = [];

class ParserUtils {
  constructor() {
  }

  lookup(o, keywords) {
      keywords =  keywords || {};

      if (util.isDate(o))
          return o;

      if (util.isString(o))
          return ((keywords[o.toLowerCase()]) ? keywords[o.toLowerCase()] : o);

      if (util.isArray(o)) {
          const res = [];
          o.forEach(item => {
              res.push(lookup(item,keywords))
          });

          return res;
      }

      if (util.isObject(o)) {
          const res = {};
          Object.keys(o).forEach(key => res[lookup(key,keywords)] = lookup(o[key],keywords));

          return res;
      }

      return o;
  }

  varIndex(tag) {
      let key = tag.substring(1, tag.length - 1);

      if (key.indexOf("?") == 0) {
          key = key
              .replace(/\"/gim, '\\"');

          let postProcess;
          key = key.replace(
              /(?:\?)(javascript|json|text|html|dps|xml|csv)/,
                  m => {
                      postProcess = m.substring(1);
                      return ""
                  }
              )
              .replace(/(^\?)|(\?$)/g, "")
              .replace(/\r/gim, "\\r")
              .replace(/\n/gim, "\\n")
              .replace(/\t/gim, "\\t")
              //.replace(/\"/gim, "'")

          values.push(key);

          return `context(value:^${values.length - 1});${postProcess}();`;
      } else {
          key = key.replace(/\"/gi, "'");
          values.push(key);

          return `^${values.length - 1}`;
      }
  }


  pushUrl(tag) {
      values.push(tag);

      return `^${values.length - 1}`;
  }


  getUrl(key) {
    return values[Number(key.substring(1))];
  }


  varValue(tag) {

      let key = tag.substring(1);
      let r = values[Number(key)];

      while (r.indexOf("^") == 0) {
          key = r.substring(1);
          r = values[Number(key)]
      }

      return `"${r}"`;
  }

  parseRef(refStr) {
    // TODO comment when launch
    return refUtils.parse(refStr);
  }
}

module.exports = new ParserUtils();
