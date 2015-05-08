export let abstractMethodAsync = function(message = "Can not set property of abstract class"){
	return function(target, name, descriptor){
		let _tmp = descriptor.value;
		descriptor.value = async function(...params){
			if ((this === target)||(!target.isPrototypeOf(this))){
				throw new AbstractClassError(message);
			}
			await _tmp.apply(this, params);
		}
		return descriptor;
	};
};