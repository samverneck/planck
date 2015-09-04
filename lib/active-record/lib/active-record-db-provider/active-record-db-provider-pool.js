import BaseProvider from './lib/base-provider';
import MongoProvider from './lib/mongo-provider';
import {singleton} from '../../../decorators';

let getQueue = [];
let pendingConnections = 0;

@singleton
class ProviderPool{
	constructor(){
		this.databases = {

		};
	}

	async connect(name, dbParams){
		if (this.databases[name]){
			throw new Error("DB with same name already registered");
		}

		try{
			switch (dbParams.type){
				case "mongo": this.databases[name] = new MongoProvider(name, dbParams);
			}
			pendingConnections++;
			await this.databases[name].connect();
			for (var i = 0; i < getQueue.length; i++) {
				if (getQueue[i].name == name){
					getQueue[i].promise.resolve(this.databases[name]);
					getQueue.splice(i, 1);
				}
			};
		}catch(e){
			for (var i = 0; i < getQueue.length; i++) {
				if (getQueue[i].name == name){
					getQueue[i].promise.reject(e);
					getQueue.splice(i, 1);
				}
			};
			throw e;
		}finally{
			pendingConnections--;
			if (!pendingConnections){
				for (var i = 0; i < getQueue.length; i++) {
					getQueue[i].promise.resolve(this.databases[name]);
					getQueue.splice(i, 1);
				};
			}
		}
	}

	getProvider(name, dbParams){
		if (this.databases[name]){
			if (!dbParams){
				return Promise.resolve(this.databases[name]);
			}else{
				return Promise.reject(new Error("db with same name already registered"));
			}
		}
		let p = new Promise((resolve, reject) =>{
			getQueue.push({promise: {resolve: resolve, reject: reject}, name: name});
		});
		if (dbParams){
			this.connect(name, dbParams);
		}
		return p;
	}
	//TODO: add method registerProvider for user providers
}

export default ProviderPool;
