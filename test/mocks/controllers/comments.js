import {Controller} from 'planck';

class Comments extends Controller.Base{
	constructor(){
		super();
	}

	@Controller.useViews('non-existent-view')
	read(){

	}
}

export default Comments;
