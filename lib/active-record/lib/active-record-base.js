import {DBProviderPool} from './active-record-db-provider/active-record-db-provider';
import {abstractMethodAsync} from '../../decorators';

const dbProviderPool = new DBProviderPool();
/**
 * @class Base
 * @constructor
 * Base class is the main class to inherit user models from
 */
class Base{
	constructor(){

	}
	/**
	 * Init method creates all logic which cannot be defined in constructor, such as dynamic getBy
	 * methods and chainable interface.
	 * @static
	 */
	@abstractMethodAsync("Cannot init Base class, you should extend it before")
	static async init(){
		const instance = new this;

		/**
		 * @class Chainable
		 * @constructor
		 * Chainable class need to generate DB requests chain and create one query from
		 * them. Chainable should be Promise subclass for easier use in buisenes logic. Chainable
		 * should have all static methods from ActiveRecord.Base class for chaining.
		 */
		class Chainable extends Promise{
			constructor(executor, params){
				super(executor);
				this.chain = [params];
			}
		}

		const endChain = async function(chain, callback){
			let query = this.__dbProvider.calcQuery(chain.chain);
			return query;
		};

		const chainableMethod = function(method, params) {
			if (this.chain){
				this.chain.push({method: method, params: params});
				return this;
			}else{
				let chain = new Chainable((resolve, reject) => {
					process.nextTick(async () => {
						try{
							let query = await endChain.call(this, chain);
							resolve(query);
						} catch(e) {
							reject(e);
						}
					});
				}, {method: method, params: params});
				return chain;
			}
		};

		for (let i in instance){
			if (((typeof(instance[i]) === "number") ||
				(typeof(instance[i]) === "string") ||
				(typeof(instance[i]) === "boolean")) &&
				(typeof(this["getBy"+i.charAt(0).toUpperCase() + i.slice(1)]) != "function"))
			{
				this["getBy"+i.charAt(0).toUpperCase() + i.slice(1)] = function(...params){
					return chainableMethod.call(this, "getBy", params);
				};
			}
		}

		this.explain = function(){
			return chainableMethod.call(this, "explain");
		};

		/**
		 * Builds query for finding object in DB by 1) its primary key 2) provided complex query.
		 * typeof primary key in params depends on used DB and may be string or number.
		 * @param {(...string|...number|string[]|number[]|Object)} primary keys or complex query
		 */
		this.get = function(...params){
			//return chainableMethod("get", params);
			return chainableMethod.call(this, "get", params);
		};

		Object.assign(Chainable.prototype, this);
		await this.useDB("default");
		return true;
	}

	@abstractMethodAsync()
	static async useDB(database, config) {
		try{
			this.__dbProvider = await dbProviderPool.getProvider(database, config);
		}catch(e){
			throw e;
		}
	}
}

export default Base;
