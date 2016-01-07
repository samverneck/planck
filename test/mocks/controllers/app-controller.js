import {Controller} from 'planck';

@Controller.useViews('json-wrap-view')
class AppController extends Controller.Base{
	constructor(){
		super();
	}
	read(params){
		this.user = params;
	}

	readList(params){
		this.res = 'readList';
	}
	update(params){
		this.res = 'update';
	}
}

export default AppController;
