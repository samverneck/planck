import '../../index';
import App from '../../lib/app';
import chai from "chai";
import * as ActiveRecord from '../../lib/active-record/active-record';
import * as ActiveRecordDBProvider from '../../lib/active-record/lib/active-record-db-provider/active-record-db-provider';

const should = chai.should();

describe('active-record', () => {
	let app;
	before(async (done) => {
		app = await new App(`.${process.env.UNDER_NODE_BABEL?'':'/build'}/test/mocks/config/main`);
		done();
	});

	after(async (done) => {
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
			var A;
			beforeEach(() => {
				A = class A extends ActiveRecord.Base{
					constructor(){
						super();
						this.id = 0;
						this.name = "foo";
						this.blocked = false;
						this.tokens = [];	
						this.position = {
							alt: 0,
							long: 0
						};
					}
				};
			});
			it('should not be called without subclassing', async (done) => {
				try{
					await ActiveRecord.Base.init.call(ActiveRecord.Base);
					done(new Error())
				}catch(e){}
				try{
					let a = await A.init.call(ActiveRecord.Base);
					done(new Error())
				}catch(e){}
				try{
					await A.init.call(A);
					done()
				}catch(e){
					done(new Error())
				}
			});
			it('should create access methods for each atomic field in constructor', () => {
				A.init();
				A.getById.should.be.a('function');
				A.getByName.should.be.a('function');
				A.getByBlocked.should.be.a('function');
				should.not.exist(A.getByTokens);
				should.not.exist(A.getByPosition);
			});
			it('should create chainable access methods', async (done) => {
				try{
					await A.init();
					var user = await A.getById(123, 456).getByName("asd").getByBlocked(false);
					await A.getById(654, 321).getByName("qwe").getByBlocked(true);
					done();
				}catch(e){
					done(e);
				}
			});
			it('should create chainable method "get"', () => {
				A.init();
				A.get.should.be.a('function');
			});
			it('should have field "database", accesed via setter/getter', () => {
				A.init();
				A.database = "mongo";
			});
			it('"useDB" method accessable only in subclass', async (done) => {
				try{
					await ActiveRecord.Base.useDB("mongo");
					done(new Error());
				}catch(e){
					if (e instanceof AbstractClassError){
						done();
					}else{
						done(new Error());
					}
				}
			});
			it('"useDB" method should accept DB params to new connect', async (done) => {
				try{
					await A.useDB("testdb", {
						host: 'localhost',
						port: '27017',
						type: 'mongo'
					});
					A.__dbProvider.should.be.instanceof(ActiveRecordDBProvider.MongoProvider)
					done();	
				}catch(e){
					done(e);
				}
			});
			it('"useDB" method result should be inherited by subclasses', async (done) => {
				try{
					await A.useDB("testdb2", {
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
					B.__dbProvider.should.be.instanceof(ActiveRecordDBProvider.MongoProvider)
					done();	
				}catch(e){
					done(e);
				}
			});
			it('"useDB" method result should be applyed to subclasses', async (done) => {
				try{
					let B = class B extends A{
						constructor(){
							super();
						}
					};	
					await A.useDB("testdb3", {
						host: 'localhost',
						port: '27017',
						type: 'mongo'
					});
					B.init();
					B.__dbProvider.should.be.instanceof(ActiveRecordDBProvider.MongoProvider)
					done();	
				}catch(e){
					done(e);
				}
			});
			it('"useDB" method fails with name & config, if name is already registered', async (done) => {
				try{
					await A.useDB("default", {
						host: 'localhost',
						port: '27017',
						type: 'mongo'
					});
					done(new Error());
				}catch(e){
					done();
				}
			});
		});
		it('result of any chainable method should be promise', async (done) => {
			let A = class A extends ActiveRecord.Base{
				constructor(){
					super();
					this.id = 0;
				}
			};
			try{
				await A.init();
				A.get('45').getById('45').should.be.instanceOf(Promise);
				await A.get('45').getById('45');
				done();
			}catch(e){
				done(e);
			}
		});
		describe('"get" method', () => {
			var A;
			beforeEach(async (done) => {
				A = class A extends ActiveRecord.Base{
					constructor(){
						super();
						this.id = 0;
						this.name = "foo";
						this.blocked = false;
						this.tokens = [];	
						this.position = {
							alt: 0,
							long: 0
						};
					}
				};
				await A.init();
				done();
			});
			it('should be chainable', async (done) => {
				try{
					await A.get({}).get('123').get('123', '456');
					done();
				}catch(e){
					done(e);
				}
			});
			it('should return promise', async (done) => {
				try{
					await A.get({}).get('123').get('123', '456');
					done();
				}catch(e){
					done(e);
				}
			});
			it('should be called with string params', async (done) => {
				try{
					await A.get(['123']).get('123').get('123', '456');
					done();
				}catch(e){
					done(e);
				}	
			});	
		});
	});
});