# Changelog

## 0.12.2 (30 August 2016) - Fixed some bugs
* **Fix**
 * Fixed wrong detection if file was manualy modified by user

## 0.12.0 (29 August 2016) - Code generation update
* **New Feature**
 * Code generators are full configurable by users now! You can redefine system generators or create new. For now, generator is a class with configuration when and how to run and with some methods for generation. Generators can re-generate files, which was not modified by user. For example if you add new field to your model, you can automatically re-generate associated json schema. This functionality is experimental and almost dont work with VCS's now, but in future release that will be fixed.
* **Known issues**
 * New functionality is lack of tests =(

## 0.11.0 (24 May 2016) - Middleware update
* **New Feature**
 * ```@before``` and ```@after``` can accept json with params for handler now. For example if you have decorator ```@authorize``` you can specify role id for each route separately
 * ```@skipBefore``` and ```@skipAfter``` decorators can also skip plain functions now
 * New decorator: ```@PROTECTED```. It used for hiding properties (making them non-enumerable).

## 0.10.1 (15 May 2016) - Dependecies update
* **Fix**
 * Fixed transpilling of ./bin folder - .babelrc was in .npmignore

## 0.10.0 (15 May 2016) - Dependecies update
* **Internal**
 * Updated all dependencies. Core moved to Babel 6.x + Node 6.x, SystemJS was removed.

## 0.9.1 (14 January 2016) - Fixed some bugs
* **Fix**
 * fixed multiple calls of the same before/after handlers
 * fixed accident crash of controllers due to some bugs with Symbols - some symbols changed to plain non-enumerable properties
 * fixed path resolving for default config

## 0.9.0 (7 January 2016)
* **New Feature**
 * Auto generated models. Just add import to your controller and restart server. Planck overrides default module loading pipeline and generate models if they are not exists.
 * User generated templates for code-generators. Just provide ```template``` parameter in controller/model config with path to its ejs template.
* **Fix**
 * fixed wrong router pipeline - previously resolve can be called after reject.

## 0.8.0 (16 November 2015)
* **New Feature**
 * Improvements with express middleware. For now it's possible to pass express middleware directly into before/after handlers in controller.
 * New config parameter - bodyParser.

## 0.7.3 (12 November 2015)
* **Fix**
 * fixed naming of http router methods

## 0.7.2 (6 November 2015)
* **Fix**
 * fixed paths for SystemJS

## 0.7.1 (6 November 2015)
* **Fix**
 * fixed missing dependencies

## 0.7.0 (6 November 2015) - System and active-record update
 * **New Feature**
  * Added new feature - auto code generation. If special flag in config are turned on some core modules, such controllers or models will be generated automatically on their require. For example if you create new resource in your router and restart server it will create controller for this resource and put it in your controller's folder. This feature can increase fast bootstrap of new project and can be turned off in production. In current release only simple controllers are generates.
  * Added some simple CRUD methods for active-record. Active-record now is state-machine for better chaining validation.
  * Added resolvers for CRUD methods in mongodb provider.
  * Added error handler for rendering in views.
 * **Internal**
  * Switched to SystemJS. It will help to provide flexible runtime code-generators for development.
  * Many small changes in most files due switching to SystemJS process.

## 0.6.0 (8 July 2015) - Reflection update
 * **New Feature**
  * Added new module - Reflection. It used for work with any metadata in framework.
  * Added possibility to use @inject() with controller's methods.
  * Added AngularJS-like arguments parsing, so if no @inject() provided - method's params will be parsed and used for DI, so for now all params in controllers and routers are position-agnostic.
  * Added helpers for controller: @skipBefore() and @skipAfter(). They are used to prevent execution of corresponding @before() and @after() from entire inheritance chain.
 * **Internal**
  * All private metadata have changed from dashed properties (like ```__beforeHandlers```) to symbols from Reflection module
 * **Fix**
  * fixed @abstractMethodAsync(), now it correctly worked for non-static methods

## 0.5.0 (20 June 2015) - Middleware update
 * **New Feature**
  * Added helpers for http router: rawRouter (raw Express app for low-level actions)
  * Added possibility to pass Express middleware in App.use()
  * Added helpers for controller: @before() and @after(). They are used to specify middleware, used before and after controllers method execution.
  * Added @inject() helper http router's constructor. It resolves DI pattern for http router and will be used for DI in another classes in the future.

## 0.4.0 (2 June 2015)
 * **New Feature**
  * Added route helper for http router. It need to manualy define single route and bind it on method in provided controller.
 * **Fix**
  * Added put requests in http resource helper.
  * Fixed some cases where router returned 404 instead 501 if something missed in client code.

## 0.3.10 (31 May 2015)
 * **Fix**
  * Fixed npm package

## 0.3.0 (31 May 2015)
 * **New Feature**
  * Basic support of cli. First command available is planck app <appname>: it creates template for new planck app. For using cli planck should be installed global.
  * Added namespace for all 'public' classes in main planck file.
  * Added helpers for some usefull tasks, such as promissifying module to let use native node modules with async/await syntax.

## 0.2.0 (24 May 2015)
 * **New Feature**
  * Basic router functionality
  * Basic controller functionality
  * Basic view functionality

## 0.1.0 (13 April 2015)
 * **New Feature**
  * App entry point
  * Basic active record functionality
