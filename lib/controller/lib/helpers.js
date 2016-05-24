import * as View from '../../view/view';
import * as Reflection from '../../reflection';
import {CONTROLLER_DI_DYNAMIC_RESOLVERS} from '../../router/router';

let useViews = function(...views){
	return function(target, name, descriptor){
		views = views.filter(view => {
			if (typeof view === 'string' || view === View.Base || View.Base.isPrototypeOf(view)){
				return true;
			}
			console.error(`Can not use view ${view}: it's not in a View.Base prototype chain!`);
		});
		let annotateTarget = arguments.length === 1 ? target : descriptor.value;
		Reflection.annotate(annotateTarget, 'views', views);
	};
};

let before = function(...beforeHandlers){
	return function(target, name, descriptor){
		beforeHandlers = beforeHandlers.filter(handler => {
			if ((typeof handler === 'function') || (typeof handler === 'string')){
				return true;
			}
			if (!handler){
				console.error(`Can not use ${handler}: it's not a function/string with function's name/json with params`);
				return;
			}
			if (typeof handler.handler !== 'string' && typeof handler.handler !== 'function'){
				console.error(`Can not use ${handler.handler}: it's not a function/string with function's name`);
				return;
			}
			if (!handler.params){
				console.error(`Params for ${handler.handler} not provided`);
				return;
			}
			if (!Object.keys(handler.params).length){
				console.error(`Params for ${handler.handler} are empty`);
				return;
			}
			for (let param in handler.params){
				if (Object.keys(CONTROLLER_DI_DYNAMIC_RESOLVERS).indexOf(param) !== -1){
					console.error(`Can not use ${handler.handler}: name of param '${param}' is reserved. Please provide another name for param.`);
					return false;
				}
			}
			return true;
		});
		let annotateTarget = arguments.length === 1 ? target : descriptor.value;
		Reflection.annotate(annotateTarget, 'beforeHandlers', beforeHandlers);
	};
};

let skipBefore = function(...beforeHandlers){
	return function(target, name, descriptor){
		beforeHandlers = beforeHandlers.filter(handler => {
			if ((typeof handler === 'function') || (typeof handler === 'string')){
				return true;
			}
			console.error(`Can not skip ${handler}: it's allowed to skip only handlers in controller by handler's name or plain functions`);
		});
		let annotateTarget = arguments.length === 1 ? target : descriptor.value;
		Reflection.annotate(annotateTarget, 'skipBeforeHandlers', beforeHandlers);
	};
};

let after = function(...afterHandlers){
	return function(target, name, descriptor){
		afterHandlers = afterHandlers.filter(handler => {
			if ((typeof handler === 'function') || (typeof handler === 'string')){
				return true;
			}
			if (!handler){
				console.error(`Can not use ${handler}: it's not a function/string with function's name/json with params`);
				return;
			}
			if (typeof handler.handler !== 'string' && typeof handler.handler !== 'function'){
				console.error(`Can not use ${handler.handler}: it's not a function/string with function's name`);
				return;
			}
			if (!handler.params){
				console.error(`Params for ${handler.handler} not provided`);
				return;
			}
			if (!Object.keys(handler.params).length){
				console.error(`Params for ${handler.handler} are empty`);
				return;
			}
			for (let param in handler.params){
				if (Object.keys(CONTROLLER_DI_DYNAMIC_RESOLVERS).indexOf(param) !== -1){
					console.error(`Can not use ${handler.handler}: name of param '${param}' is reserved. Please provide another name for param.`);
					return false;
				}
			}
			return true;
		});
		let annotateTarget = arguments.length === 1 ? target : descriptor.value;
		Reflection.annotate(annotateTarget, 'afterHandlers', afterHandlers);
	};
};

let skipAfter = function(...beforeHandlers){
	return function(target, name, descriptor){
		beforeHandlers = beforeHandlers.filter(handler => {
			if ((typeof handler === 'function') || (typeof handler === 'string')){
				return true;
			}
			console.error(`Can not skip ${handler}: it's allowed to skip only handlers in controller by handler's name or plain functions`);
		});
		let annotateTarget = arguments.length === 1 ? target : descriptor.value;
		Reflection.annotate(annotateTarget, 'skipAfterHandlers', beforeHandlers);
	};
};

export {
	useViews,
	before,
	skipBefore,
	after,
	skipAfter
};
