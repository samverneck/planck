'use strict';

var gulp = require('gulp');

var env = process.env.NODE_ENV || 'dev';

require('require-dir')('./tasks');

// gulp.task('default', ['clean'], function (defaultTasks) {
//   // run with paramater
//   gulp.start(env);
// });