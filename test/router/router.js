import '../../index';
import chai from 'chai';
import App from '../../lib/app';
import * as Router from '../../lib/router/router.js';
import request from 'supertest';
import chaiSubset from 'chai-subset';

chai.use(chaiSubset);

const should = chai.should();

describe('router', () => {
	it('should have "RouterHTTP" class', () => {
		should.exist(Router.RouterHTTP);
		Router.RouterHTTP.should.be.a('function');
	});
	describe('"RouterHTTP" class', () => {
		let app;
		let cwd;
		
		before(async (done) => {
			cwd = process.cwd();
			process.chdir("./build/test/mocks");
			app = await new App();

			done();
		});

		after(async (done) => {
			app.dbProviderPool.databases = {};
			process.chdir(cwd);
			done();
		});	

		it('should not be created without subclassing', () => {
			(() => {new Router.RouterHTTP();}).should.throw(AbstractClassError);
			class MyRouter extends Router.RouterHTTP{
				constructor(){
					super();
				}
			}
			(() => {new MyRouter();}).should.not.throw();
		});	
		it('subclass can be passed to "app.use()" and created by it', async (done) => {
			class MyRouter extends Router.RouterHTTP{
				constructor(){
					super();
				}
			}
			app.use(MyRouter);
			done();
		});
		it('constructor should have "resource" helper method', async (done) => {
			class MyRouter extends Router.RouterHTTP{
				constructor(resource){
					super();
					resource.should.be.a('function');
				}
			}
			app.use(MyRouter);
			done();
		});
		it('"resource" helper method should allow nesting', async (done) => {
			class MyRouter extends Router.RouterHTTP{
				constructor(resource){
					super();
					resource("users", res => {
						res("friends", ["update"]);
					});
					resource("groups", res => {
						res("posts", ["create", "read"], res => {
							res("comments");
							res("likes", ["read"]);  
						});
					});
				}
			}
			app.use(MyRouter);
			done();
		});
		describe('',() => {
			before(async (done) => {	
				class MyRouter extends Router.RouterHTTP{
					constructor(resource){
						super();
						resource("users", res => {
							res("friends", ["update"]);
						});
						resource("groups", res => {
							res("posts", ["create", "read"], res => {
								res("comments");
								res("likes", ["read"]);  
							});
						});
						resource("nonexistent");
					}
				}
				await app.use(MyRouter);
				done();
			});		
			it('"resource" should create restful routes', async (done) => {
				let	routes =	[ { type: 'get', path: '/users', result: {data: {res: 'readAll'}}},
								  { type: 'get', path: '/users/1', result: {data: {user: {id: '1'}}}},
								  { type: 'post', path: '/users', result: {data: {}}},
								  { type: 'patch', path: '/users/1', result: {data: {res: 'update'}}},
								  { type: 'delete', path: '/users/1', result: {data: {}}},
								  { type: 'patch', path: '/users/1/friends/2', result: {}},
								  { type: 'get', path: '/groups', result: '<html><body>{"res":"readAll"}</body></html>'},
								  { type: 'get', path: '/groups/1', result: {data: {user: {id: '1'}}, status: 200}},
								  { type: 'post', path: '/groups', result: {data: {}, status: 200}},
								  { type: 'patch', path: '/groups/1', result: {data: {res: 'update'}, status: 200}},
								  { type: 'delete', path: '/groups/1', result: {data: {}, status: 200}},
								  { type: 'get', path: '/groups/1/posts/2', result: {}},
								  { type: 'post', path: '/groups/1/posts', result: {}},
								  { type: 'get', path: '/groups/1/posts/2/comments', result: {}},
								  { type: 'post', path: '/groups/1/posts/2/comments', result: {}},
								  { type: 'patch', path: '/groups/1/posts/2/comments/3', result: {}},
								  { type: 'delete', path: '/groups/1/posts/2/comments/3', result: {}},
								  { type: 'get', path: '/groups/1/posts/2/likes/3', result: '<html><body>{}</body></html>'} ];
				let	routes501 =	[ { type: 'get', path: '/groups/1/posts/2/comments/3' }];
				let	routes404 =	[ { type: 'get', path: '/users/1/friends' },
								  { type: 'get', path: '/users/1/friends/22' },
								  { type: 'post', path: '/users/1/friends' },
								  { type: 'delete', path: '/users/1/friends/2' },
								  { type: 'get', path: '/nonexistent' },
								  { type: 'get', path: '/nonexistent/1' },
								  { type: 'post', path: '/nonexistent' },
								  { type: 'patch', path: '/nonexistent/1' },
								  { type: 'delete', path: '/nonexistent/1' }];	

				let routesPromises = [];
				for (let i = 0; i < routes.length; i++) {
					routesPromises.push(new Promise((resolve, reject) => {
						request('http://localhost:9000')[routes[i].type](routes[i].path).expect(200).end(function(err, res){
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
							if (err) {
								return reject(err)
							};
							resolve();
						});
					}));
				};
				for (let i = 0; i < routes501.length; i++) {
					routesPromises.push(new Promise((resolve, reject) => {
						request('http://localhost:9000')[routes501[i].type](routes501[i].path).expect(501).end(function(err, res){
							if (err) {
								return reject(err)
							};
							resolve();
						});
					}));
				};
				for (let i = 0; i < routes404.length; i++) {
					routesPromises.push(new Promise((resolve, reject) => {
						request('http://localhost:9000')[routes404[i].type](routes404[i].path).expect(404).end(function(err, res){
							if (err) {
								return reject(err)
							};
							resolve();
						});
					}));
				};
				Promise.all(routesPromises).then(() => {
					done();
				}, (err) => {
					done(err);
				})
			});
		});
	});
});