class Base{
	constructor(){

	}
	static init(){
		if ((this === Base)||(!Base.isPrototypeOf(this))){
			throw new TypeError("Cannot init Base class, you should extend it before");
		}
		const instance = new this;
	}
}

export default Base;