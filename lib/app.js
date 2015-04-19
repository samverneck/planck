/**
 * This module is an entry point of planck app
 * @module app.js
 */

/**
 * @class  
 * @classdesc App class is the main class and entry point of planck app
 */
import Config from './config';

class App{
	/**
	 * @constructs App
	 * @param {string|Object} [config="{cwd}/config/main.js"] path to config or object with config data
	 */	
	constructor(config){
		if (typeof(config) === "undefined"){
			config=process.cwd()+"/config/main.js";
		}
		if (typeof(config) === "string"){
			
		}else if ((config !== null) && (typeof config === 'object') && !(config instanceof Array)){
			//Config.isValid
		}else{
			throw new TypeError("wrong config data, can not start app");
		}
	}
}

export default App;