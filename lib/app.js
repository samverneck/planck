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
	 * @param {string|Object} [config] path to config or object with config data
	 */	
	constructor(config){
		return new Promise((resolve, reject) => {
			new Config(config).then((config) => {
				this.config = config;
				resolve(this);
			}, () => {
				reject(new TypeError("wrong config data, can not start app"));
			});
		});
	}
}

export default App;