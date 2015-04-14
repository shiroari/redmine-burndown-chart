'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');

// Load plugins
var $ = require('gulp-load-plugins')(),
	browserify = require('browserify'),
	watchify = require('watchify'),
	source = require('vinyl-source-stream'),
	sourceFile = './src/scripts/app.js',
	destFolder = './dist/scripts',
	destFileName = 'app.js';


// Styles
gulp.task('styles', function () {
	gulp.src('./src/styles/**/*.scss')
		.pipe($.compass({
			sass: 'src/styles',
			css: 'dist/styles'
		}))
		//.pipe($.autoprefixer('last 1 version'))
		//.pipe($.minifyCSS())
		.pipe(gulp.dest('dist/styles'))
		.pipe($.size());
});

// App
gulp.task('app', function () {
	var bundler = watchify(browserify({
		entries: [sourceFile],
		insertGlobals: true,
		cache: {},
		packageCache: {},
		fullPaths: true,
		debug: true
	}));

	bundler.on('update', rebundle);

	function rebundle() {
		return bundler.bundle()
			.on('error', $.util.log.bind($.util, 'Browserify Error'))
			.pipe(source(destFileName))
			.pipe(gulp.dest(destFolder));
	}

	return rebundle();

});

// HTML
gulp.task('html', function () {
	return gulp.src('src/*.html')
		.pipe($.useref())
		.pipe(gulp.dest('dist'))
		.pipe($.size());
});

gulp.task('jest', function () {
	var nodeModules = path.resolve('./node_modules');
	return gulp.src('src/scripts/**/__tests__')
		.pipe($.jest({
			scriptPreprocessor: nodeModules + '/babel-jest',
			unmockedModulePathPatterns: [nodeModules + '/react']
		}));
});

// Clean
gulp.task('clean', function (cb) {
	cb(del.sync(['dist/styles', 'dist/scripts', 'dist/images']));
});

// Bundle
gulp.task('bundle', ['styles', 'app'], function () {
	return gulp.src('./src/*.html')
		.pipe($.useref.assets())
		//.pipe($.useref.restore())
		//.pipe($.useref())
		.pipe(gulp.dest('dist'));
});

// Webserver
gulp.task('serve', function () {
	gulp.src('./dist')
		.pipe($.webserver({
			livereload: true,
			port: 9001
		}));
});

// Robots.txt and favicon.ico
gulp.task('extras', function () {
	return gulp.src(['src/*.txt', 'src/*.ico'])
		.pipe(gulp.dest('dist/'))
		.pipe($.size());
});

// Watch
gulp.task('watch', ['html', 'bundle', 'serve'], function () {

	// Watch .html files
	gulp.watch('src/*.html', ['html']);

	// Watch .scss files
	gulp.watch('src/styles/**/*.scss', ['styles']);

});


// Build
gulp.task('build', ['html', 'bundle', 'extras']);


// Default task
gulp.task('default', ['build', 'jest']);
