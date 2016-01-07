import {Controller} from 'planck';
import Users from './usersMiddlewareSkip';
import * as Reflection from '../../../lib/reflection';

@Controller.before('beforeAllHandler')
@Controller.before('beforeAllHandlerFromParent')
@Controller.after('afterAllHandler')
@Controller.after('afterAllHandlerFromParent')
@Controller.skipBefore('beforeAllNeverCalledInParent')
@Controller.skipAfter('afterAllNeverCalledInParent')
class Groups extends Users{
	constructor(){
		super();
	}
	@Controller.before(
		'unexisted',
		'beforeMethodHandler',
		'beforeMethodHandlerFromParent'
	)
	@Controller.after(
		'unexisted',
		'afterMethodHandler',
		'afterMethodHandlerFromParent'
	)
	@Controller.skipBefore('beforeMethodNeverCalledInParent')
	@Controller.skipAfter('afterMethodNeverCalledInParent')
	testMiddleware(params){
		Reflection.invokeSuper(super.testMiddleware, this);
	}

	@Controller.skipAfter(
		'afterMethodHandler',
		'afterMethodHandlerFromParent',
		'afterAllHandler',
		'afterAllHandlerFromParent',
		'afterMethodHandlerInParent',
		'afterAllHandlerInParent'
	)
	@Controller.skipBefore(
		'beforeMethodHandler',
		'beforeMethodHandlerFromParent',
		'beforeAllHandler',
		'beforeAllHandlerFromParent',
		'beforeMethodHandlerInParent',
		'beforeAllHandlerInParent'
	)
	@Controller.before(
		'unexisted',
		'beforeMethodHandler',
		'beforeMethodHandlerFromParent'
	)
	@Controller.after(
		'unexisted',
		'afterMethodHandler',
		'afterMethodHandlerFromParent'
	)
	@Controller.skipBefore('beforeMethodNeverCalledInParent')
	@Controller.skipAfter('afterMethodNeverCalledInParent')
	testMiddleware2(params){
		Reflection.invokeSuper(super.testMiddleware2, this);
	}

	beforeAllHandler(){
		this.beforeHandlers = this.beforeHandlers || [];
		this.beforeHandlers.push('beforeAllHandler');
	}

	beforeMethodHandler(){
		this.beforeHandlers = this.beforeHandlers || [];
		this.beforeHandlers.push('beforeMethodHandler');
	}

	afterAllHandler(){
		this.afterHandlers = this.afterHandlers || [];
		this.afterHandlers.push('afterAllHandler');
	}

	afterMethodHandler(){
		this.afterHandlers = this.afterHandlers || [];
		this.afterHandlers.push('afterMethodHandler');
	}
}

export default Groups;
