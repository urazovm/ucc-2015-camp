'use strict';

var gulp = require('gulp');
var electron = require('gulp-electron');
var packageJson = require('./package.json');

gulp.task('electron', function() {
  gulp.src("")
  .pipe(electron({
    src: './src',
    packageJson: packageJson,
    release: './release',
    cache: './cache',
    version: 'v0.27.0',
    packaging: true,
    platforms: ['win32-ia32', 'darwin-x64']
  }))
  .pipe(gulp.dest(""));
});
