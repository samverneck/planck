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
			if ((this === target) || (!target.isPrototypeOf(this))){
				throw new AbstractClassError(message);
			}
			await _tmp.apply(this, params);
		};
		return descriptor;
	};
};

let inject = function(...dependencies) {
	return function(target){
		for (let dependency of dependencies) {
			if (typeof dependency !== 'string'){
				throw new TypeError('dependencies must strings/objects');
			}
		}
		target.__dependencies = dependencies; //TODO: change on Symbol, used for all DI in project
	};
};

export {singleton};
export {abstractMethodAsync};
export {inject};
