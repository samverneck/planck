import chai from 'chai';
import * as namespace from '../index';


const should = chai.should();

describe('planck entry point should be namespace with all main classes:', () => {
	it('App', () => {
		should.exist(namespace.App);
		namespace.App.should.be.a('function');
		//console.log(namespace)
	});
	it('Router', () => {
		should.exist(namespace.Router);
		should.exist(namespace.Router.Base);
		should.exist(namespace.Router.RouterHTTP);
		namespace.Router.Base.should.be.a('function');
		namespace.Router.RouterHTTP.should.be.a('function');
	});
	it('ActiveRecord', () => {
		should.exist(namespace.ActiveRecord);
		should.exist(namespace.ActiveRecord.Base);
		namespace.ActiveRecord.Base.should.be.a('function');
	});
	it('View', () => {
		should.exist(namespace.View);
		should.exist(namespace.View.Base);
		namespace.View.Base.should.be.a('function');
	});
	it('Controller', () => {
		should.exist(namespace.Controller);
		should.exist(namespace.Controller.Base);
		namespace.Controller.Base.should.be.a('function');
	});
});