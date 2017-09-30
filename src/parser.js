
import util from "util";

import ParserError from "./exceptions/parserError";



const valuesRE = /'((?:\\\\[\'bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\'\\\\])*)'|\"((?:\\\\[\"bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\"\\\\])*)\"/gim;
const lineCommentRE = /\/\/[\w\S\ .\t\:\,;\'\"\(\)\{\}\[\]0-9-_]*(?:[\n\r]*)/gi;
const lineRE = /[\r\n\t\s]*/gim;
const inlineCommentRE = /\/\*[\w\W\b\.\t\:\,;\'\"\(\)\{\}\[\]\*0-9-_]*(?:\*\/)/gim;
const commandSplitRE = /(\))([a-zA-Z@])/gim;
const nonbrackedParamsRE = /\(([\w\b\.\t\:\,\'\"0-9-_]+[\w\b\.\t\:\,\'\"\[\]\^0-9-_]*)\)/gi;
const propertyNameRE = /((@[a-zA-Z\-_\.]+|[a-zA-Z\-_\.]+)(?=[\(\)\{\}\:\[\]\s]+))/gim;
const emptyPropsListRE = /\(\s*\)/gi;
const defaultValueRE = /\:\{\^*[0-9]+\};/gi;
const defaultStoredValueRE = /\:\^[0-9]+;/gi;
const urlLookup = /\^[0-9]+/gi;
const commandNameRE = /"@*([a-zA-Z0_-]+[a-zA-Z0-9_-]*\.*)+":/gi;
const paramsRE = /:[\{\^\[]+[a-zA-Z0-9_:",\^\{\}\[\]-]*[\}\]]+;*|:\^[0-9]+;*/gi;

const scriptRE = /(\<\?([^?]|(\?+[^?\>]))*\?\>)/g;

const bindableRE = /({{[a-zA-Z\$\_]+[a-zA-Z0-9\$\_\.\[\]\"\']*}})/g;

const urlRE = /((https?:\/\/)([a-zA-Z0-9]+[a-zA-Z0-9_-]*)(:\d{0,4})?([a-zA-Z0-9_\-\/\%\=\{\}\?\+\&\.\:]*))/g;

class ScriptParser {
    constructor() {
        this.defaultPropName = {}
        this.keywords = {};
        this.commands = {};
    }

    config(commands) {
        if (!commands)
          return this;

        if (!util.isArray(commands)) commands = [commands]

        commands.forEach(command => {
            Object.keys(command.defaultProperty).forEach(k => this.defaultPropName[k] = command.defaultProperty[k]);

            Object.keys(command.synonims).forEach(k => this.keywords[key] = command.synonims[key]);

            this.commands[command.name] = command;
        });

        return this;
    }

    parse(str) {
        const self = this;

        // const lookup = (o, keywords) => {
        //     keywords =  keywords || {};
        //
        //     if (util.isDate(o))
        //         return o;
        //
        //
        //     if (util.isString(o))
        //         return ((keywords[o.toLowerCase()]) ? keywords[o.toLowerCase()] : o);
        //
        //
        //     if (util.isArray(o)) {
        //         const res = [];
        //         o.forEach(item => {
        //             res.push(lookup(item,keywords))
        //         });
        //
        //         return res;
        //     }
        //
        //     if (util.isObject(o)) {
        //
        //         const res = {};
        //         // for (var key in o) {
        //         //     res[lookup(key,keywords)] = lookup(o[key],keywords)
        //         // }
        //
        //         Object.keys(o).forEach(key => res[lookup(key,keywords)] = lookup(o[key],keywords));
        //
        //         return res;
        //     }
        //
        //     return o;
        // };

        const values = [];


        const varIndex = (tag) => {
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
        };

        const pushUrl = (tag) => {
            values.push(tag);
            return `^${values.length - 1}`;
        };


        const getUrl = (key) => values[Number(key.substring(1))];

        const varValue = (tag) => {

            let key = tag.substring(1);
            let r = values[Number(key)];

            while (r.indexOf("^") == 0) {
                key = r.substring(1);
                r = values[Number(key)]
            }

            // if (r.indexOf("?") == (r.length-1)) {
            //     return '"' + r + '"'
            // }

            return `"${r}"`;
        };

        let p = str
            .replace(scriptRE, varIndex)
            .replace(urlRE, pushUrl)
            .replace(bindableRE,"\"$1\"")

            .replace(lineCommentRE, "")
            .replace(valuesRE, varIndex)
            .replace(lineRE, "")
            .replace(inlineCommentRE, "")



            .replace(commandSplitRE, "$1;$2")
            .replace(nonbrackedParamsRE, "({$1})")
            .replace(propertyNameRE, "\"$1\"")
            .replace(/\'/gim, "\"")
            .replace(emptyPropsListRE, "({})")
            .replace(/\(/gim, ":")
            .replace(/\)/gim, "");

        // console.log(p)

        try {
            p = p
                .split(";")
                .map(item => `${item};`)
                .map(cmd => {
                    if (cmd == ";") {
                        return cmd
                    }
                    // console.log("MAP ", cmd)
                    let cmdName = cmd.match(commandNameRE)[0];
                    cmdName = cmdName.substring(1, cmdName.length - 2)
                    const params = cmd.match(paramsRE).map(item => {
                        if (item.match(defaultValueRE)) {
                            var p;
                            if (item.match(/\:\{\^/gi)) {
                                p = item.substring(3, item.length - 3)
                            } else if (item.match(/\:\{/gi)) {
                                p = item.substring(2, item.length - 2)
                            }
                            return `:{"${self.defaultPropName[cmdName]}":${p}}`
                        }
                        if (item.match(defaultStoredValueRE)) {
                            var p = item.substring(1, item.length - 1)
                            return `:{"${self.defaultPropName[cmdName]}":${p}}`
                        }
                        return item
                    });

                    return `"${cmdName}"${params[0]}`
                })
                .join(";")
                .replace(/;;/gi, ";");

            // console.log("AFTER MAP ", p)
            // p = p.replace(/\^[0-9]+/gim, varValue)


            const script = [];
            const cmd = p.split(";");
            cmd.forEach(cm => {
                // console.log('Parse:',"{" + cm.replace(/\^[0-9]+/gim, varValue) + "}")
                const t = JSON.parse(`{${cm.replace(/\^[0-9]+/gim, varValue)}}`);
                script.push(t)

            })

            const result = script.map(c => {

                const res = {
                    processId: lookup(Object.keys(c)[0],self.keywords),
                    settings: c[Object.keys(c)[0]]
                };

                if(self.commands[res.processId]){
                    res.settings = lookup(res.settings,self.commands[res.processId]["internal aliases"])
                }
                return res;
            })
            .filter(c => c.processId);
        } catch (e) {
            throw new ParserError(e.toString());
        }

        result.forEach(c => {
            if (c.processId == "context" && c.settings.value.replace) {
                c.settings.value = c.settings.value.replace(urlLookup, getUrl)
            }
        })

        return result;
    }

    stringify(script) {
        return script.map(c => `${c.processId}(${JSON.stringify(c.settings)})`).join(";")
    }

    applyContext(template, context) {
        const getContextValue = function() {
            const tags = arguments[1].split(".");
            let value = context;
            tags.forEach(tag => {
                tag = tag.trim();
                value = value[tag]
            })

            return value
        };
        return template.replace(/(?:\{\{\s*)([a-zA-Z0-9_\.]*)(?:\s*\}\})/gim, getContextValue)
    }
}

export default ScriptParser;
