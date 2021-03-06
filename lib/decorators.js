import {inject} from './dependency-injection';

function singleton(SingletonClass){
	let instance;
	return function(){
		if (!instance){
			instance = new SingletonClass(...arguments);
		}
		return instance;
	};
};

function abstractMethodAsync(message = 'Can not set property of abstract class'){
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

function PROTECTED(target, name, descriptor){
	descriptor.enumerable = false;
	return descriptor;
};

export {singleton};
export {abstractMethodAsync};
export {inject};
export {PROTECTED, PROTECTED as PROT};
