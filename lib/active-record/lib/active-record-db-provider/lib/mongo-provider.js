import BaseProvider from './base-provider';
import {MongoClient} from 'mongodb';

const GET_METHODS = new Set([
	"get",
	"getBy",
	"all"
]);

const SAVE_METHODS = new Set([
	"create"
]);

//temp stub!!!
const isValid = function(id) {
	return true;
};
//temp stub!!!
const toObjectId = function(id) {
	return id;
};

class MongoProvider extends BaseProvider{
	constructor(config){
		super();
		this.host = config.host;
	}

	//TODO: add query queue to handle querys before db connected?
	calcQuery(chain){
		var query = {
			method: "",
			query: {}
		};
		for (let block of chain) {
			if (GET_METHODS.has(block.method)){
				query.method = "find";
				switch (block.method){
					case "get":
						if (block.params.length === 1){
							if (typeof(block.params[0]) === "string"){
								if (isValid(block.params[0])){
									query.query._id = block.params[0];
								}
							} else if (block.params[0] instanceof Array){
								block.params[0].map((el) => {
									if (isValid(el)){
										return toObjectId(el);
									}
									throw new TypeError("Arguments to Base.get must be strings, array of strings or Object");
								});
								query.query._id = {$in: block.params[0]};
							} else if ((block.params[0] !== null) && (typeof block.params[0] === 'object')){

							} else {
								throw new TypeError("Arguments to Base.get must be strings, array of strings or Object");
							}
						} else {

						}
					break;
				}
			}
		}
		return query;
	}

	async connect(){
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, 1); //emulating connect
		});
	}
}

export default MongoProvider;
