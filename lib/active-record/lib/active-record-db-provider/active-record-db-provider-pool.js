import BaseProvider from './lib/base-provider';
import MongoProvider from './lib/mongo-provider';

let providerPool;
let pendingConnects = [];

class ProviderPool{
	constructor(){
		if (providerPool){
			return providerPool;
		}
		this.databases = {

		};
		providerPool = this;
	}

	async connect(name, dbParams){
		if (this.databases[name]){
			throw new Error("DB with same name already registered");
		}
		switch (dbParams.type){
			case "mongo": this.databases[name] = new MongoProvider(dbParams);
		}
		//TODO: detect same dbs with different names
		await (() => {
			return new Promise((resolve, reject) => {
				setTimeout(resolve, 50); //emulating connect
			});
		})();
	}

	getProvider(name){
		return new Promise((resolve, reject) => {
			console.log(name);	
			if (this.databases[name]){
				resolve(this.databases[name]);
			}else{

			}
		});
	}
	//TODO: add method registerProvider for user providers
}

export default ProviderPool;