'use strict';

var gulp = require('gulp-help')(require('gulp'));
var runSequence = require("run-sequence");
var plumber = require('gulp-plumber');

var paths = (new function(){
	this.dest = "build";
	this.exclude = ["!{node_modules,node_modules/**}", "!.gitignore", "!.npmignore", "!{.git,.git/**}","!{build,build/**}", "!{bin,bin/**}", "!{logs,logs/**}", "!{coverage,coverage/**}", "!{tasks,tasks/**}", "!gulpfile.js"];
	this.js = ["./**/*.js"];
	this.test = ["{test,test/**/*.js}"];
	this.cli = ["{bin,bin/**}"];
}());

var exclude = function(path){
	if(path instanceof Array){
		return path.map(function(el){return "!"+el;});
	}
	return "!"+path;
};

var buildBabel = function(watching){
	var watch = require("gulp-watch");
	var babel = require("gulp-babel");
	var insert = require("gulp-insert");
	var rename = require("gulp-rename");

	var src = gulp.src(paths.js.concat(paths.exclude, exclude(paths.test, paths.cli)).concat(["!index.js"]))
		.pipe(plumber());
	if (watching) {
		src = src.pipe(watch(paths.js.concat(paths.exclude, exclude(paths.test, paths.cli)), {ignoreInitial: true}))
	}
	src.pipe(insert.prepend('require("source-map-support").install();'))
		.pipe(babel({sourceMaps: "inline"}))
		.on('error', console.error.bind(console))
		.pipe(gulp.dest(paths.dest));

	var src = gulp.src(paths.test.concat(paths.exclude).concat(["!index.js"]))
		.pipe(plumber());
	if (watching) {
		src = src.pipe(watch(paths.test.concat(paths.exclude), {ignoreInitial: true}))
	}
	src.pipe(insert.prepend('require("source-map-support").install();require("babel-core/polyfill");'))
		.pipe(babel({sourceMaps: "inline"}))
		.on('error', console.error.bind(console))
		.pipe(gulp.dest(paths.dest));

	var src = gulp.src(paths.cli)
		.pipe(plumber());
	if (watching) {
		src = src.pipe(watch(paths.cli, {ignoreInitial: true}))
	}
	src.pipe(babel({sourceMaps: "inline"}))
		.on('error', console.error.bind(console))
		.pipe(insert.prepend('require("source-map-support").install();require("babel-core/polyfill");require("../polyfill/system");'))
		.pipe(insert.prepend('#!/usr/bin/env node\n'))
		.pipe(rename({
			extname: ""
		}))
		.pipe(gulp.dest(paths.dest));

	var src = gulp.src(["index.js"])
		.pipe(plumber());
	if (watching) {
		src = src.pipe(watch(["index.js"], {ignoreInitial: true}))
	}
	src.pipe(insert.prepend('require("source-map-support").install();'))
		.pipe(babel({sourceMaps: "inline"}))
		.on('error', console.error.bind(console))
		.pipe(gulp.dest(paths.dest));
}
// ==== live rebuild on developement
gulp.task("watch", false, function() {
	var watch = require("gulp-watch");
	buildBabel(true);

	gulp.src(["./**/*", "!./package.json"].concat(paths.exclude, exclude(paths.js, paths.test, paths.cli)))
		.pipe(watch(["./**/*", "!./package.json"].concat(paths.exclude, exclude(paths.js, paths.test, paths.cli)), {ignoreInitial: true}))
		.pipe(gulp.dest(paths.dest));
});

// gulp.task("copy", false, function(){
// 	return gulp.src(["./**/*"].concat(paths.exclude, exclude(paths.js, paths.test, paths.cli)), {dot: true})
// 		.pipe(gulp.dest(paths.dest));
// });

gulp.task("copy", false, function(){
	let replace = require('gulp-replace');
	return gulp.src(['./**/*'].concat(paths.exclude, exclude(paths.test, paths.cli)), {dot: true})
		.pipe(replace('@node/', ''))
		.pipe(gulp.dest(paths.dest));
});

gulp.task("babel", "builds all server scripts from es6 to es5", function(){
	buildBabel(false);
}, {
	aliases: ['bab']
});

gulp.task("clean", "clean server folder in build directory", function (cb) {
	var del = del || require('del');
	del([paths.dest+"/**/*"], {force: true}, cb);
}, {
	aliases: ['c']
});

gulp.task("build", "create full build", function(cb){
	return runSequence("clean", ["copy"], cb);

}, {
	aliases: ['b']
});

gulp.task("dev", "start develop server for serving assets and incremental builds", ["watch"], function(){}, {
	aliases: ['d']
});

gulp.task("default", false, ["help"]);

gulp.task("prepare", "task for resolve dependencies for this script and grub sources", ["npm-dev-install"]);
