/**
 * This module is an entry point of planck app
 * @module app.js
 */

/**
 * @class  
 * @classdesc App class is the main class and entry point of planck app
 */
import Config from './config';
import {DBProviderPool} from './active-record/lib/active-record-db-provider/active-record-db-provider.js';

class App{
	/**
	 * @constructs App
	 * @param {string|Object} [config] path to config or object with config data
	 */	
	constructor(config){
		return new Promise((resolve, reject) => {
			new Config(config).then((config) => {
				this.config = config;
				this.dbProviderPool = new DBProviderPool();
				let dbProviders = [];
				for (let i in config.database){
					dbProviders.push(this.dbProviderPool.connect(i, config.database[i]))
				}
				Promise.all(dbProviders).then(() => {
					resolve(this);
				}, (err) => {
					reject(err);
				})
			}, () => {
				reject(new TypeError("wrong config data, can not start app"));
			});
		});
	}
}

export default App;