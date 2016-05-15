import chai from 'chai';
import App from '../lib/app';
import * as Router from '../lib/router/router';
import request from 'supertest';
import chaiSubset from 'chai-subset';
import {inject} from '../lib/decorators';

chai.use(chaiSubset);
const should = chai.should();

describe('Middleware', () => {
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

	describe('used with http router', () => {
		before(async (done) => {
			try{
				@inject('route', 'rawRouter')
				class MyRouter extends Router.RouterHTTP{
					constructor(route, rawRouter){
						super();
						route.get("/testMiddleware", "groupsMiddleware.testMiddleware");
						rawRouter.get("/testMiddleware2", function(req, res) {
							res.json({data: '/testMiddleware2'});
						});
						rawRouter.get("/testMiddleware3", function(req, res) {
							res.json({data: req.testMiddleware3});
						});
						route('/testMiddlewareSkip', 'groupsMiddlewareSkip.testMiddleware');
						route('/testMiddlewareSkip2', 'groupsMiddlewareSkip.testMiddleware2');
						route('/testMiddlewareSkip3', 'groupsMiddlewareSkip.testMiddleware3');
					}
				}
				await app.use(function(req, res, next){
					req.params = {testMiddleware3: '/testMiddleware3'};
					req.testMiddleware3 = '/testMiddleware3';
					next();
				});
				await app.use(MyRouter);

				done();
			} catch(e) {
				done(e);
			}
		});
		it('should modify request and response with before/after handlers', async (done) => {
			let	routes = [{ type: 'get', path: '/testMiddleware', result: {before: [1, 11, 2, 22, 3, 33, 4, 44], res: 1, after: [1, 11, 2, 22, 3, 33, 4, 44], beforeHandlerInControllers: [1, 2, 3, 4, 5, 6], afterHandlerInControllers: [1, 2, 3, 4, 5, 6]}},
						  { type: 'get', path: '/testMiddleware2', result: {data: '/testMiddleware2'}},
						  { type: 'get', path: '/testMiddleware3', result: {data: '/testMiddleware3'}}];

			let routesPromises = [];
			for (let i = 0; i < routes.length; i++) {
				routesPromises.push(new Promise((resolve, reject) => {
					request('http://localhost:9000')[routes[i].type](routes[i].path).expect(200).end(function(err, res){
						if (err) {
							console.log(err)
							return reject(new Error(routes[i].path))
						};
						let isJson = false;
						try{
							if (typeof JSON.parse(res.text) !== 'string'){
								isJson = true;
							}
						} catch(e){

						}
						if (isJson){
							res.body.should.be.deep.equal(routes[i].result);
						} else {
							res.text.should.be.equal(routes[i].result);
						}
						resolve();
					});
				}));
			}
			Promise.all(routesPromises).then(() => {
				done();
			}, (err) => {
				done(err);
			});
		});
		it('should cancel modifying request and response with before/after handlers with skipBefore/skipAfter', async (done) => {
			let	routes = [{ type: 'get', path: '/testMiddlewareSkip', result: {
				'afterHandlers': [
					'afterMethodHandler',
					'afterMethodHandlerFromParent',
					'afterAllHandler',
					'afterAllHandlerFromParent',
					'afterMethodHandlerInParent',
					'afterAllHandlerInParent'
				], 'beforeHandlers': [
					'beforeMethodHandler',
					'beforeMethodHandlerFromParent',
					'beforeAllHandler',
					'beforeAllHandlerFromParent',
					'beforeMethodHandlerInParent',
					'beforeAllHandlerInParent'
				]
			}}, { type: 'get', path: '/testMiddlewareSkip2', result: {}}];


			let routesPromises = [];
			for (let i = 0; i < routes.length; i++) {
				routesPromises.push(new Promise((resolve, reject) => {
					request('http://localhost:9000')[routes[i].type](routes[i].path).expect(200).end(function(err, res){
						if (err) {
							console.log(err)
							return reject(new Error(routes[i].path))
						};
						let isJson = false;
						try{
							if (typeof JSON.parse(res.text) !== 'string'){
								isJson = true;
							}
						} catch(e){

						}
						if (isJson){
							res.body.should.be.deep.equal(routes[i].result);
						} else {
							res.text.should.be.equal(routes[i].result);
						}
						resolve();
					});
				}));
			}
			Promise.all(routesPromises).then(() => {
				done();
			}, (err) => {
				done(err);
			});
		});
	});
});
