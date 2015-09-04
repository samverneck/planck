import * as Controller from '../../../lib/controller/controller';

class Comments extends Controller.Base{
	constructor(){
		super();
	}

	@Controller.useViews('non-existent-view')
	read(){

	}
}

export default Comments;
