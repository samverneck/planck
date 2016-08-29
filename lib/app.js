/**
 * This module is an entry point of planck app
 * @module App
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

async function useRouterHTTP(routerHTTP){
	let router = null;
	router = await routerHTTP.create(this);
	return router; //Promise
};

function useExpressAppMiddleware(middleware){
	return this.httpApp.use(middleware);
};

function patchLoader(){
	if (this.config.codeGeneration.autoGeneration){
		const oldFetch = System.loader[Reflect.Loader.fetch];
		const app = this;
		System.loader[Reflect.Loader.fetch] = async function(entry, key){
			let configPath = pathModule.join(process.cwd(), app.config.models.path);
			let path = configPath;
			let index = key.indexOf(path);
			if (index !== -1){
				let name = key.slice(index + path.length, key.length);
				name = pathModule.basename(name, '.js');
				await app.codeGenerator.fireTrigger('NEW_MODEL', {name: name});
			}
			return await oldFetch.apply(this, arguments);
		};
	}
};

/**
 * App class is the main class and entry point of planck app
 */
class App{
	httpApp        = null;
	config         = null;
	dbProviderPool = null;
	httpServer     = null;
	codeGenerator  = null;

	/**
	 * @param {string|Object} [config] path to config or object with config data
	 */
	constructor(config){
		return Config.create(config).then(config => {
			this.config = config;
		}).then(() => {
			return CodeGenerator.create(this);
		}).then(codeGenerator => {
			this.codeGenerator = codeGenerator;
			return this;
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

	/**
	 * Starting server after all manual configuration
	 */
	async start(){
		patchLoader.call(this);
		this.dbProviderPool = new DBProviderPool();
		let providers = [];
		for (let i in this.config.database){
			providers.push(this.dbProviderPool.connect(i, this.config.database[i]));
		}
		if (!this.httpApp){
			providers.push(new Promise((resolve, reject) => {
				this.httpApp = express();
				if (this.config.bodyParser !== false){
					this.httpApp.use(bodyParser.json(this.config.bodyParser ? this.config.bodyParser : undefined));
				}
				this.httpServer = http.createServer(this.httpApp);
				this.httpServer.on('error', reject);
				this.httpServer.listen(this.config.http.port, () => {
					console.info(`Server started on ${this.config.http.port} port`);
					Router.RouterHTTP.prototype.httpServer = this.httpServer;
					this.httpServer.on('error', (err) => {
						console.error(err.stack);
					});
					resolve();
				});
			}));
		}
		await Promise.all(providers);
	}
}

export default App;
