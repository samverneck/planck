import * as View from '../../../lib/view/view';

class Error500to400View extends View.Base{
	constructor(){
		super();
	}
	resolve(data){
		return {data: data};
	}
    reject(e){
        return ['some error', 404];
    }
}

export default Error500to400View;
