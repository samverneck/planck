const FN_ARGS = /^[function]?\s*[^\(]*\(\s*([^\)]*)\)/m;
const FN_ARG_SPLIT = /,/;
const FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

const symbols = {
    functionParams: Symbol('functionParams'),
    functionParamsPrepared: Symbol('functionParamsPrepared'),
    beforeHandlers: Symbol('beforeHandlers'),
    skipBeforeHandlers: Symbol('skipBeforeHandlers'),
    afterHandlers: Symbol('afterHandlers'),
    skipAfterHandlers: Symbol('skipAfterHandlers'),
    views: Symbol('views'),
    DIResolver: Symbol('DIResolver'),
    invokeParams: Symbol('invokeParams'),
    dbProvider: Symbol('dbProvider'),
    dbSchema: Symbol('dbSchema'),
    dbDescriptor: Symbol('dbDescriptor'),
    dbPrimaryKey: Symbol('dbPrimaryKey')
};

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

let isAnnotated = function(target, symbol){
    return target && symbol && symbols[symbol] && (Object.getOwnPropertySymbols(target).indexOf(symbols[symbol]) !== -1);
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
    //context[symbols.invokeParams] = resolvers;
    if (!context.__invokeParams) {
        Object.defineProperty(context, '__invokeParams', {
            enumerable: false,
            value: resolvers
        });
    }

    return fn.apply(context, params);
};

let invokeSuper = function(fn, context){
    // let resolvers = context[symbols.invokeParams];
    let resolvers = context['__invokeParams'];
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
