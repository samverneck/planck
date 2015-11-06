import * as View from '../../../lib/view/view';

class JSONWrapView extends View.Base{
	constructor(){
		super();
	}
	resolve(data){
		return {data: data};
	}
}

export default JSONWrapView;
