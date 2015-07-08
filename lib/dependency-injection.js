import * as Reflection from './reflection.js';
import {symbols} from './reflection.js';

let inject = function(...dependencies) {
	for (let dependency of dependencies) {
		if (typeof dependency !== 'string'){
			throw new TypeError('dependencies must be strings');
		}
	}
	return function(target, name, descriptor){
		if (dependencies.length){
			let annotateTarget = arguments.length === 1 ? target : descriptor.value;
			if (!Reflection.isAnnotated(annotateTarget, 'functionParams')){
				Reflection.annotate(annotateTarget, 'functionParams', dependencies);
			} else {
				throw new Error('dependencies can be specified only once per target');
			}
		}
	};
};

let setStaticResolver = function(fn, resolver){
	fn[symbols.functionParamsPrepared] = fn[symbols.functionParamsPrepared] || [];
	for (let i = 0; i < fn[symbols.functionParams].length; i++) {
		if (typeof resolver[fn[symbols.functionParams][i]] !== 'undefined'){
			fn[symbols.functionParamsPrepared][i] = resolver[fn[symbols.functionParams][i]];
		}
	}
};

let setDynamicResolver = function(fn, resolver){
	fn[symbols.functionParamsPrepared] = fn[symbols.functionParamsPrepared] || [];
	fn[symbols.DIResolver] = resolver;
};

export {inject};
export {setStaticResolver};
export {setDynamicResolver};
