import Base from './router-base.js';
import * as Controller from '../../controller/controller.js';
import * as View from '../../view/view.js';

class RouterHTTP extends Base{
	constructor(){
		super();
		this.controllers = {};
		this.views = new View.ViewPool();
		if (!RouterHTTP.isPrototypeOf(this.constructor)){
			throw new AbstractClassError();
		}
	}
	static async create(app){
		let resources = {routes: [], controllers: new Set()};
		let router = null;

		router = new this(resource.bind(resources));

		let moduleNames = [...resources.controllers];
		await Promise.all(moduleNames.map(x => System.import("controllers/"+x))).then(async (modules) => {
			for (let i = 0; i < moduleNames.length; i++) {
				router.controllers[moduleNames[i]] = modules[i];
			}
			for (let route of resources.routes){
				//TODO: check not only "default import"
				if (typeof router.controllers[route.controller].default === 'function'){
					let method = route.method;
					let ControllerForMethod = router.controllers[route.controller].default;
					let viewsForMethod = ControllerForMethod["__views__"+method] || ControllerForMethod.__views;
					
					for (let i = 0; i < viewsForMethod.length; i++) {
						await router.views.add(viewsForMethod[i]);
					};

					let view = router.views.get(viewsForMethod[0]);
					if (view && typeof view.render === 'function'){
						app.httpApp[route.type](route.path, async (req, res) => {
							let controller = new ControllerForMethod();
							await controller[method](req.params);
							res.status(200).send(view.render(controller));
						});
					} else {
						app.httpApp[route.type](route.path, (req, res) => {
							res.status(501).send({name: ''});
						});
					}
				} else {
					console.error(`Could not find controller ${route.controller} for resource!`);
					app.httpApp[route.type](route.path, (req, res) => {
						res.status(501).send({name: ''});
					});
				}
			}
		}, async (err) => {
			console.log(err);
		});
		return router;
	}
}

const METHODS = new Set([
	{name: "create", type: "post"},
	{name: "read", type: "get", mod: "/:id"},
	{name: "readAll", type: "get"},
	{name: "update", type: "patch", mod: "/:id"},
	{name: "delete", type: "delete", mod: "/:id"}
]);

function resource(name, actions, callback){
	if (typeof actions == "function"){
		callback = actions;
	} else if (actions instanceof Array){
		this.actions = actions;
	}

	this.scope = this.scope || {};
	this.scope[name] = {parent: this, parentName: name};

	let parent = this;
	let paths = {};

	while (parent.parent) {
		for (let method of METHODS){
			if ((!this.actions) || (this.actions.indexOf(method.name) !== -1)){
				if (paths[method.name]){
					paths[method.name]=`${parent.parentName}/:${parent.parentName}Id/${paths[method.name]}`;
				} else {
					paths[method.name]=`${parent.parentName}/:${parent.parentName}Id/`;
				}
			}
		}
		parent = parent.parent;
	}

	for (let method of METHODS){
		if ((!this.actions) || (this.actions.indexOf(method.name) !== -1)){
			let path = `/${paths[method.name]?paths[method.name]:""}${name}${method.mod?method.mod:""}`;
			parent.routes.push({type: method.type, path: path, controller: name, method: method.name});
		}
	}
	parent.controllers.add(name);
	if (typeof callback == "function"){
		callback(resource.bind(this.scope[name]));
	}
}

export {RouterHTTP};
export {resource};