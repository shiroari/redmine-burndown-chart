'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');


// Load plugins
var $ = require('gulp-load-plugins')(),
	compass = require('gulp-compass'),
	minifyCSS = require('gulp-minify-css'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	source = require('vinyl-source-stream'),
	sourceFile = './app/scripts/app.js',
	destFolder = './dist/scripts',
	destFileName = 'app.js';


// Styles
gulp.task('styles', function () {
	gulp.src('./app/styles/sass/**/*.scss')
		.pipe(compass({
			sass: 'app/styles/sass',
			css: 'dist/styles'
		}))
		//.pipe($.autoprefixer('last 1 version'))	
		//.pipe(minifyCSS())
		.pipe(gulp.dest('dist/styles'))
		.pipe($.size());
});

//gulp.task('styles', function () {
//    return gulp.src('app/styles/**/*.scss')
//        .pipe($.rubySass({
//            style: 'expanded',
//            precision: 10,
//            loadPath: ['app/bower_components']
//        }))
//        .pipe(gulp.dest('dist/styles'))
//        .pipe($.size());
//});


// Scripts
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
			// log errors if they happen
			.on('error', $.util.log.bind($.util, 'Browserify Error'))
			.pipe(source(destFileName))
			.pipe(gulp.dest(destFolder));
	}

	return rebundle();

});


gulp.task('json', function () {
	gulp.src('app/scripts/json/**/*.json', {
			base: 'app/scripts'
		})
		.pipe(gulp.dest('dist/scripts/'));
});


gulp.task('scripts', function () {
	gulp.src(['app/scripts/key.js'], {
			base: 'app/scripts'
		})
		.pipe(gulp.dest('dist/scripts/'));
});


gulp.task('jade', function () {
	return gulp.src('app/template/*.jade')
		.pipe($.jade({
			pretty: true
		}))
		.pipe(gulp.dest('dist'));
})


// HTML
gulp.task('html', function () {
	return gulp.src('app/*.html')
		.pipe($.useref())
		.pipe(gulp.dest('dist'))
		.pipe($.size());
});


// Images
gulp.task('images', function () {
	return gulp.src('app/images/**/*')
		.pipe(gulp.dest('dist/images'))
		.pipe($.size());
});


gulp.task('jest', function () {
	var nodeModules = path.resolve('./node_modules');
	return gulp.src('app/scripts/**/__tests__')
		.pipe($.jest({
			scriptPreprocessor: nodeModules + '/gulp-jest/preprocessor.js',
			unmockedModulePathPatterns: [nodeModules + '/react']
		}));
});


// Clean
gulp.task('clean', function (cb) {
	cb(del.sync(['dist/styles', 'dist/scripts', 'dist/images']));
});


// Bundle
gulp.task('bundle', ['styles', 'scripts', 'app'], function () {
	return gulp.src('./app/*.html')
		.pipe($.useref.assets())
		.pipe($.useref.restore())
		.pipe($.useref())
		.pipe(gulp.dest('dist'));
});


// Webserver
gulp.task('serve', function () {
	gulp.src('./dist')
		.pipe($.webserver({
			livereload: true,
			port: 9000
		}));
});


// Robots.txt and favicon.ico
gulp.task('extras', function () {
	return gulp.src(['app/*.txt', 'app/*.ico'])
		.pipe(gulp.dest('dist/'))
		.pipe($.size());
});


// Watch
gulp.task('watch', ['html', 'bundle', 'serve'], function () {

	// Watch .json files
	gulp.watch('app/scripts/**/*.json', ['json']);

	// Watch .html files
	gulp.watch('app/*.html', ['html']);

	// Watch .scss files
	gulp.watch('app/styles/**/*.scss', ['styles']);

	// Watch .jade files
	gulp.watch('app/template/**/*.jade', ['jade', 'html']);

	// Watch image files
	gulp.watch('app/images/**/*', ['images']);
});


// Build
gulp.task('build', ['html', 'bundle', 'images', 'extras']);


// Default task
gulp.task('default', ['clean', 'build', 'jest']);