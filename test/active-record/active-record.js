import App from '../../lib/app';
import chai from 'chai';
import * as ActiveRecord from '../../lib/active-record/active-record';
import * as ActiveRecordDBProvider from '../../lib/active-record/lib/active-record-db-provider/active-record-db-provider';
import {symbols} from '../../lib/reflection';
import '../mocks/db';
import {ObjectID} from 'mongodb';

const should = chai.should();

let cachedClass;
const createClass = async function(){
	if (cachedClass){
		return cachedClass;
	}
	let A = class A extends ActiveRecord.Base{
		id = 0;
		name = 'foo';
		blocked = false;
		tokens = [];
		position = {
			alt: 0,
			long: 0
		};
		constructor(params){
			super(params);
		}
	};
	await A.init();
	await A.useDB('testDB');
	cachedClass = A;
	return A;
};

describe('active-record', () => {
	let app;
	before(async () => {
		app = await new App(`.${process.env.UNDER_NODE_BABEL ? '' : '/build'}/test/mocks/config/main`);
		await app.start();
	});

	after((done) => {
		app.dbProviderPool.databases = {};
		app.httpServer.close(() => done());
	});

	it('should have "Base" class', () => {
		ActiveRecord.Base.should.be.a('function');
	});

	describe('"Base" class', () => {
		it('should have "init" method', () => {
			ActiveRecord.Base.init.should.be.a('function');
		});
		describe('"init" method', () => {
			let A;
			beforeEach(() => {
				A = class A extends ActiveRecord.Base{
					id = 0;
					name = 'foo';
					blocked = false;
					tokens = [];
					position = {
						alt: 0,
						long: 0
					};
					constructor(params){
						super(params);
					}
				};
			});
			it('should not be called without subclassing', async () => {
				try{
					await ActiveRecord.Base.init.call(ActiveRecord.Base);
				} catch(e){
					try{
						await A.init.call(ActiveRecord.Base);
					} catch(e){
						await A.init.call(A);
						return;
					}
				}
				throw new Error();
			});
			it('should create access methods for each atomic field in constructor', () => {
				A.init();
				A.getById.should.be.a('function');
				A.getByName.should.be.a('function');
				A.getByBlocked.should.be.a('function');
				should.not.exist(A.getByTokens);
				should.not.exist(A.getByPosition);
			});
			it('should create chainable access methods', async () => {
				await A.init();
				await A.getById(123, 456).getByName('asd').getByBlocked(false);
				await A.getById(654, 321).getByName('qwe').getByBlocked(true);
			});
			it('should create chainable method "get"', () => {
				A.init();
				A.get.should.be.a('function');
			});
			it('should have field "database", accesed via setter/getter', () => {
				A.init();
				A.database = 'mongo';
			});
			it('"useDB" method accessable only in subclass', async () => {
				try{
					await ActiveRecord.Base.useDB('mongo');
				}catch(e){
					if (e instanceof AbstractClassError){
						return;
					}
				}
				throw new Error();
			});
			it('"useDB" method should accept DB params to new connect', async () => {
				await A.useDB('testdb', {
					host: 'localhost',
					port: '27017',
					type: 'mongo'
				});
				A[symbols.dbProvider].should.be.instanceof(ActiveRecordDBProvider.MongoProvider);
			});
			it('"useDB" method result should be inherited by subclasses', async () => {
				await A.useDB('testdb2', {
					host: 'localhost',
					port: '27017',
					type: 'mongo'
				});

				let B = class B extends A{
					constructor(){
						super();
					}
				};
				B.init();
				B[symbols.dbProvider].should.be.instanceof(ActiveRecordDBProvider.MongoProvider);
			});
			it('"useDB" method result should be applied to subclasses', async () => {
				let B = class B extends A{
					constructor(){
						super();
					}
				};
				await A.useDB('testdb3', {
					host: 'localhost',
					port: '27017',
					type: 'mongo'
				});
				B.init();
				B[symbols.dbProvider].should.be.instanceof(ActiveRecordDBProvider.MongoProvider);
			});
			it('"useDB" method fails with name & config, if name is already registered', async () => {
				try{
					await A.useDB('default', {
						host: 'localhost',
						port: '27017',
						type: 'mongo'
					});
				} catch(e) {
					return;
				}
				throw new Error();
			});
		});
		it('result of any chainable method should be promise', async () => {
			let A = class A extends ActiveRecord.Base{
				constructor(){
					super();
					this.id = 0;
				}
			};
			await A.init();
			A.get('55c49eb60ab6c5fa43e76f98').getById('45').should.be.instanceOf(Promise);
			await A.get('55c49eb60ab6c5fa43e76f98').getById('45');
		});
		describe('"get" method', () => {
			let A;
			beforeEach(async () => {
				A = await createClass();
			});
			it('should be called without params and return all objects from db as class instances', async () => {
				let a = await A.get();
				a.should.be.instanceOf(Array);
				a[0].should.be.instanceOf(A);
				a[0][symbols.dbDescriptor].isNew.should.not.be.ok;
				a[a.length-1].should.be.instanceOf(A);
				a[a.length-1][symbols.dbDescriptor].isNew.should.not.be.ok;
				(await mongo.collection("A").count()).should.be.equal(a.length);
			});
			it('should be called with single string param', async () => {
				await A.get('55c49eb60ab6c5fa43e76f98');
			});
			it('should be called with string params', async () => {
				await A.get('55c49eb60ab6c5fa43e76f98', '55c49eb60ab6c5fa43e76f98');
			});
			it('should be chainable', async () => {
				await A.get().skip(0).limit(0);
			});
			it('should return promise', async () => {
				A.get('55c49eb60ab6c5fa43e76f98').should.be.instanceOf(Promise);
			});
			it('should get object from db via its id and return as class instance', async () => {
				let a = await A.get('55c49eb60ab6c5fa43e76f98');
				a.should.be.instanceOf(A);
				a[symbols.dbDescriptor].isNew.should.not.be.ok;
				a._id.toString().should.be.equal('55c49eb60ab6c5fa43e76f98');
			});
			it('should get array of object from db via its ids and return as class instances', async () => {
				let a = await A.get('55c49eb60ab6c5fa43e76f98', '55c49eb60ab6c5fa43e76f99');
				a.should.be.instanceOf(Array);
				a[0].should.be.instanceOf(A);
				a[0][symbols.dbDescriptor].isNew.should.not.be.ok;
				a[0]._id.toString().should.be.equal('55c49eb60ab6c5fa43e76f98');
				a[1].should.be.instanceOf(A);
				a[1][symbols.dbDescriptor].isNew.should.not.be.ok;
				a[1]._id.toString().should.be.equal('55c49eb60ab6c5fa43e76f99');
			});
		});
		describe('"count" method', () => {
			let A;
			beforeEach(async () => {
				A = await createClass();
			});
			it('should return count of objects in table', async () => {
				let count = await A.count();
				(await mongo.collection("A").count()).should.be.equal(count);
			});
		});
		describe('"limit" method', () => {
			let A;
			beforeEach(async () => {
				A = await createClass();
			});
			it('should set maximum count of objects, returned by "get" method', async () => {
				let a = await A.get('55c49eb60ab6c5fa43e76f98', '55c49eb60ab6c5fa43e76f99', '55c49eb60ab6c5fa43e76f9a').limit(2);
				a.should.be.instanceOf(Array);
				a.length.should.be.equal(2)
			});
		});
		describe('"skip" method', () => {
			let A;
			beforeEach(async () => {
				A = await createClass();
			});
			it('should set offset for retrieving objects, returned by "get" method', async () => {
				let a = await A.get().skip(2);
				a.should.be.instanceOf(Array);
				(await mongo.collection("A").count()-2).should.be.equal(a.length);
			});
			it('should set mixed with "limit" for retrieving slice of objects from skip to skip+limit position, returned by "get" method', async () => {
				let a = await A.get().skip(1).limit(1);
				a.should.be.instanceOf(Array);
				a.length.should.be.equal(1);
			});
		});
		describe('"sort" method', () => {
			let A;
			beforeEach(async () => {
				A = await createClass();
			});
			it('should sort retrieved objects, by specified field in ascending order', async () => {
				let a = await A.get().sort({id: 'asc'});
				a[a.length-1]._id.toString().should.be.equal('55c49eb60ab6c5fa43e76f98');
			});
			it('should sort retrieved objects, by specified field in descenting order', async () => {
				let a = await A.get().sort({_id: 'desc'});
				a[a.length-1]._id.toString().should.be.equal('55c49eb60ab6c5fa43e76f98');
			});
			it('should sort by second field, if sorting by first returns multiple objects on same sort index', async () => {
				let a = await A.get().sort({id: 'asc', name: 'desc'});
				a[1]._id.toString().should.be.equal('55c49eb60ab6c5fa43e76f99');
			});
		});
		describe('"fields" method', () => {
			let A;
			beforeEach(async () => {
				A = await createClass();
			});
			it('should get objects from db which include fields, specified in array', async () => {
				let a = await A.get().fields("fieldsTest1","id");
				should.exist(a[0].fieldsTest1);
				should.not.exist(a[0].fieldsTest2);
			});
			it('should get objects from db which include fields, specified in object', async () => {
				let a = await A.get().fields({"fieldsTest1" : 1});
				should.exist(a[0].fieldsTest1);
				should.not.exist(a[0].fieldsTest2);
			});
			it('should get objects from db which exclude fields, specified in object', async () => {
				let a = await A.get().fields({"fieldsTest1" : 0});
				should.exist(a[0].fieldsTest2);
				should.not.exist(a[0].fieldsTest1);
			});
		});
		describe('"save" method', () => {
			let A;
			beforeEach(async () => {
				A = await createClass();
			});
			it('should save object in db', async () => {
				if (await new A().save()){
					return;
				}
				throw new Error();
			});
			it('should update object in db if applied to existed object', async () => {
				let a = await new A();
				await a.save();
				a.name = 'foobar' + a._id;
				await a.save();
			});
		});
		describe('"delete" method', () => {
			let A;
			beforeEach(async () => {
				A = await createClass();
			});
			it('should not delete unsaved objects', async () => {
				let count = await mongo.collection("A").count();
				let a = new A({_id: new ObjectID('55c49eb60ab6c5fa43e76f98')});
				let res = await a.delete();
				res.should.be.equal(0);
				(await mongo.collection("A").count()).should.be.equal(count);
			});
			it('should delete object from db', async () => {
				let count = await mongo.collection("A").count();
				(await mongo.collection("A").findOne({_id: new ObjectID('55c49eb60ab6c5fa43e76f98')}))._id.toString().should.be.equal('55c49eb60ab6c5fa43e76f98');
				let a = await A.get('55c49eb60ab6c5fa43e76f98');
				let res = await a.delete();
				res.should.be.equal(1);
				should.equal(await mongo.collection("A").findOne({_id: new ObjectID('55c49eb60ab6c5fa43e76f98')}), null);
				(await mongo.collection("A").count()).should.be.equal(count-1);
			});
			it('should not delete unexisted objects', async () => {
				let a = await A.get('55c49eb60ab6c5fa43e76f99');
				a._id.toString().should.be.equal('55c49eb60ab6c5fa43e76f99');
				(await mongo.collection("A").deleteOne({_id: new ObjectID('55c49eb60ab6c5fa43e76f99')}));
				let count = await mongo.collection("A").count();
				let res = await a.delete();
				res.should.be.equal(0);
				(await mongo.collection("A").count()).should.be.equal(count);
			});
		});
		it('"id" decorator can not be applied twice per class', async () => {
			let A;
			try{
				A = class A extends ActiveRecord.Base{
					@ActiveRecord.id
					id = 0;
					@ActiveRecord.id('qwe')
					name = 'foo';
					constructor(){
						super();
					}
				};
				await A.init();
			}catch(e){
				return;
			}
			throw new Error();
		});
		describe('"id" decorator', () => {
			let A;
			beforeEach(async () => {
				A = class A extends ActiveRecord.Base{
					@ActiveRecord.id
					id = 0;
					name = 'foo';
					blocked = false;
					tokens = [];
					position = {
						alt: 0,
						long: 0
					};
					constructor(params){
						super(params);
					}
				};
				await A.init();
				await A.useDB('testDB');
			});
			it('should change primary key for model', async () => {
				let a = await new A();
				await a.save();
				a.name = 'foobar' + a.id;
				await a.save();
			});
		});
	});
});
