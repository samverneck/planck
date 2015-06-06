import Base from './router-base.js';
import * as Controller from '../../controller/controller.js';
import * as View from '../../view/view.js';

/**
 * @class
 * @classdesc RouterHTTP is the main router for handle http requests. It uses some helpers for
 * easier and faster creating routes. To use this router just pass this class in app.use()
 */
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
		let routeBinded = route.bind(resources);
		routeBinded.get = route.get.bind(resources);
		routeBinded.post = route.post.bind(resources);
		routeBinded.put = route.put.bind(resources);
		routeBinded.patch = route.patch.bind(resources);
		routeBinded.delete = route.delete.bind(resources);

		router = new this(resource.bind(resources), routeBinded);
		let moduleNames = [...resources.controllers];

		for (let i = 0; i < moduleNames.length; i++) {
			try{
				router.controllers[moduleNames[i]] = await System.import("controllers/"+moduleNames[i]);
			} catch(err) {
				console.error(err);
			}
		}	
		for (let route of resources.routes){
			//TODO: check not only "default import"
			if (router.controllers[route.controller] && typeof router.controllers[route.controller].default === 'function'){

				let method = route.method;
				let ControllerForMethod = router.controllers[route.controller].default;
				let viewsForMethod = ControllerForMethod["__views__"+method] || ControllerForMethod.__views;
				
				for (let i = 0; i < viewsForMethod.length; i++) {
					await router.views.add(viewsForMethod[i]);
				};
				let view = router.views.get(viewsForMethod[0]);
				if (view && typeof ControllerForMethod.prototype[method] === 'function' && typeof view.render === 'function'){
					app.httpApp[route.type](route.path, async (req, res) => {
						let controller = new ControllerForMethod();
						await controller[method](req.params);
						res.status(200).send(view.render(controller));
					});
				} else {
					app.httpApp[route.type](route.path, (req, res) => {
						res.status(501).send();
					});
				}
			} else {
				console.error(`Could not find controller ${route.controller} for route ${route.type} ${route.path}`);
				app.httpApp[route.type](route.path, (req, res) => {
					res.status(501).send();
				});
			}
		}
		return router;
	}
}

const METHODS = new Set([
	{name: "create", type: ["post"]},
	{name: "read", type: ["get"], mod: "/:id"},
	{name: "readAll", type: ["get"]},
	{name: "update", type: ["patch", "put"], mod: "/:id"},
	{name: "delete", type: ["delete"], mod: "/:id"}
]);

const HTTPMETHODS = new Set(["get", "post", "patch", "put", "delete"]);

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
			for (let type of method.type){
				parent.routes.push({type: type, path: path, controller: name, method: method.name});
			}
		}
	}
	parent.controllers.add(name);
	if (typeof callback == "function"){
		callback(resource.bind(this.scope[name]));
	}
}
//TODO: single json param


function route(path, controllerMethod, actions){
	if (typeof path !== "string"){
		console.error('need to provide path in route');
		return;
	}
	if (typeof controllerMethod !== "string"){
		console.error("need to provide controller's name in route");
		return;
	}
	let [controller, methodInController] = controllerMethod.split(".");
	if (typeof methodInController !== "string"){
		console.error("need to provide controller's handler name in route");
		return;
	}
	for (let method of HTTPMETHODS){
		if ((!actions) || (actions.indexOf(method) !== -1)){
			this.routes.push({type: method, path: path, controller: controller, method: methodInController});
		}
	}
	this.controllers.add(controller);
}

route.get = function(path, controllerMethod){
	route.call(this, path, controllerMethod, ["get"]);
}

route.post = function(path, controllerMethod){
	route.call(this, path, controllerMethod, ["post"]);
}

route.put = function(path, controllerMethod){
	route.call(this, path, controllerMethod, ["put"]);
}

route.patch = function(path, controllerMethod){
	route.call(this, path, controllerMethod, ["patch"]);
}

route.delete = function(path, controllerMethod){
	route.call(this, path, controllerMethod, ["delete"]);
}

export {RouterHTTP};