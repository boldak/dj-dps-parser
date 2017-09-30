export default class ParserUtils {
  static lookup(o, keywords) {
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
          // for (var key in o) {
          //     res[lookup(key,keywords)] = lookup(o[key],keywords)
          // }

          Object.keys(o).forEach(key => res[lookup(key,keywords)] = lookup(o[key],keywords));

          return res;
      }

      return o;
  }

}
