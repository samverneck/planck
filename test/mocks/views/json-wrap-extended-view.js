import JSONWrapView from './json-wrap-view';

class JSONWrapExtendedView extends JSONWrapView{
	constructor(){
		super();
	}
	resolve(data){
		return {data: data, status: 200};
	}
}

export default JSONWrapExtendedView;
