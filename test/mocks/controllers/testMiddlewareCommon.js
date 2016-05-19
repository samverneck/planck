import {Controller} from 'planck';

class MiddlewareCommon extends Controller.Base{

    @Controller.before({
		handler: function(bar){
			this.res=`foo_${bar}`;
		},
		params: {
			bar: 'testBeforeWithParams'
		}
	})
	testBeforeWithParams(){

	}

    @Controller.after({
		handler: function(bar){
			this.res=`foo_${bar}`;
		},
		params: {
			bar: 'testAfterWithParams'
		}
	})
	testAfterWithParams(){

	}

    beforeHandlerByName(bar){
        this.res=`foo_${bar}`;
    }

    @Controller.before({
		handler: 'beforeHandlerByName',
		params: {
			bar: 'testBeforeWithParamsByName'
		}
	})
	testBeforeWithParamsByName(){

	}

    afterHandlerByName(bar){
        this.res=`foo_${bar}`;
    }

    @Controller.after({
		handler: 'afterHandlerByName',
		params: {
			bar: 'testAfterWithParamsByName'
		}
	})
	testAfterWithParamsByName(){

	}

    @Controller.before({
		handler: 'beforeHandlerByName',
		params: {
			bar: 'baz'
		}
	})
	testBeforeWithParamsByNameWithOverride(){

	}

    @Controller.after({
		handler: 'afterHandlerByName',
		params: {
			bar: 'baz'
		}
	})
	testAftereWithParamsByNameWithOverride(){

	}
}

export default MiddlewareCommon;
