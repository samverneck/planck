class BaseProvider{
	constructor(){

	}

	calcQuery(){
		throw new Error("Can not run query to db");
	}
}

export default BaseProvider;