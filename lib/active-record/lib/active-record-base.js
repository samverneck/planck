import * as DBProvider from './active-record-db-provider/active-record-db-provider';

/**
 * @class  
 * @abstract
 * @classdesc Base class is the main class to inherit user models from
 */
class Base{
	constructor(){

	}
	/**
	 * Init method creates all logic which cannot be defined in constructor, such as dynamic getBy
	 * methods and chainable interface.
	 * @static
	 */
	static init(){
		if ((this === Base)||(!Base.isPrototypeOf(this))){
			throw new AbstractClassError("Cannot init Base class, you should extend it before");
		}

		/**
		 * @class  
		 * @classdesc Chainable class need to generate DB requests chain and create one query from
		 * them. Chainable should be Promise subclass for easier use in buisenes logic. Chainable
		 * should have all static methods from ActiveRecord.Base class for chaining.
		 */
		class Chainable extends Promise{
			constructor(executor, params){
				super(executor);
				this.chain = [params];
			}
		}

		const instance = new this;

		let dbProvider = new DBProvider.MongoProvider();

		const endChain = async function(chain, callback){
			let query = dbProvider.calcQuery(chain.chain);
			return query;
		};

		const chainableMethod = (method, params) => {
			if (this.chain){
				this.chain.push({method: method, params: params});
				return this;		
			}else{
				let chain = new Chainable((resolve, reject) => {
					process.nextTick(async () => {
						let query = await endChain.call(this, chain);
						resolve(query);
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
					return chainableMethod("getBy", params);
				};
			}
		}

		this.explain = function(){
			return chainableMethod("explain");
		};

		/**
		 * Builds query for finding object in DB by 1) its primary key 2) provided complex query.
		 * typeof primary key in params depends on used DB and may be string or number.
		 * @param {(...string|...number|string[]|number[]|Object)} primary keys or complex query
		 */
		this.get = function(...params){
			return chainableMethod("get", params);
		};

		this.useDB = function(){

		};

		Object.assign(Chainable.prototype, this);
	}

	static get database(){

	}

	static set database(database) {
		if ((this === Base)||(!Base.isPrototypeOf(this))){
			throw new AbstractClassError("Can not set property of abstract class");
		}
	}
}

export default Base;