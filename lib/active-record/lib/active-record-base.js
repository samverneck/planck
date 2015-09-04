import {DBProviderPool} from './active-record-db-provider/active-record-db-provider';
import {abstractMethodAsync} from '../../decorators';
import {symbols} from '../../reflection';

const states = {
	initial: {
		final: false
	},
	getAll: {
		final: true
	},
	getSingleByID: {
		final: true
	},
	getMultipleByID: {
		final: true
	},
	countCollection: {
		final: true
	},
	countQuery: {
		final: true
	},
	sort: {
		final: true
	}
};

const dbProviderPool = new DBProviderPool();
/**
 * @class
 * @abstract
 * @classdesc Base class is the main class to inherit user models from
 */
class Base{
	constructor(initParams){
		for (let i in initParams) {
			this[i] = initParams[i];
		}
		this[symbols.dbDescriptor] = {
			isNew: true
		};
	}
	/**
	 * Init method creates all logic which cannot be defined in constructor, such as dynamic getBy
	 * methods and chainable interface.
	 * @static
	 */
	@abstractMethodAsync('Cannot init Base class, you should extend it before')
	static async init(){
		const instance = new this();

		/**
		 * @class
		 * @classdesc Chainable class need to generate DB requests chain and create one query from
		 * them. Chainable should be Promise subclass for easier use in buisenes logic. Chainable
		 * should have all static methods from ActiveRecord.Base class for chaining.
		 */
		class Chainable extends Promise{
			constructor(executor, params, state){
				super(executor);
				this.chain = [params];
				this.state = state;
			}
		}

		const endChain = async function(chain){
			let result = await this[symbols.dbProvider].execQuery(chain.chain, this, chain.state);
			return result;
		};

		const chainableMethod = function(method, params, newState) {
			if (this.chain){
				this.chain.push({method: method, params: params});
				this.newState = this.newState || newState;
				return this;
			}
			let chain = new Chainable((resolve, reject) => {
				process.nextTick(async () => {
					console.log(chain.state);
					if (states[chain.state] && states[chain.state].final){
						try{
							let query = await endChain.call(this, chain);
							return resolve(query);
						} catch(e) {
							return reject(e);
						}
					}
					reject(new Error('Chain of methods to ActiveRecord stoped at non-final state'));
				});
			}, {method: method, params: params}, newState);
			return chain;
		};

		for (let i in instance){
			if (((typeof instance[i] === 'number') ||
				(typeof instance[i] === 'string') ||
				(typeof instance[i] === 'boolean')) &&
				(typeof this['getBy' + i.charAt(0).toUpperCase() + i.slice(1)] !== 'function'))
			{
				this['getBy' + i.charAt(0).toUpperCase() + i.slice(1)] = function(...params){
					return chainableMethod.call(this, 'getBy', params);
				};
			}
		}
		this.prototype[symbols.dbSchema].tableName = this.prototype[symbols.dbSchema].tableName || this.name;

		this.explain = function(){
			return chainableMethod.call(this, 'explain');
		};

		/**
		 * Builds query for finding object in DB by 1) its primary key 2) provided complex query.
		 * typeof primary key in params depends on used DB and may be string or number.
		 * @param {(...string|...number|string[]|number[]|Object)} primary keys or complex query
		 */
		this.get = function(...params){
			switch (this.state || 'initial'){
				case 'initial':
					if (params.length === 0){
						return chainableMethod.call(this, 'get', undefined, 'getAll');
					}
					if (params.length === 1){
						return chainableMethod.call(this, 'get', params, 'getSingleByID');

						// if (typeof params[0] === 'string' || typeof block.params[0] === 'number'){
						// 	try{
						// 		query.query._id = new ObjectID(block.params[0]);
						// 	} catch (e) {
						// 		throw new TypeError(`Argument to Base.get is not a valid MongoID`);
						// 	}
						// }  else if ((block.params[0] !== null) && (typeof block.params[0] === 'object') && !(block.params[0] instanceof Array)){
						//
						// } else {
						// 	throw new TypeError('Arguments to Base.get must be strings, array of strings or Object');
						// }
					}
					return chainableMethod.call(this, 'get', params, 'getMultipleByID');
				break;
				default:
					throw new Error(`Using 'get' method here is not allowed`);
			}
		};

		this.skip = function(count){
			switch (this.state || 'initial'){
				case 'getAll':
				case 'getMultipleByID':
					if (typeof count !== 'number'){
						throw new Error('Skip count must be a number!');
					}
					return chainableMethod.call(this, 'skip', count);
				break;
				default:
					throw new Error(`Using 'skip' method here is not allowed`);
			}
		};

		this.limit = function(count){
			switch (this.state || 'initial'){
				case 'getAll':
				case 'getMultipleByID':
					if (typeof count !== 'number'){
						throw new Error('Limit must be a number!');
					}
					return chainableMethod.call(this, 'limit', count);
				break;
				default:
					throw new Error(`Using 'limit' method here is not allowed`);
			}
		};

		this.count = function(){
			switch (this.state || 'initial'){
				case 'getAll':
				case 'initial':
					return chainableMethod.call(this, 'count', undefined, 'countCollection');
				break;
				case 'getMultipleByID':
					return chainableMethod.call(this, 'count', undefined, 'countQuery');
				break;
				default:
					throw new Error(`Using 'limit' method here is not allowed`);
			}
		};

		this.sort = function(param){
			switch (this.state || 'initial'){
				case 'getMultipleByID':
				case 'getAll':
					if (!param || param instanceof Array || param instanceof String){
						throw new Error(`Param of 'sort' method must be an hash-object`);
					}
					for (let field in param){
						if (param[field] === 'asc' || param[field] === 'desc'){
						} else {
							throw new Error(`Sort value must be 'asc' or 'desc'`);
						}
					}
					return chainableMethod.call(this, 'sort', param, 'sort');
				break;
				default:
					throw new Error(`Using 'limit' method here is not allowed`);
			}
		};

		Object.assign(Chainable.prototype, this);
		await this.useDB('default');
		return true;
	}

	@abstractMethodAsync()
	static async useDB(database, config) {
		try{
			this[symbols.dbProvider] = this.prototype[symbols.dbProvider] = await dbProviderPool.getProvider(database, config);
			this.prototype[symbols.dbProvider].getDefaults(this);
		}catch(e){
			throw e;
		}
	}

	async save(){
		return await this[symbols.dbProvider].save(this);
	};

	async delete(){
		return await this[symbols.dbProvider].delete(this);
	}
}

Base.prototype[symbols.dbSchema] = {

};

export {Base};
