/**
 * This module is an entry point of planck app
 * @module app.js
 */

/**
 * @class
 * @classdesc App class is the main class and entry point of planck app
 */
import Config from './config';
import './errors';

import {DBProviderPool} from './active-record/lib/active-record-db-provider/active-record-db-provider';
import * as Router from './router/router';
import express from 'express';
import http from 'http';

const useRouterHTTP = function(routerHTTP){
	let router = null;
	router = routerHTTP.create(this);
	return router;
};

const useExpressAppMiddleware = function(middleware){
	return this.httpApp.use(middleware);
};

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
				this.httpApp = express();
				this.httpServer = http.createServer(this.httpApp);
				let providers = [];

				for (let i in config.database){
					providers.push(this.dbProviderPool.connect(i, config.database[i]));
				}
				providers.push(new Promise((resolve,reject) => {
					this.httpServer.on('error', (err) => {
						reject(err);
					});
					this.httpServer.listen(this.config.http.port, () => {
						console.info(`server started on ${this.config.http.port} port`);
						Router.RouterHTTP.prototype.httpServer = this.httpServer;
						//router.useResources(resources);
						this.httpServer.on('error', (err) => {
							console.error(err);
						});
						resolve();
					});
				}));
				Promise.all(providers).then(() => {
					resolve(this);
				}, (err) => {
					reject(err);
				});
			}, () => {
				reject(new TypeError("wrong config data, can not start app"));
			});
		});
	}
	/**
	 * Tell app to use helper/midllware/router etc
	 * @param {function} target helper to use
	 */
	use(target){
		if ((typeof target === 'function') && (target.length === 3 || target.length === 4)){
			return useExpressAppMiddleware.call(this, target);
		}
		if (Router.RouterHTTP.isPrototypeOf(target)){
			return useRouterHTTP.call(this, target);
		}
	}
}

export default App;
