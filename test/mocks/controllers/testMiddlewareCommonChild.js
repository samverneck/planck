import {Controller} from 'planck';
import MiddlewareCommon from './testMiddlewareCommon';

class MiddlewareCommonChild extends MiddlewareCommon{
    @Controller.skipBefore('beforeHandlerByName');
    @Controller.before({
		handler: 'beforeHandlerByName',
		params: {
			bar: 'testBeforeWithParamsByNameWithOverride'
		}
	})
	testBeforeWithParamsByNameWithOverride(){

	}

    @Controller.skipAfter('afterHandlerByName');
    @Controller.after({
		handler: 'afterHandlerByName',
		params: {
			bar: 'testAftereWithParamsByNameWithOverride'
		}
	})
	testAftereWithParamsByNameWithOverride(){

	}
}

export default MiddlewareCommonChild;
