import chai from 'chai';
import * as Planck from '../../index';
import chaiSubset from 'chai-subset';

chai.use(chaiSubset);

describe('Controller helpers', () => {
	it(`useViews should annotate controller with views`, () => {
        @Planck.Controller.useViews('foo', 'bar')
        class C{
			f(){

			}
		}
        C[Planck.Reflection.symbols.views].should.be.deep.equal(['foo', 'bar']);
	});
    it(`useViews should annotate controller's method with views`, () => {
        class C{
            @Planck.Controller.useViews('foo', 'bar')
			f(){

			}
		}
        C.prototype.f[Planck.Reflection.symbols.views].should.be.deep.equal(['foo', 'bar']);
	});
    it(`after should annotate controller with 'after' handlers`, () => {
        @Planck.Controller.after('foo', 'bar')
        class C{
			f(){

			}
		}
        C[Planck.Reflection.symbols.afterHandlers].should.be.deep.equal(['foo', 'bar']);
	});
    it(`after should annotate controller's method with 'after' handlers`, () => {
        class C{
            @Planck.Controller.after('foo', 'bar')
			f(){

			}
		}
        C.prototype.f[Planck.Reflection.symbols.afterHandlers].should.be.deep.equal(['foo', 'bar']);
	});
    it(`skipAfter should annotate controller with 'skip after' handlers`, () => {
        @Planck.Controller.skipAfter('foo', 'bar')
        class C{
			f(){

			}
		}
        C[Planck.Reflection.symbols.skipAfterHandlers].should.be.deep.equal(['foo', 'bar']);
	});
    it(`skipAfter should annotate controller's method with 'skip after' handlers`, () => {
        class C{
            @Planck.Controller.skipAfter('foo', 'bar')
			f(){

			}
		}
        C.prototype.f[Planck.Reflection.symbols.skipAfterHandlers].should.be.deep.equal(['foo', 'bar']);
	});
});
