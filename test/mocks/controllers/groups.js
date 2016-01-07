import {Controller} from 'planck';
import Users from './users';

@Controller.useViews('json-wrap-extended-view')
class GroupsController extends Users{
	constructor(){
		super();
	}

	@Controller.useViews('html-test-view')
	readList(params){
		this.res = 'readList';
	}
}

export default GroupsController;
