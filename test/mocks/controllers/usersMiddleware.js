import * as Controller from '../../../lib/controller/controller';

@Controller.before(function(params){
	this.before.push(4);
}, function(params){
	this.before.push(44);
}, "beforeAllHandlerInParent")
@Controller.after(function(params){
	this.after.push(this.before[3 * 2]);
}, function(params){
	this.after.push(this.before[3 * 2 + 1]);
}, "afterAllHandlerInParent")
class Users extends Controller.Base{
	constructor(){
		super();
	}
	@Controller.before(function(params){
		this.before.push(3);
	}, function(params){
		this.before.push(33);
	}, "beforeMethodHandlerInParent")
	@Controller.after(function(params){
		this.after.push(this.before[2 * 2]);
	}, function(params){
		this.after.push(this.before[2 * 2 + 1]);
	}, "afterMethodHandlerInParent")
	testMiddleware(params){
		this.res = 1;
	}

	beforeMethodHandlerFromParent(){
		this.beforeHandlerInControllers.push(2);
	}

	beforeAllHandlerFromParent(){
		this.beforeHandlerInControllers.push(4);
	}

	beforeAllHandlerInParent(){
		this.beforeHandlerInControllers.push(6);
	}

	beforeMethodHandlerInParent(){
		this.beforeHandlerInControllers.push(5);
	}

	afterMethodHandlerFromParent(){
		this.afterHandlerInControllers.push(this.beforeHandlerInControllers[1]);
	}

	afterAllHandlerFromParent(){
		this.afterHandlerInControllers.push(this.beforeHandlerInControllers[3]);
	}

	afterAllHandlerInParent(){
		this.afterHandlerInControllers.push(this.beforeHandlerInControllers[5]);
	}

	afterMethodHandlerInParent(){
		this.afterHandlerInControllers.push(this.beforeHandlerInControllers[4]);
	}
}

export default Users;
