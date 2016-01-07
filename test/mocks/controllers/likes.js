import {Controller} from 'planck';

class Likes extends Controller.Base{
	constructor(){
		super();
	}

	@Controller.useViews("html-test-view", 'json-wrap-extended-view');
	read(){

	}
}

export default Likes;
