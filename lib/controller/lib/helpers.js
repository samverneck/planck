import * as View from '../../view/view.js';

let useViews = function(...views){
	return function(target, name, descriptor){
		let viewsToUse = [];
		for (var i = 0; i < views.length; i++) {
			if (typeof(views[i]) === "string" || views[i] === View.Base || View.Base.isPrototypeOf(views[i])){
				viewsToUse.push(views[i]);
			} else {
				console.error(`Can not use view ${views[i]}: it's not in a View.Base prototype chain!`)
			}
		}
		if (arguments.length === 1){ //decorator applied to class
			target.__views = viewsToUse;
		} else { //decorator applied to single method
			target.constructor["__views__"+name] = viewsToUse;
		}

		return descriptor;
	};
};

export {useViews};