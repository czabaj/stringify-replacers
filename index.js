const { isArray  } = Array;
const isPlainObject = (value)=>value && typeof value === `object` && !isArray(value)
;
const pipeSecondArg = (replacers)=>function(k, v) {
        return replacers.reduce((acc, fn)=>fn.call(this, k, acc)
        , v);
    }
;
const pipeReplacers = (replacers)=>replacers.length === 0 ? undefined : replacers.length === 1 ? replacers[0] : pipeSecondArg(replacers)
;
const printType = Object.prototype.toString;
const identityReplacer = (k, v)=>v
;
const maxDepthReplacer = (maxDepth)=>{
    if (maxDepth === 0) {
        return identityReplacer;
    }
    if (maxDepth === 1) {
        return (k, v)=>k !== `` && v && typeof v === `object` ? printType.call(v) : v
        ;
    }
    const depthTrack = new Map();
    return function(k, v) {
        const currentDepth = depthTrack.get(this) || 0;
        if (v && typeof v === `object`) {
            if (currentDepth >= maxDepth) {
                return printType.call(v);
            }
            depthTrack.set(v, currentDepth + 1);
        }
        return v;
    };
};
const serializeMapReplacer = (k, v)=>v && v instanceof Map ? Object.fromEntries(v.entries()) : v
;
const replacerFromOptions = ({ maxDepth , supportMap  })=>pipeReplacers([
        supportMap && serializeMapReplacer,
        maxDepth && maxDepthReplacer(maxDepth)
    ].filter(Boolean))
;
const stringify1 = (value, replacer, space)=>JSON.stringify(value, isPlainObject(replacer) ? replacerFromOptions(replacer) : replacer, space)
;
export { stringify1 as stringify };
