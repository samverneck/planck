import QueryBuilder from './active-record-query-builder';

class Base{
	constructor(){

	}
	static init(){
		if ((this === Base)||(!Base.isPrototypeOf(this))){
			throw new TypeError("Cannot init Base class, you should extend it before");
		}
		const instance = new this;
		const queryBuilder = new QueryBuilder();

		const calcQuery = function(chain){

		}

		const chainableMethod = function(method, params){					
			if (this.chain){
				this.chain.push({method: method, params: params});
				return this;		
			}else{
				let chain = new Chainable({method: method, params: params});
				let self = this;
				process.nextTick(function(){
					calcQuery.call(self, this.chain)
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

		const Chainable = function(params){
			this.chain = [params];
		}
		Chainable.prototype = this;
	}
}

export default Base;