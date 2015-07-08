import '../index';
import chai from 'chai';
import App from '../lib/app';
import * as Router from '../lib/router/router';
import chaiSubset from 'chai-subset';
import {inject, singleton, abstractMethodAsync} from '../lib/decorators';

chai.use(chaiSubset);
const should = chai.should();

describe('Decorators', () => {
	let app;
	let cwd;

	before(async (done) => {
		cwd = process.cwd();
		process.chdir(`.${process.env.UNDER_NODE_BABEL ? '' : '/build'}/test/mocks`);
		app = await new App();
		done();
	});

	after(async (done) => {
		app.dbProviderPool.databases = {};
		process.chdir(cwd);
		app.httpServer.close(() => done());
	});

    it('@inject should accept array of strings with dependencies names', async (done) => {
		try{
			@inject('route', 'rawRouter', 'resource')
			class MyRouter extends Router.RouterHTTP{
				constructor(){
					super();
				}
			}
			await app.use(MyRouter);
			done();
		} catch(e) {
			done(e);
		}
	});

    it('@inject should accept string with dependency name', async (done) => {
		try{
			@inject('route')
			class MyRouter extends Router.RouterHTTP{
				constructor(){
					super();
				}
			}
			await app.use(MyRouter);
			done();
		} catch(e) {
			done(e);
		}
	});

    it('@inject should fail with another params in array', async (done) => {
		try{
			@inject('route', {})
			class MyRouter extends Router.RouterHTTP{
				constructor(){
					super();
				}
			}
			await app.use(MyRouter);
			done(new Error("it should fail but it not"));
		} catch(e) {
			done();
		}
	});

    it('@inject should also fail with another params instead of array', async (done) => {
		try{
			@inject({})
			class MyRouter extends Router.RouterHTTP{
				constructor(){
					super();
				}
			}
			await app.use(MyRouter);
			done(new Error("it should fail but it not"));
		} catch(e) {
			done();
		}
	});

    it('@singleton should force target class to be singleton', () => {
		@singleton
		class A{
		}
		new A().should.be.equal(new A());
	});

    it('@abstractMethodAsync', async (done) => {
		class A{
			constructor(){

			}
			@abstractMethodAsync()
			async f(){
			}
		}
		try{
			await new A().f();
			done(new Error);
		} catch (e) {
			done();
		}
	});
});
