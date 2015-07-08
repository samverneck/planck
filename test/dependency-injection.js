import chai from 'chai';
import * as Planck from '../index';
import * as DI from '../lib/dependency-injection';

import chaiSubset from 'chai-subset';

chai.use(chaiSubset);

describe('Dependency Injection', () => {
	it('inject should add metadata with params for class', () => {
		@DI.inject('foo', 'bar')
        class C{
		}
		C[Planck.Reflection.symbols.functionParams].should.be.deep.equal(['foo', 'bar']);
	});
	it('inject should add metadata with params for class method', () => {
        class C{
			@DI.inject('foo', 'bar')
			baz(){

			}
		}
		C.prototype.baz[Planck.Reflection.symbols.functionParams].should.be.deep.equal(['foo', 'bar']);
	});
	it('setStaticResolver should create array with static params for method on their positions, with undefined on another places in array (undefined at end are trimmed)', () => {
		let f = (foo, bar, baz) => {
			return foo + bar + baz;
			//some comments
		};
		Planck.Reflection.getFunctionParams(f);
		DI.setStaticResolver(f, {bar: 1});
		f[Planck.Reflection.symbols.functionParamsPrepared].should.be.deep.equal([, 1]);
	});
	it('setDynamicResolver should add dynamic resolvers to method, used with it in invoke or construct methods', () => {
		let f = (foo, bar, baz) => {
			return foo + bar + baz;
			//some comments
		};
		let resolver = {baz: function(param){return param; }};
		Planck.Reflection.getFunctionParams(f);
		DI.setDynamicResolver(f, resolver);
		f[Planck.Reflection.symbols.DIResolver].should.be.equal(resolver);
	});
	it('invoke should call function with provided context and provided data, using DI resolver for calculating needed params', () => {
		let f = function(foo, bar, baz){
			return [foo, bar, baz, this.fromContext];
			//some comments
		};
		let resolver = {foo: function(param){return param + 1; }, baz: () => 3};
		Planck.Reflection.getFunctionParams(f);
		DI.setStaticResolver(f, {bar: 2});
		DI.setDynamicResolver(f, resolver);
		Planck.Reflection.invoke(f, {fromContext: 4}, {foo: 0}).should.be.deep.equal([1, 2, 3, 4]);
	});
	it('invokeSuper should call method from parent with params, needed for parent method', () => {
		class CC{
			f(foo, bar, baz){
				return [foo, bar, baz, this.fromContext];
				//some comments
			};
		}
		class C extends CC{
			constructor(){
				super();
				this.fromContext = 4;
			}
			f(foo){
				return Planck.Reflection.invokeSuper(super.f, this);
			}
		}
		let resolver = {foo: function(param){ return param + 1; }, baz: () => 3};
		Planck.Reflection.getFunctionParams(C.prototype.f);
		Planck.Reflection.getFunctionParams(CC.prototype.f);

		DI.setStaticResolver(C.prototype.f, {bar: 2});
		DI.setStaticResolver(CC.prototype.f, {bar: 2});
		DI.setDynamicResolver(C.prototype.f, resolver);
		DI.setDynamicResolver(CC.prototype.f, resolver);
		let c = new C();
		Planck.Reflection.invoke(c.f, c, {foo: 0}).should.be.deep.equal([1, 2, 3, 4]);
	});
	it('construct are the same as invoke, but creates new object, uses provided function as constructor', () => {
		let f = function(foo, bar, baz){
			this.result = [foo, bar, baz];
			//some comments
		};
		let resolver = {foo: function(param){return param + 1; }, baz: () => 3};
		Planck.Reflection.getFunctionParams(f);
		DI.setStaticResolver(f, {bar: 2});
		DI.setDynamicResolver(f, resolver);
		Planck.Reflection.construct(f, {foo: 0}).result.should.be.deep.equal([1, 2, 3]);
	});
});
