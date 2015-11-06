import chai from '@node/chai';
import App from '../../lib/app';
import * as Router from '../../lib/router/router.js';

const should = chai.should();

describe('code-generator', () => {
    let app;
    let cwd;

    before(async (done) => {
        try{
            cwd = process.cwd();
            process.chdir(`.${process.env.UNDER_NODE_BABEL ? '' : '/build'}/test/code-generator/mocks`);
            let config = await System.import(`./test/mocks/config/main`);
            app = await new App(config.default);
            app.config.codeGeneration.autoGeneration = true;
        }catch(e){
            done(e);
        }
        done();
    });

    after(async (done) => {
        app.dbProviderPool.databases = {};
        process.chdir(cwd);
        app.config.codeGeneration.autoGeneration = false;
        app.httpServer.close(() => done());
    });

    describe('should create by information from router:', () => {
        before(async(done) => {
            class MyRouter extends Router.RouterHTTP{
                constructor(resource, route){
                    super();
                    resource('users', () => {
                        resource('friends', ['update']);
                        route('admin', 'admin.getInfo');
                        route('/adminFromUsers');
                    });
                    resource('groups', () => {
                        resource('posts', ['create', 'read'], () => {
                            resource('comments');
                            resource('likes', ['read']);
                        });
                    });
                    resource('nonexistent');
                    route('/admin', 'admin.getInfo');
                    route('/my/password', 'users.password', ['get', 'post']);
                    route.get('/my/info', 'users.info');
                    route.post('/my/info', 'users.info');
                    route.put('/my/info', 'users.info');
                    route.patch('/my/info', 'users.info');
                    route.delete('/my/info', 'users.info');
                    route.get('/my/infoNoHandler', 'users.noHandlerForRoute');
                    route('/fail');
                    route('/fail2', 'onlyControllerName');
                }
            }
            await app.use(MyRouter);
            done();
        });

        it('controllers', async (done) => {
            done();
        });
	});
});
