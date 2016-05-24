import chai from 'chai';
import * as Planck from '../../lib/planck';
import chaiSubset from 'chai-subset';

const should = chai.should();

chai.use(chaiSubset);

describe('Controller helpers', () => {
	it(`"useViews" should annotate controller with views`, () => {
        @Planck.Controller.useViews('foo', 'bar')
        class C{
			f(){}
		}
        C[Planck.Reflection.symbols.views].should.be.deep.equal(['foo', 'bar']);
	});
    it(`"useViews" should annotate controller's method with views`, () => {
        class C{
            @Planck.Controller.useViews('foo', 'bar')
			f(){}
		}
        C.prototype.f[Planck.Reflection.symbols.views].should.be.deep.equal(['foo', 'bar']);
	});
	it(`"before" should annotate controller with 'before' handlers`, () => {
        @Planck.Controller.before('foo', 'bar')
        class C{
			f(){}
		}
        C[Planck.Reflection.symbols.beforeHandlers].should.be.deep.equal(['foo', 'bar']);
	});
    it(`"before" should annotate controller's method with 'before' handlers`, () => {
        class C{
            @Planck.Controller.before('foo', 'bar')
			f(){}
		}
        C.prototype.f[Planck.Reflection.symbols.beforeHandlers].should.be.deep.equal(['foo', 'bar']);
	});
	it(`"before" should not accept empty arguments`, () => {
		class C{
			@Planck.Controller.before()
			f(){}
		}
		should.not.exist(C.prototype.f[Planck.Reflection.symbols.beforeHandlers])
	});
	it(`"before" should not accept wrong arguments`, () => {
		class C{
			@Planck.Controller.before(null)
			f(){}
		}
		should.not.exist(C.prototype.f[Planck.Reflection.symbols.beforeHandlers])
	});
	it(`"before" should accept json with handler name and params`, () => {
		class C{
			@Planck.Controller.before({handler: 'foo', params: {bar: 1}})
			f(){}
		}
		C.prototype.f[Planck.Reflection.symbols.beforeHandlers].should.be.deep.equal([{handler: 'foo', params: {bar: 1}}]);
	});
	it(`"before" should not accept json with handler name and params with reserved param names`, () => {
		class C{
			@Planck.Controller.before({handler: 'foo', params: {req: 1}})
			f(){}
		}
		should.not.exist(C.prototype.f[Planck.Reflection.symbols.beforeHandlers])
	});
	it(`"before" should not accept json with handler name without params`, () => {
		class C{
			@Planck.Controller.before({handler: 'foo'})
			f(){}
		}
		should.not.exist(C.prototype.f[Planck.Reflection.symbols.beforeHandlers])
	});
	it(`"before" should not accept json with handler and empty params`, () => {
		class C{
			@Planck.Controller.before({handler: 'foo', params: {}})
			f(){}
		}
		should.not.exist(C.prototype.f[Planck.Reflection.symbols.beforeHandlers])
	});
	it(`"before" should not accept json without handler name`, () => {
		class C{
			@Planck.Controller.before({params: {bar: 1}})
			f(){}
		}
		should.not.exist(C.prototype.f[Planck.Reflection.symbols.beforeHandlers])
	});
    it(`"skipBefore" should annotate controller with 'skip before' handlers`, () => {
        @Planck.Controller.skipBefore('foo', 'bar')
        class C{
			f(){}
		}
        C[Planck.Reflection.symbols.skipBeforeHandlers].should.be.deep.equal(['foo', 'bar']);
	});
    it(`"skipBefore" should annotate controller's method with 'skip before' handlers`, () => {
        class C{
            @Planck.Controller.skipBefore('foo', 'bar')
			f(){}
		}
        C.prototype.f[Planck.Reflection.symbols.skipBeforeHandlers].should.be.deep.equal(['foo', 'bar']);
	});
	it(`"skipBefore" should skip plain function`, () => {
		let testFunc = function(){};
		class CParent{
			@Planck.Controller.before(testFunc)
			f(){}
		}
		CParent.prototype.f[Planck.Reflection.symbols.beforeHandlers].should.be.deep.equal([testFunc]);
        class C extends CParent{
            @Planck.Controller.skipBefore(testFunc)
			f(){}
		}
		C.prototype.f[Planck.Reflection.symbols.skipBeforeHandlers].should.be.deep.equal([testFunc]);
	});
	it(`"skipBefore" should fail with any other params`, () => {
        class C{
            @Planck.Controller.skipBefore(42)
			f(){}
		}
        should.not.exist(C.prototype.f[Planck.Reflection.symbols.skipBeforeHandlers]);
	});
    it(`"after" should annotate controller with 'after' handlers`, () => {
        @Planck.Controller.after('foo', 'bar')
        class C{
			f(){}
		}
        C[Planck.Reflection.symbols.afterHandlers].should.be.deep.equal(['foo', 'bar']);
	});
    it(`"after" should annotate controller's method with 'after' handlers`, () => {
        class C{
            @Planck.Controller.after('foo', 'bar')
			f(){}
		}
        C.prototype.f[Planck.Reflection.symbols.afterHandlers].should.be.deep.equal(['foo', 'bar']);
	});
	it(`"after" should not accept empty arguments`, () => {
		class C{
			@Planck.Controller.after()
			f(){}
		}
		should.not.exist(C.prototype.f[Planck.Reflection.symbols.afterHandlers])
	});
	it(`"after" should not accept wrong arguments`, () => {
		class C{
			@Planck.Controller.after(null)
			f(){}
		}
		should.not.exist(C.prototype.f[Planck.Reflection.symbols.afterHandlers])
	});
	it(`"after" should accept json with handler name and params`, () => {
		class C{
			@Planck.Controller.after({handler: 'foo', params: {bar: 1}})
			f(){}
		}
		C.prototype.f[Planck.Reflection.symbols.afterHandlers].should.be.deep.equal([{handler: 'foo', params: {bar: 1}}]);
	});
	it(`"after" should not accept json with handler name and params with reserved param names`, () => {
		class C{
			@Planck.Controller.after({handler: 'foo', params: {req: 1}})
			f(){}
		}
		should.not.exist(C.prototype.f[Planck.Reflection.symbols.afterHandlers])
	});
	it(`"after" should not accept json with handler name without params`, () => {
		class C{
			@Planck.Controller.after({handler: 'foo'})
			f(){}
		}
		should.not.exist(C.prototype.f[Planck.Reflection.symbols.afterHandlers])
	});
	it(`"after" should not accept json with handler and empty params`, () => {
		class C{
			@Planck.Controller.after({handler: 'foo', params: {}})
			f(){}
		}
		should.not.exist(C.prototype.f[Planck.Reflection.symbols.afterHandlers])
	});
	it(`"after" should not accept json without handler name`, () => {
		class C{
			@Planck.Controller.after({params: {bar: 1}})
			f(){}
		}
		should.not.exist(C.prototype.f[Planck.Reflection.symbols.afterHandlers])
	});
    it(`"skipAfter" should annotate controller with 'skip after' handlers`, () => {
        @Planck.Controller.skipAfter('foo', 'bar')
        class C{
			f(){}
		}
        C[Planck.Reflection.symbols.skipAfterHandlers].should.be.deep.equal(['foo', 'bar']);
	});
    it(`"skipAfter" should annotate controller's method with 'skip after' handlers`, () => {
        class C{
            @Planck.Controller.skipAfter('foo', 'bar')
			f(){}
		}
        C.prototype.f[Planck.Reflection.symbols.skipAfterHandlers].should.be.deep.equal(['foo', 'bar']);
	});
	it(`"skipAfter" should skip plain function`, () => {
		let testFunc = function(){};
		class CParent{
			@Planck.Controller.after(testFunc)
			f(){}
		}
		CParent.prototype.f[Planck.Reflection.symbols.afterHandlers].should.be.deep.equal([testFunc]);
        class C extends CParent{
            @Planck.Controller.skipAfter(testFunc)
			f(){}
		}
		C.prototype.f[Planck.Reflection.symbols.skipAfterHandlers].should.be.deep.equal([testFunc]);
	});
	it(`"skipAfter" should fail with any other params`, () => {
        class C{
            @Planck.Controller.skipAfter(42)
			f(){}
		}
        should.not.exist(C.prototype.f[Planck.Reflection.symbols.skipAfterHandlers]);
	});
});
