import * as Controller from '../../../lib/controller/controller';
import Users from './users';

@Controller.useViews('json-wrap-extended-view')
class Groups extends Users{
	constructor(){
		super();
	}

	@Controller.useViews('html-test-view')
	readList(params){
		this.res = "readList";
	}
}

export default Groups;
