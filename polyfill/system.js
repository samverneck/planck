import pathModule from 'path';
import deasync from 'deasync';
import Module from 'module';

global.System = global.System || {};
global.Reflect.Loader = global.Reflect.Loader || {};
Reflect.Loader.resolve = Reflect.Loader.resolve || Symbol('@@resolve');
Reflect.Loader.fetch = Reflect.Loader.fetch || Symbol('@@fetch');
Reflect.Loader.translate = Reflect.Loader.translate || Symbol('@@translate');
Reflect.Loader.instantiate = Reflect.Loader.instantiate || Symbol('@@instantiate');

System.loader = {

};

let _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

System.loader.import = function(path) {
    return new Promise(function(resolve, reject){
        try{
            if (!pathModule.isAbsolute(path)){
                path = pathModule.join(process.cwd(), path);
            }
            var _module = require(path);
            var module = _interopRequireWildcard(_module);
            resolve(module);
        } catch(e) {
            reject(e);
        }
    });
};

const _findPath = Module._findPath;

Module._findPath = function(request, paths, isMain) {
	let pathNormalized;
	if (paths && paths.length === 1){
		pathNormalized = pathModule.resolve(paths[0], request);
	} else {
		pathNormalized = pathModule.resolve(request);
	}


	let fetchSync = deasync(function(callback){
		System.loader[Reflect.Loader.fetch](null, pathNormalized)
			.then(res => callback(null, pathNormalized))
			.catch(e => callback(e));
	});
	fetchSync();

	return _findPath.call(this, request, paths, isMain);
};

System.loader[Reflect.Loader.fetch] = (entry, key) => {
	return Promise.resolve();
};
