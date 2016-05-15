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
import bodyParser from 'body-parser';
import CodeGenerator from './code-generator/code-generator';
import pathModule from 'path';

const useRouterHTTP = async function(routerHTTP){
	let router = null;
	router = await routerHTTP.create(this);
	return router; //Promise
};

const useExpressAppMiddleware = function(middleware){
	return this.httpApp.use(middleware);
};

const patchLoader = function(){
	if (this.config.codeGeneration.autoGeneration){
		const oldFetch = System.loader[Reflect.Loader.fetch];
		const app = this;
		System.loader[Reflect.Loader.fetch] = async function(entry, key){
			let configPath = pathModule.join(process.cwd(), app.config.models.path);
			let path = configPath;
			let index = key.indexOf(path);
			if (index !== -1){
				let name = key.slice(index + path.length, key.length);
				let pathFull = pathModule.join(app.config.models.path, pathModule.dirname(name));
				name = pathModule.basename(name, '.js');
				await CodeGenerator.generateIfNotExists('model', {name: name}, pathFull, app.config.models && app.config.models.template);
			}
			return await oldFetch.apply(this, arguments);
		};
	}
};

class App{
	/**
	 * @constructs App
	 * @param {string|Object} [config] path to config or object with config data
	 */
	constructor(config){
		return new Promise((resolve, reject) => {
			new Config(config).then(config => {
				this.config = config;
				patchLoader.call(this);
				this.dbProviderPool = new DBProviderPool();
				this.httpApp = express();
				if (config.bodyParser !== false){
					this.httpApp.use(bodyParser.json(config.bodyParser ? config.bodyParser : undefined));
				}
				this.httpServer = http.createServer(this.httpApp);
				let providers = [];

				for (let i in config.database){
					providers.push(this.dbProviderPool.connect(i, config.database[i]));
				}
				providers.push(new Promise((resolve, reject) => {
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
				return Promise.all(providers);
			}).then(() => {
				resolve(this);
			}).catch(reject);
		});
	}
	/**
	 * Tell app to use helper/midllware/router etc
	 * @param {function} target helper to use
	 */
	use(target){
		if (Router.RouterHTTP.isPrototypeOf(target)){
			return useRouterHTTP.call(this, target);
		}
		if ((typeof target === 'function') && (target.length === 3 || target.length === 4)){
			return useExpressAppMiddleware.call(this, target);
		}
	}
}

export default App;
