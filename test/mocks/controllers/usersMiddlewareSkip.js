import * as Controller from '../../../lib/controller/controller';

@Controller.before('beforeAllHandlerInParent')
@Controller.before('beforeAllNeverCalledInParent', 'beforeMethodNeverCalledInParent')
@Controller.after('afterAllHandlerInParent')
@Controller.after('afterAllNeverCalledInParent', 'afterMethodNeverCalledInParent')
class Users extends Controller.Base{
	constructor(){
		super();
	}
	@Controller.before('beforeMethodHandlerInParent')
	@Controller.after('afterMethodHandlerInParent')
	testMiddleware(params){
	}

	@Controller.before('beforeMethodHandlerInParent')
	@Controller.after('afterMethodHandlerInParent')
	testMiddleware2(params){
	}

	beforeMethodHandlerFromParent(){
		this.beforeHandlers = this.beforeHandlers || [];
		this.beforeHandlers.push('beforeMethodHandlerFromParent');
	}

	beforeAllHandlerFromParent(){
		this.beforeHandlers = this.beforeHandlers || [];
		this.beforeHandlers.push('beforeAllHandlerFromParent');
	}

	beforeAllHandlerInParent(){
		this.beforeHandlers = this.beforeHandlers || [];
		this.beforeHandlers.push('beforeAllHandlerInParent');
	}

	beforeMethodHandlerInParent(){
		this.beforeHandlers = this.beforeHandlers || [];
		this.beforeHandlers.push('beforeMethodHandlerInParent');
	}

	beforeAllNeverCalledInParent(){
		this.beforeHandlers = this.beforeHandlers || [];
		this.beforeHandlers.push('beforeAllNeverCalledInParent');
	}

	beforeMethodNeverCalledInParent(){
		this.beforeHandlers = this.beforeHandlers || [];
		this.beforeHandlers.push('beforeMethodNeverCalledInParent');
	}

	afterMethodHandlerFromParent(){
		this.afterHandlers = this.afterHandlers || [];
		this.afterHandlers.push('afterMethodHandlerFromParent');
	}

	afterAllHandlerFromParent(){
		this.afterHandlers = this.afterHandlers || [];
		this.afterHandlers.push('afterAllHandlerFromParent');
	}

	afterAllHandlerInParent(){
		this.afterHandlers = this.afterHandlers || [];
		this.afterHandlers.push('afterAllHandlerInParent');
	}

	afterMethodHandlerInParent(){
		this.afterHandlers = this.afterHandlers || [];
		this.afterHandlers.push('afterMethodHandlerInParent');
	}

	afterAllNeverCalledInParent(){
		this.afterHandlers = this.afterHandlers || [];
		this.afterHandlers.push('afterAllNeverCalledInParent');
	}

	afterMethodNeverCalledInParent(){
		this.afterHandlers = this.afterHandlers || [];
		this.afterHandlers.push('afterMethodNeverCalledInParent');
	}
}

export default Users;
