import Base from './router-base.js';
import * as Controller from '../../controller/controller.js';
import * as View from '../../view/view.js';
import * as Reflection from '../../reflection.js';
import {symbols} from '../../reflection.js';
import * as DI from '../../dependency-injection.js';
import pathModule from '@node/path';
import CodeGenerator from '../../code-generator/code-generator';

const METHODS = new Set([
	{name: 'create', type: ['post']},
	{name: 'read', type: ['get'], mod: '/:id'},
	{name: 'readAll', type: ['get']},
	{name: 'update', type: ['patch', 'put'], mod: '/:id'},
	{name: 'delete', type: ['delete'], mod: '/:id'}
]);

const HTTPMETHODS = new Set(['get', 'post', 'patch', 'put', 'delete']);

let stack = [];

function resource(name, actions, callback = actions){
	if ((typeof actions === 'function') || (!(actions instanceof Array))){
		actions = null;
	}
	let routes = [];
	let controllerData = this.controllers.get(name);
	if (!controllerData){
		controllerData = {methods: new Map()};
		this.controllers.set(name, controllerData);
	}
	for (let method of METHODS){
		if (!actions || (actions.indexOf(method.name) !== -1)){
			let path = '';
			controllerData.methods.set(method.name, {isFramework: true});
			for (let res of stack) {
				path = `${path}/${res}/:${res}Id`;
			}
			path = `${path}/${name}${method.mod || ''}`;
			for (let type of method.type){
				routes.push({type: type, path: path, controller: name, method: method.name});
			}
		}
	}

	if (typeof callback === 'function'){
		stack.push(name);
		callback();
		stack.pop();
	}
	this.routes.push(...routes);
}

function route(path, controllerMethod, actions){
	if (typeof path !== 'string'){
		console.error('need to provide path in route');
		return;
	}

	let controller;
	let methodInController;

	if (typeof controllerMethod === 'string'){
		[controller, methodInController] = controllerMethod.split('.');
	} else if (stack.length){
		controller = stack[stack.length - 1];
		methodInController = path.split('/').pop();
	} else {
		console.error('need to provide conttroller.method or use route in resource');
		return;
	}
	if (typeof methodInController !== 'string'){
		console.error(`need to provide controller's handler name in route`);
		return;
	}
	let pathPrefix = '';
	for (let i = 0; i < stack.length - 1; i++) {
		pathPrefix = `${pathPrefix}/${stack[i]}/:${stack[i]}Id`;
	}
	if (stack.length){
		pathPrefix = `${pathPrefix}/${stack[stack.length - 1]}`;
	}
	path = pathModule.normalize(`${pathPrefix}/${path}`);
	for (let method of HTTPMETHODS){
		if ((!actions) || (actions.indexOf(method) !== -1)){
			this.routes.push({type: method, path: path, controller: controller, method: methodInController});
		}
	}
	let controllerData = this.controllers.get(controller);
	if (!controllerData){
		controllerData = {methods: new Map()};
		this.controllers.set(controller, controllerData);
	}
	controllerData.methods.set(methodInController, {isFramework: false});
}

route.get = function(path, controllerMethod){
	route.call(this, path, controllerMethod, ['get']);
};

route.post = function(path, controllerMethod){
	route.call(this, path, controllerMethod, ['post']);
};

route.put = function(path, controllerMethod){
	route.call(this, path, controllerMethod, ['put']);
};

route.patch = function(path, controllerMethod){
	route.call(this, path, controllerMethod, ['patch']);
};

route.delete = function(path, controllerMethod){
	route.call(this, path, controllerMethod, ['delete']);
};

let setRouterDIResolvers = function(router, app, resources){
	Reflection.getFunctionParams(router);
	DI.setStaticResolver(router, {
		rawRouter: app.httpApp
	});
	DI.setDynamicResolver(router, {
		resource: function(){
			return resource.bind(resources);
		},
		route: function(){
			let routeBinded = route.bind(resources);
			routeBinded.get = route.get.bind(resources);
			routeBinded.post = route.post.bind(resources);
			routeBinded.put = route.put.bind(resources);
			routeBinded.patch = route.patch.bind(resources);
			routeBinded.delete = route.delete.bind(resources);
			return routeBinded;
		}
	});
};

const CONTROLLER_DI_DYNAMIC_RESOLVERS = {
	req: function(req){
		return req;
	},
	res: function(res){
		return res;
	},
	params: function(params){
		return params;
	}
};

let setControllerDIResolvers = function(fn){
	Reflection.getFunctionParams(fn);
	DI.setDynamicResolver(fn, CONTROLLER_DI_DYNAMIC_RESOLVERS);
	return fn;
};

let getBeforeHandlers = function(controller, method){
	let getBeforeHandlersRecursion = function(parent){
		let beforeHandlers = [];
		if (parent !== Controller.Base){
			beforeHandlers = getBeforeHandlersRecursion(Object.getPrototypeOf(parent));
		}
		if (parent[symbols.beforeHandlers]){
			beforeHandlers = parent[symbols.beforeHandlers].concat(beforeHandlers);
		}
		if (parent[symbols.skipBeforeHandlers]){
			beforeHandlers = beforeHandlers.filter(item => (typeof item !== 'string' || parent[symbols.skipBeforeHandlers].indexOf(item) === -1));
		}
		if (parent.prototype.hasOwnProperty(method) && parent.prototype[method][symbols.beforeHandlers]){
			beforeHandlers = parent.prototype[method][symbols.beforeHandlers].concat(beforeHandlers);
		}
		if (parent.prototype.hasOwnProperty(method) && parent.prototype[method][symbols.skipBeforeHandlers]){
			beforeHandlers = beforeHandlers.filter(item => (typeof item !== 'string' || parent.prototype[method][symbols.skipBeforeHandlers].indexOf(item) === -1));
		}
		return beforeHandlers;
	};

	let beforeHandlers = getBeforeHandlersRecursion(controller);
	beforeHandlers = beforeHandlers.filter(item => (typeof item !== 'string' || controller.prototype[item]))
		.map(item => ((typeof item === 'string') ? controller.prototype[item] : item))
		.map(item => setControllerDIResolvers(item));

	return beforeHandlers;
};

