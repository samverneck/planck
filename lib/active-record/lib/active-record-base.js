import QueryBuilder from './active-record-query-builder';
import * as DBProvider from './active-record-db-provider/active-record-db-provider';

class Base{
	constructor(){

	}
	static init(){
		if ((this === Base)||(!Base.isPrototypeOf(this))){
			throw new TypeError("Cannot init Base class, you should extend it before");
		}
		const instance = new this;
		const queryBuilder = new QueryBuilder();

		let dbProvider = new DBProvider.MongoProvider();

		const endChain = function(chain){
			let query = dbProvider.calcQuery(chain);
			//console.log(query);
		};

		const chainableMethod = function(method, params){					
			if (this.chain){
				this.chain.push({method: method, params: params});
				return this;		
			}else{
				let chain = new Chainable({method: method, params: params});
				let self = this;
				process.nextTick(function(){
					endChain.call(self, this.chain);
				}.bind(chain));			
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

		this.get = function(...params){
			return chainableMethod.call(this, "get");
		};

		this.useDB = function(){

		};

		const Chainable = function(params){
			this.chain = [params];
		};

		Chainable.prototype = this;
	}
}

export default Base;