# Changelog

## 0.4.0 (2 June 2015)
 * **New Feature**
  * Added route helper for http router. It need to manualy define single route and bind it on method in provided controller.
 * **Fix**
  * Added put requests in http resource helper.
  * Fixed some cases where router returned 404 insted 501 if something missed in client code.

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