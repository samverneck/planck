import chai from 'chai';
import App from '../lib/app';
import * as Router from '../lib/router/router';
import chaiSubset from 'chai-subset';
import {inject, singleton, abstractMethodAsync, PROTECTED, PROT} from '../lib/decorators';

chai.use(chaiSubset);
const should = chai.should();

describe('Decorators', () => {
	let app;
	let cwd;

	before(async () => {
		cwd = process.cwd();
		process.chdir(`.${process.env.UNDER_NODE_BABEL ? '' : '/build'}/test/mocks`);
		app = await new App();
		await app.start();
	});

	after((done) => {
		app.dbProviderPool.databases = {};
		process.chdir(cwd);
		app.httpServer.close(() => done());
	});

    it('@inject should accept array of strings with dependencies names', async () => {
		@inject('route', 'rawRouter', 'resource')
		class MyRouter extends Router.RouterHTTP{
			constructor(){
				super();
			}
		}
		await app.use(MyRouter);
	});

    it('@inject should accept string with dependency name', async () => {
		@inject('route')
		class MyRouter extends Router.RouterHTTP{
			constructor(){
				super();
			}
		}
		await app.use(MyRouter);
	});

    it('@inject should fail with another params in array', async () => {
		try{
			@inject('route', {})
			class MyRouter extends Router.RouterHTTP{
				constructor(){
					super();
				}
			}
			await app.use(MyRouter);
		} catch(e) {
			return;
		}
		throw new Error("it should fail but it not");
	});

    it('@inject should also fail with another params instead of array', async () => {
		try{
			@inject({})
			class MyRouter extends Router.RouterHTTP{
				constructor(){
					super();
				}
			}
			await app.use(MyRouter);
		} catch(e) {
			return;
		}
		throw new Error("it should fail but it not");
	});

    it('@singleton should force target class to be singleton', () => {
		@singleton
		class A{
		}
		new A().should.be.equal(new A());
	});

    it('@abstractMethodAsync', async () => {
		class A{
			constructor(){

			}
			@abstractMethodAsync()
			async f(){
			}
		}
		try{
			await new A().f();
		} catch (e) {
			return;
		}
		throw new Error();
	});

    it('@PROTECTED should make property of class non-enumerable, to protect it from rendering to json', () => {
		class A{
			@PROTECTED foo = 10;
			constructor(){

			}
		}
		let a = new A();
		a.foo.should.be.equal(10);
		Object.keys(a).should.be.deep.equal([]);
	});

	it('@PROT should be an alias for PROTECTED', () => {
		PROT.should.be.equal(PROTECTED);
	});
});
