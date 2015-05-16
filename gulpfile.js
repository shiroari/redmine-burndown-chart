'use strict';

var gulp = require('gulp'),
  _ = require('gulp-load-plugins')(),
  source = require('vinyl-source-stream'),
  del = require('del'),
  path = require('path'),
  browserify = require('browserify'),
  watchify = require('watchify'),
  sourceFile = './src/scripts/main.js',
  destFolder = './dist/scripts',
  destFileName = 'app.js';

// App
gulp.task('app', function () {
  return browserify({
      entries: [sourceFile],
      insertGlobals: true,
      cache: {},
      packageCache: {},
      fullPaths: false,
      debug: false
    }).bundle()
    .on('error', _.util.log.bind(_.util, 'Browserify Error'))
    .pipe(source(destFileName))
    .pipe(gulp.dest(destFolder));
});

gulp.task('app:watch', function () {

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
      .on('error', _.util.log.bind(_.util, 'Browserify Error'))
      .pipe(source(destFileName))
      .pipe(gulp.dest(destFolder));
  }

  return rebundle();

});

// Styles
gulp.task('styles', function () {
  gulp.src('./src/styles/**/*.scss')
    .pipe(_.compass({
      sass: 'src/styles',
      css: 'dist/styles'
    }))
    //.pipe(_.autoprefixer('last 1 version'))
    //.pipe(_.minifyCSS())
    .pipe(gulp.dest('dist/styles'))
    .pipe(_.size());
});

// HTML
gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(_.useref())
    .pipe(gulp.dest('dist'))
    .pipe(_.size());
});

gulp.task('jest', function () {
  var nodeModules = path.resolve('./node_modules');
  return gulp.src('src/scripts/**/__tests__/*')
    .pipe(_.jest({
      scriptPreprocessor: nodeModules + '/babel-jest',
      unmockedModulePathPatterns: [nodeModules + '/react'],
      globals: {
        'BABEL_JEST_STAGE': 0,
        'runtime': true
      }
    }));
});

// Clean
gulp.task('clean', function (cb) {
  cb(del(['dist/*']), {
    force: true
  });
});

// Bundle
gulp.task('bundle', ['styles', 'app'], function () {
  return gulp.src('./src/*.html')
    .pipe(_.useref.assets())
    //.pipe(_.useref.restore())
    //.pipe(_.useref())
    .pipe(gulp.dest('dist'));
});

// Webserver
gulp.task('serve', function () {
  gulp.src('./dist')
    .pipe(_.webserver({
      livereload: true,
      port: 9001
    }));
});

// Robots.txt and favicon.ico
gulp.task('extras', function () {
  return gulp.src(['src/*.txt', 'src/*.png'])
    .pipe(gulp.dest('dist/'))
    .pipe(_.size());
});

// Watch
gulp.task('watch', ['html', 'styles', 'app:watch', 'serve'], function () {

  // Watch .html files
  gulp.watch('src/*.html', ['html']);

  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);

});


// Build
gulp.task('build', ['html', 'bundle', 'extras']);


// Default task
gulp.task('default', ['build', 'jest']);
