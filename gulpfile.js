// gulpfile.js
// Heavily inspired by Mike Valstar's solution:
//   http://mikevalstar.com/post/fast-gulp-browserify-babelify-watchify-react-build/
"use strict";

var     browserify = require('browserify'),
        buffer     = require('vinyl-buffer'),
        gulp       = require('gulp'),
        gutil      = require('gulp-util'),
        livereload = require('gulp-livereload'),
        rename     = require('gulp-rename'),
        sourceMaps = require('gulp-sourcemaps'),
        source     = require('vinyl-source-stream'),
        watchify   = require('watchify');

var config = {
    js: {
        src: './js/torch3d.js',       // Entry point
        outputDir: './build/',  // Directory to save bundle to
        mapDir: './maps/',      // Subdirectory to save maps to
        outputFile: 'bundle.js' // Name to use for bundle
    },
};

// This method makes it easy to use common bundling options in different tasks
function bundle (bundler) {

    // Add options to add to "base" bundler passed as parameter
    try {
      bundler
        .bundle()                                                        // Start bundle
        .pipe(source(config.js.src))                        // Entry point
        .pipe(buffer())                                           // Convert to gulp pipeline
        .pipe(rename(config.js.outputFile))          // Rename output from 'main.js'
                                                                                //   to 'bundle.js'
        .pipe(sourceMaps.init({ loadMaps : true }))  // Strip inline source maps
        .pipe(sourceMaps.write(config.js.mapDir))    // Save source maps to their
                                                                                        //   own directory
        .pipe(gulp.dest(config.js.outputDir))        // Save 'bundle' to build/
        .pipe(livereload());                                       // Reload browser if relevant
      } catch(err) {
        console.log(err);
      }
}

gulp.task('bundle', function () {
    var bundler = browserify(config.js.src)  // Pass browserify the entry point
    bundle(bundler);  // Chain other options -- sourcemaps, rename, etc.
})

gulp.task('watchify', function(){
   watchify.args.debug = true;
   var bundler = watchify(browserify('./js/torch3d.js', watchify.args));
    bundler.on('update', rebundle);
    bundler.on('log', gutil.log.bind(gutil));
    function rebundle() {
      return bundle(bundler);
  }

  return rebundle()
})