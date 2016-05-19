import chai from 'chai';
import * as namespace from '../lib/planck';

const should = chai.should();

describe('planck entry point should be namespace with all main classes and namespaces:', () => {
	it('App', () => {
		should.exist(namespace.App);
		namespace.App.should.be.a('function');
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
		should.exist(namespace.Controller.useViews);
		should.exist(namespace.Controller.before);
		should.exist(namespace.Controller.skipBefore);
		should.exist(namespace.Controller.after);
		should.exist(namespace.Controller.skipAfter);
		namespace.Controller.Base.should.be.a('function');
		namespace.Controller.useViews.should.be.a('function');
		namespace.Controller.before.should.be.a('function');
		namespace.Controller.skipBefore.should.be.a('function');
		namespace.Controller.after.should.be.a('function');
		namespace.Controller.skipAfter.should.be.a('function');
	});
	it('Reflection', () => {
		should.exist(namespace.Reflection);
		should.exist(namespace.Reflection.getFunctionParams);
		should.exist(namespace.Reflection.isAnnotated);
		should.exist(namespace.Reflection.annotate);
		should.exist(namespace.Reflection.invoke);
		should.exist(namespace.Reflection.invokeSuper);
		should.exist(namespace.Reflection.construct);
		should.exist(namespace.Reflection.symbols);
		namespace.Reflection.getFunctionParams.should.be.a('function');
		namespace.Reflection.isAnnotated.should.be.a('function');
		namespace.Reflection.annotate.should.be.a('function');
		namespace.Reflection.invoke.should.be.a('function');
		namespace.Reflection.invokeSuper.should.be.a('function');
		namespace.Reflection.construct.should.be.a('function');
	});
	it('Decorators', () => {
		should.exist(namespace.decorators);
		should.exist(namespace.decorators.singleton);
		should.exist(namespace.decorators.abstractMethodAsync);
		should.exist(namespace.decorators.inject);
		should.exist(namespace.decorators.PROTECTED);
		should.exist(namespace.decorators.PROT);
		namespace.decorators.singleton.should.be.a('function');
		namespace.decorators.abstractMethodAsync.should.be.a('function');
		namespace.decorators.inject.should.be.a('function');
		namespace.decorators.PROTECTED.should.be.a('function');
		namespace.decorators.PROT.should.be.a('function');
	});
});
