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
    codeGeneratorTriggers: Symbol('codeGeneratorTriggers'),
    DIResolver: Symbol('DIResolver'),
    invokeParams: Symbol('invokeParams'),
    dbProvider: Symbol('dbProvider'),
    dbSchema: Symbol('dbSchema'),
    dbDescriptor: Symbol('dbDescriptor'),
    dbPrimaryKey: Symbol('dbPrimaryKey')
};

function getFunctionParams(fn){
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

function isAnnotated(target, symbol){
    return target && symbol && symbols[symbol] && (Object.getOwnPropertySymbols(target).indexOf(symbols[symbol]) !== -1);
};

function annotate(target, symbol, data){
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

function invoke(fn, context, resolvers){
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

function invokeSuper(fn, context){
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

function construct(fn, resolvers){
    let params = fn[symbols.functionParamsPrepared].slice(0);
    for (let i = 0; i < fn[symbols.functionParams].length; i++) {
        let resolver = fn[symbols.DIResolver][fn[symbols.functionParams][i]];
        if (resolver) {
            params[i] = resolver(resolvers && resolvers[fn[symbols.functionParams][i]]);
        }
    }
    return new fn(...params);
};

function getMetadata(target, symbol){
    if (!target){
        throw new TypeError('cannot get metadata from empty target');
    }
    if (typeof symbol !== 'string'){
        throw new TypeError('symbol name must be a string!');
    }
    if (!(symbol = symbols[symbol])){
        throw new Error('cannot get metadata from target: wrong symbol name!');
    }
    return target[symbol];
}

export {
    getFunctionParams,
    isAnnotated,
    annotate,
    invoke,
    invokeSuper,
    construct,
    symbols,
    getMetadata
};
