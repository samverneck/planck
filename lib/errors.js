/**
 * Module with error types, used in planck. All types are global, and accesable in any module.
 * @module errors.js
 */

/**
 * @class
 * @classdesc AbstractClassError should be used for any errors in abstract classes, such as invoke
 * new AbstractClass();
 */
'use strict';
class AbstractClassError extends Error{
	constructor(msg){
		super(msg);
	}
	get name(){
		return "AbstractClassError"
	}
}

global.AbstractClassError = AbstractClassError;
