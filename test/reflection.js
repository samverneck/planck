import chai from '@node/chai';
import * as Planck from '../lib/planck';
import chaiSubset from '@node/chai-subset';

chai.use(chaiSubset);

describe('Reflection', () => {
	it(`getFunctionParams method should parse function's params`, () => {
        let f = function(foo, bar){
            return foo + bar;
            //some comments
        };
		Planck.Reflection.getFunctionParams(f);
        f[Planck.Reflection.symbols.functionParams].should.be.deep.equal(['foo', 'bar']);
	});
    it(`getFunctionParams method should also parse arrow functions's params`, () => {
        let f = (foo, bar) => {
            return foo + bar;
            //some comments
        };
		Planck.Reflection.getFunctionParams(f);
        f[Planck.Reflection.symbols.functionParams].should.be.deep.equal(['foo', 'bar']);
	});
    it(`annotate should add metadata to function via symbol from Reflection's registry`, () => {
        let f = (foo, bar) => {
            return foo + bar;
            //some comments
        };
		Planck.Reflection.annotate(f, 'functionParams', 'baz');
        f[Planck.Reflection.symbols.functionParams].should.be.deep.equal(['baz']);
    });
    it(`annotate should also can use arrays with metadata`, () => {
        let f = (foo, bar) => {
            return foo + bar;
            //some comments
        };
		Planck.Reflection.annotate(f, 'functionParams', ['baz']);
        f[Planck.Reflection.symbols.functionParams].should.be.deep.equal(['baz']);
    });
    it(`annotate should prepend metadata to existed, if same symbol are used`, () => {
        let f = (foo, bar) => {
            return foo + bar;
            //some comments
        };
        Planck.Reflection.getFunctionParams(f);
		Planck.Reflection.annotate(f, 'functionParams', ['baz']);
        f[Planck.Reflection.symbols.functionParams].should.be.deep.equal(['baz', 'foo', 'bar']);
    });
	it('isAnnotated should return if there are some data by the symbol', async () => {
        let f = (foo, bar) => {
            return foo + bar;
            //some comments
        };
		Planck.Reflection.annotate(f, 'functionParams', ['baz']);
        Planck.Reflection.isAnnotated(f, 'functionParams').should.be.ok;
	});
});