let getAfterHandlers = function(controller, method){
	let getAfterHandlersRecursion = function(parent){
		let afterHandlers = [];
		if (parent !== Controller.Base){
			afterHandlers = getAfterHandlersRecursion(Object.getPrototypeOf(parent));
		}
		if (parent[symbols.afterHandlers]){
			afterHandlers = parent[symbols.afterHandlers].concat(afterHandlers);
		}
		if (parent[symbols.skipAfterHandlers]){
			afterHandlers = afterHandlers.filter(item => (typeof item !== 'string' || parent[symbols.skipAfterHandlers].indexOf(item) === -1));
		}
		if (parent.prototype.hasOwnProperty(method) && parent.prototype[method][symbols.afterHandlers]){
			afterHandlers = parent.prototype[method][symbols.afterHandlers].concat(afterHandlers);
		}
		if (parent.prototype.hasOwnProperty(method) && parent.prototype[method][symbols.skipAfterHandlers]){
			afterHandlers = afterHandlers.filter(item => (typeof item !== 'string' || parent.prototype[method][symbols.skipAfterHandlers].indexOf(item) === -1));
		}
		return afterHandlers;
	};

	let afterHandlers = getAfterHandlersRecursion(controller);
	afterHandlers = afterHandlers.filter(item => (typeof item !== 'string' || controller.prototype[item]))
		.map(item => ((typeof item === 'string') ? controller.prototype[item] : item))
		.map(item => setControllerDIResolvers(item));

	return afterHandlers;
};

/**
 * RouterHTTP is the main router for handle http requests. It uses some helpers for
 * easier and faster creating routes. To use this router just pass this class in app.use()
 * @class RouterHTTP
 * @extends Base
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
	/**
	 * Method for creating router. Router should be constructed only by this method, not directly via 'new'.
	 *
	 * 	let router = routerHTTP.create(expressServer);
	 * @method create
	 * @param {App} app express app
	 * @return {RouterHTTP} constructed router
	 * @static
	 */
	static async create(app){
		let resources = {routes: [], controllers: new Map()};
		setRouterDIResolvers(this, app, resources);
		let router = Reflection.construct(this);
		let moduleNames = [...resources.controllers.keys()];

		if (app.config.codeGeneration.autoGeneration){
			let dataToGenerate = [];
			for (let [name, controller] of resources.controllers.entries()){
				dataToGenerate.push(CodeGenerator.generateIfNotExists('controller', {name: name, ...controller}, './controllers'));
			}
			await Promise.all(dataToGenerate);
		}

		for (let i = 0; i < moduleNames.length; i++) {
			try{
				router.controllers[moduleNames[i]] = await System.import(app.config.controllers.path + moduleNames[i]);
			} catch(err) {
				console.error(err);
			}
		}
		for (let route of resources.routes){
			//TODO: check not only "default import"
			if (router.controllers[route.controller] && typeof router.controllers[route.controller].default === 'function'){
				let method = route.method;
				let ControllerForMethod = router.controllers[route.controller].default; //TODO: need to check inheritance
				let viewsForMethod = (ControllerForMethod.prototype[method] && ControllerForMethod.prototype[method][symbols.views]) || ControllerForMethod[symbols.views];

				for (let i = 0; i < viewsForMethod.length; i++) {
					await router.views.add(viewsForMethod[i]);
				}
				let view = router.views.get(viewsForMethod[0]);
				if (view && typeof ControllerForMethod.prototype[method] === 'function' && typeof view.resolve === 'function' && typeof view.reject === 'function'){
					let parent = ControllerForMethod;
					let beforeHandlers = getBeforeHandlers(ControllerForMethod, method);
					let afterHandlers = getAfterHandlers(ControllerForMethod, method);

					setControllerDIResolvers(ControllerForMethod.prototype[method]);
					//get middleware, used before and after controllers method

					while (parent !== Controller.Base){
						for (let i of Object.getOwnPropertyNames(parent.prototype)){
							if (typeof parent.prototype[i] === 'function'){
								setControllerDIResolvers(parent.prototype[i]);
							}
						}
						parent = Object.getPrototypeOf(parent);
					}

					let handler = async (req, res) => {
						let result, status, data;
						let controller = new ControllerForMethod();
						try{
							Object.assign(req.params, req.body, req.query);
							for (let i = 0; i < beforeHandlers.length; i++) {
								await Reflection.invoke(beforeHandlers[i], controller, {req: req, res: res, params: req.params});
							}
							await Reflection.invoke(controller[method], controller, {req: req, res: res, params: req.params});
							for (let i = 0; i < afterHandlers.length; i++) {
								await Reflection.invoke(afterHandlers[i], controller, {req: req, res: res, params: req.params});
							}
						} catch(error) {
							result = await view.reject(error);
							status = (result instanceof Array) ? result[1] : 500;
							data = (result instanceof Array) ? result[0] : result;
							res.status(status).send(data);
						}
						result = await view.resolve(controller);
						status = (result instanceof Array) ? result[1] : 200;
						data = (result instanceof Array) ? result[0] : result;
						res.status(status).send(data);
					};
					app.httpApp[route.type](route.path, handler);
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

export {RouterHTTP};
