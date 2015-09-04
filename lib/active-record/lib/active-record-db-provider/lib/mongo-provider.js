import BaseProvider from './base-provider';
import {MongoClient} from 'mongodb';
import {symbols} from '../../../../reflection';
import {ObjectID} from 'mongodb';

const arrayToObjectID = function(array) {
	return array.map((el) => {
		try{
			el = new ObjectID(el);
			return el;
		} catch (e) {
			throw new TypeError('Arguments to Base.get must be strings, array of strings or Object');
		}
	});
};

class MongoProvider extends BaseProvider{
	constructor(name, config){
		super();
		this.name = name;
		this.host = config.host;
		this.port = config.port;
	}

	//TODO: add query queue to handle querys before db connected?
	calcQuery(chain, state){
		var query = {
			method: '',
			query: {},
			options: {}
		};
		switch (state){
			case 'getAll':
				query.method = 'find';
			break;
			case 'getSingleByID':
				query.method = 'findOne';
			break;
			case 'getMultipleByID':
				query.method = 'find';
			break;
			case 'countCollection':
				query.method = 'count';
			break;
			case 'countQuery':
				query.method = 'count';
			break;
			default:
		}
		for (let block of chain) {
			switch (block.method){
				case 'get':
					console.log(block.params)
					if (typeof block.params === 'undefined'){

					} else if (block.params.length === 1){
						//TODO: refactor with toID method
						if (typeof block.params[0] === 'string' || typeof block.params[0] === 'number'){
							try{
								query.query._id = new ObjectID(block.params[0]);
							} catch (e) {
								throw new TypeError(`Argument to Base.get is not a valid MongoID`);
							}
						} else if ((block.params[0] !== null) && (typeof block.params[0] === 'object') && !(block.params[0] instanceof Array)){

						} else {
							throw new TypeError('Arguments to Base.get must be strings, array of strings or Object');
						}
					} else {
						block.params = arrayToObjectID(block.params);
						query.query._id = {$in: block.params};
					}
				break;
				case 'skip':
					query.options.skip = block.params;
				break;
				case 'limit':
					query.options.limit = block.params;
				break;
				case 'sort':
					query.options.sort = {};
					for (let field in block.params){
						if (block.params[field] === 'asc'){
							query.options.sort[field] = 1;
						} else {
							query.options.sort[field] = -1;
						}
					}
				break;
				default:
			}
		}
		return query;
	}

	async execQuery(chain, Model, state){
		const instantiate = function(data){
			data = new Model(data);
			data[symbols.dbDescriptor].isNew = false;
			return data;
		};
		let query = this.calcQuery(chain, state);
		let table = this.db.collection(Model.prototype[symbols.dbSchema].tableName);
		let data;
		switch (query.method) {
			case 'findOne':
				data = await table[query.method](query.query, query.options);
				data = instantiate(data);
			break;
			case 'find':
				data = await table[query.method](query.query, query.options).toArray();
				data = data.map(instantiate);
			break;
			case 'count':
				data = await table[query.method](query.query, query.options);
			break;
			default:
		}
		return data;
	}

	async connect(){
		return new Promise((resolve, reject) => {
			let url = `mongodb://${this.host}:${this.port}/${this.name}`;
			MongoClient.connect(url, (err, db) => {
				if (err){
					return reject();
				}
				this.db = db;
				console.log('Connected correctly to server');
				resolve();
			});
		});
	}

	async save(object){
		let table = this.db.collection(object[symbols.dbSchema].tableName);
		if (object[symbols.dbDescriptor].isNew){
			let data = await table.insertOne(object);
			if (object[symbols.dbPrimaryKey] !== '_id'){ //hide _id if selected another primary key
				object[object[symbols.dbPrimaryKey]] = data.insertedId;
				Object.defineProperty(object, '_id', {
					enumerable: false,
					writable: true,
					configurable: true
				});
			}
			object[symbols.dbDescriptor].isNew = false;
		} else {
			//object[symbols.changedFields]
			let data = await table.updateOne({'_id': object._id}, object);
		}
		return object;
	}

	async delete(object){
		let table = this.db.collection(object[symbols.dbSchema].tableName);
		if (object[symbols.dbDescriptor].isNew){
			return 0;
		}
		let res = await table.deleteOne({'_id': object._id});
		return res.deletedCount;
	}

	getDefaults(model){
		model.prototype[symbols.dbPrimaryKey] = model.prototype[symbols.dbPrimaryKey] || '_id';
	}
}

export default MongoProvider;
