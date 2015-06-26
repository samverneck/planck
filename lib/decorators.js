import {inject} from './dependency-injection';

let singleton = function(SingletonClass){
	let instance;
	return function(){
		if (!instance){
			instance = new SingletonClass(...arguments);
		}
		return instance;
	};
};

let abstractMethodAsync = function(message = "Can not set property of abstract class"){
	return function(target, name, descriptor){
		let _tmp = descriptor.value;
		descriptor.value = async function(...params){
			if ((this === target) || (this.constructor.prototype === target) || (!target.isPrototypeOf(this))){
				throw new AbstractClassError(message);
			}
			await _tmp.apply(this, params);
		};
		return descriptor;
	};
};

export {singleton};
export {abstractMethodAsync};
export {inject};
