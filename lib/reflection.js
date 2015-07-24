/**
```Reflection``` is a module for operating all metadata in Planck. All metadata stored in objects by Symbols.
Metadata are used by all Planck's internal logic, but also can be used in user modules.
Since metadata stored by Symbols, it does not affect any user's interaction with objects
like JSON.stringify() or for-in cycles.
Reflection has it's own symbol registry for all types of metadata to prevent any possible
collisions with user's symbols. All ```Reflection``` methods are static.
@class Reflection
@static
@since 0.6.0
@main app.js
*/

const FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
const FN_ARG_SPLIT = /,/;
const FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

/**
Planck's symbol registry
@property symbols
@type Object
**/
const symbols = {
    functionParams: Symbol('functionParams'),
    functionParamsPrepared: Symbol('functionParamsPrepared'),
    beforeHandlers: Symbol('beforeHandlers'),
    skipBeforeHandlers: Symbol('skipBeforeHandlers'),
    afterHandlers: Symbol('afterHandlers'),
    skipAfterHandlers: Symbol('skipAfterHandlers'),
    views: Symbol('views'),
    DIResolver: Symbol('DIResolver'),
    invokeParams: Symbol('invokeParams')
};

/**
getFunctionParams is a method for retrieving function params names.
It works the same as in AngularJS - function are parses with some regexps and its params names are returns to user.
Parsed params names are also caсhes in that function in metadata field __@@functionParams__

    let foo = function(bar, baz){}
    let params = Reflection.getFunctionParams(foo);
    console.log(params); // ['bar', 'baz']
    console.log(foo[Reflection.symbols.functionParams]); // ['bar', 'baz']

@method getFunctionParams
@param {Function} fn function, whose params are retrieving
@return {String[]} array with names of function params
**/
let getFunctionParams = function(fn){
    let params;
    if (!(params = fn[symbols.functionParams])) {
        params = [];
        if (fn.length) {
            let fnText = fn.toString().replace(STRIP_COMMENTS, '');
            let argDecl = fnText.match(FN_ARGS);
            for (let arg of argDecl[1].split(FN_ARG_SPLIT)){
                arg.replace(FN_ARG, function(all, underscore, name) {
                    params.push(name);
                });
            }
        }
        fn[symbols.functionParams] = params;
    }
    return params;
};

/**
isAnnotated is a method for checking if target function are annotated via symbol or not.

    let foo = function(bar, baz){}
    console.log(Reflection.isAnnotated(foo, 'functionParams')); // false
    let params = Reflection.getFunctionParams(foo);
    console.log(Reflection.isAnnotated(foo, 'functionParams')); // true

@method isAnnotated
@param {Function} target function, whose metadata are checking
@param {string} symbol symbol name in Plank's registry to check
@return {boolean} true if function has something on provided symbol, otherwise false
**/
let isAnnotated = function(target, symbol){
    return !!(target && symbol && symbols[symbol] && (Object.getOwnPropertySymbols(target).indexOf(symbols[symbol]) !== -1));
};

let annotate = function(target, symbol, data){
    if (!target){
        throw new TypeError('cannot annotate empty target');
    }
    if (typeof symbol !== 'string'){
        throw new TypeError('symbol name must be a string!');
    }
    if (!(symbol = symbols[symbol])){
        throw new Error('cannot to annotate target: wrong symbol name!');
    }
    if (!(data instanceof Array)){
        data = [data];
    }
    if (data.length){
        if (Object.getOwnPropertySymbols(target).indexOf(symbol) !== -1){
            target[symbol] = data.concat(target[symbol]);
        } else {
            target[symbol] = data;
        }
    }
};

let invoke = function(fn, context, resolvers){
    let params = fn[symbols.functionParamsPrepared].slice(0);
    for (let i = 0; i < fn[symbols.functionParams].length; i++) {
        let resolver = fn[symbols.DIResolver][fn[symbols.functionParams][i]];
        if (resolver) {
            params[i] = resolver(resolvers && resolvers[fn[symbols.functionParams][i]]);
        }
    }
    context[symbols.invokeParams] = resolvers;
    return fn.apply(context, params);
};

let invokeSuper = function(fn, context){
    let resolvers = context[symbols.invokeParams];
    let params = fn[symbols.functionParamsPrepared].slice(0);
    for (let i = 0; i < fn[symbols.functionParams].length; i++) {
        let resolver = fn[symbols.DIResolver][fn[symbols.functionParams][i]];
        if (resolver) {
            params[i] = resolver(resolvers && resolvers[fn[symbols.functionParams][i]]);
        }
    }
    return fn.apply(context, params);
};

let construct = function(fn, resolvers){
    let params = fn[symbols.functionParamsPrepared].slice(0);
    for (let i = 0; i < fn[symbols.functionParams].length; i++) {
        let resolver = fn[symbols.DIResolver][fn[symbols.functionParams][i]];
        if (resolver) {
            params[i] = resolver(resolvers && resolvers[fn[symbols.functionParams][i]]);
        }
    }
    return new fn(...params);
};

export {
    getFunctionParams,
    isAnnotated,
    annotate,
    invoke,
    invokeSuper,
    construct,
    symbols
};
