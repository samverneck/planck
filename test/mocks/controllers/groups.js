import * as Controller from '../../../lib/controller/controller';
import Users from './users';


@Controller.useViews('json-wrap-extended-view')
class Groups extends Users{
	constructor(){
		super();
	}

	@Controller.useViews('html-test-view')
	readAll(params){
		this.res = "readAll";
	}
}

export default Groups;