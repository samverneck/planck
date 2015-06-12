import Base from './view-base.js';
import Json from './view-json.js';
import {singleton} from '../../decorators';

@singleton
class ViewPool {
	constructor(){
		this.pool = new Map();
		this.pool.set('base', new Base());
		this.pool.set('json', new Json());
	}
	async set(key){
		if (typeof(key) === "string"){
			try{
				let view = await System.import("views/"+key);
				this.pool.set(key, new view.default);
			}catch(e){
				console.error(`Could not find view ${key} for resource!`);
			}
		}else{
			this.pool.set(key.name, new key);
		}
	}
	async add(key){
		if (!this.get(key)){
			await this.set(key);
		}
	}
	get(key){
		if (typeof(key) === "string"){
			return this.pool.get(key);
		}else{
			return this.pool.get(key.name);
		}
	}
}

export default ViewPool;
