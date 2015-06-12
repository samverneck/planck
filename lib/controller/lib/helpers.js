import * as View from '../../view/view.js';

let useViews = function(...views){
	return function(target, name, descriptor){
		views = views.filter(view => {
			if (typeof view === 'string' || view === View.Base || View.Base.isPrototypeOf(view)){
				return true;
			}
			console.error(`Can not use view ${view}: it's not in a View.Base prototype chain!`);
		});
		if (views.length){
			if (arguments.length === 1){ //decorator applied to class
				target.__views = views;
			} else { //decorator applied to single method
				target.constructor['__views__' + name] = views;
			}
		}
		return descriptor;
	};
};

let before = function(...beforeHandlers){
	return function(target, name, descriptor){
		beforeHandlers = beforeHandlers.filter(handler => {
			if ((typeof handler === 'function') || (typeof handler === 'string')){
				return true;
			}
			console.error(`Can not use ${handler}: it's not a function/string with function's name`);
		});
		if (beforeHandlers.length){
			if (arguments.length === 1){ //decorator applied to class
				if (!target.hasOwnProperty('__beforeHandlers')){
					target.__beforeHandlers = beforeHandlers;
				} else {
					target.__beforeHandlers = beforeHandlers.concat(target.__beforeHandlers);
				}
			} else { //decorator applied to single method
				if (!target.constructor.hasOwnProperty('__beforeHandlers__' + name)){
					target.constructor['__beforeHandlers__' + name] = beforeHandlers;
				} else {
					target.constructor['__beforeHandlers__' + name] = beforeHandlers.concat(target.constructor['__beforeHandlers__' + name]);
				}
			}
		}
		return descriptor;
	};
};

let after = function(...afterHandlers){
	return function(target, name, descriptor){
		afterHandlers = afterHandlers.filter(handler => {
			if ((typeof handler === 'function') || (typeof handler === 'string')){
				return true;
			}
			console.error(`Can not use ${handler}: it's not a function/string with function's name`);
		});
		if (afterHandlers.length){
			if (arguments.length === 1){ //decorator applied to class
				if (!target.hasOwnProperty('__afterHandlers')){
					target.__afterHandlers = afterHandlers;
				} else {
					target.__afterHandlers = afterHandlers.concat(target.__afterHandlers);
				}
			} else { //decorator applied to single method
				if (!target.constructor.hasOwnProperty('__afterHandlers__' + name)){
					target.constructor['__afterHandlers__' + name] = afterHandlers;
				} else {
					target.constructor['__afterHandlers__' + name] = afterHandlers.concat(target.constructor['__afterHandlers__' + name]);
				}
			}
		}
		return descriptor;
	};
};

export {useViews};
export {before};
export {after};
