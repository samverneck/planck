import {Controller} from 'planck';
import Users from './usersMiddleware';
import * as Reflection from '../../../lib/reflection';

@Controller.before(function(params){
	this.before.push(2);
}, function(req, res, next){
	this.before.push(22);
	next();
}, "beforeAllHandler")
@Controller.before("beforeAllHandlerFromParent")
@Controller.before(123)
@Controller.after(function(params){
	this.after.push(this.before[1 * 2]);
}, function(params){
	this.after.push(this.before[1 * 2 + 1]);
}, "afterAllHandler")
@Controller.after("afterAllHandlerFromParent")
@Controller.after(123)
class Groups extends Users{
	constructor(){
		super();
	}
	@Controller.before(function(params){
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				this.before = [1];
				resolve();
			}, 10);
		});
	}, function(params){
		this.before.push(11);
	}, 'unexisted', 'beforeMethodHandler')
	@Controller.before('beforeMethodHandlerFromParent')
	@Controller.after(function(params){
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				this.after = [this.before[0 * 2]];
				resolve();
			}, 10);
		});
	}, function(params){
		this.after.push(this.before[0 * 2 + 1]);
	}, 'unexisted', 'afterMethodHandler')
	@Controller.after('afterMethodHandlerFromParent')
	testMiddleware(params){
		Reflection.invokeSuper(super.testMiddleware, this);
	}

	beforeAllHandler(){
		this.beforeHandlerInControllers.push(3);
	}

	beforeMethodHandler(){
		this.beforeHandlerInControllers = [1];
	}

	afterAllHandler(){
		this.afterHandlerInControllers.push(this.beforeHandlerInControllers[2]);
	}

	afterMethodHandler(){
		this.afterHandlerInControllers = [this.beforeHandlerInControllers[0]];
	}
}

export default Groups;
