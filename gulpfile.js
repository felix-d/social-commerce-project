var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var parallel = require("concurrent-transform");
var os = require("os");
var gulpif = require('gulp-if');
var watchify = require('watchify');
var debug = require('gulp-debug');
var _ = require('underscore');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');
var browserify = require('browserify');
var reactify = require('reactify');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var gzip = require('gulp-gzip');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var watch;

var gzip_options = {
  threshold: '1kb',
  gzipOptions: {
    level: 9
  }
};

// we're not including react apps
var js_sources = [
  "./src/js/phase1/*.js",
  "./src/js/phase2/*.js",
  "./src/js/*.js",
  "./src/js/bower_components/*.js"
];

var js_vendor_sources = [
  './bower_components/jquery/dist/jquery.min.js',
  './bower_components/bootstrap/dist/js/bootstrap.min.js',
  './src/js/vendor/jquery-ui.min.js',
  './bower_components/vivus/dist/vivus.min.js',
  './src/js/vendor/particles.min.js',
  './src/js/vendor/jquery.lazyload.min.js',
  './src/js/vendor/jquery.infinitescroll.min.js',
  './bower_components/scrollup/dist/jquery.scrollUp.min.js'
];
//
//css sources are prepended to sass!!
var css_vendor_sources = [
  'bower_components/bootstrap/dist/css/bootstrap.min.css',
  'src/css/vendor/animate.min.css'
];

var sass_sources = [
  'src/scss/**/*.scss'
];

var browserify_bundles = [
  {
    src: "",
    expose: "",
    dist: ""
  }
];

var bundles = [
  // the review app bundle
  {
    add: './src/js/phase1/review_app/app.jsx',
    expose: 'review-app-bundle',
    dest: './build/js/dev/phase1/'
  },

  // the wishlist app bundle
  {
    add: './src/js/phase2/wishlist_app/app.jsx',
    expose: 'wishlist-app-bundle',
    dest: './build/js/dev/phase2/'
  }
];

gulp.task('browserify-nowatch', function(){
  watch=false;
  browserifyShare(bundles[0]);
  browserifyShare(bundles[1]);
});

gulp.task('browserify-watch', function(){
  watch = true;
  browserifyShare(bundles[0]);
  browserifyShare(bundles[1]);
});

function browserifyShare(bundle) {
  var b = browserify({
          cache: {},
          packageCache: {},
          fullPaths: true
  });

  b.transform('reactify', {es6: true});
  if(watch){
    b = watchify(b);
    b.on('update', function(){
      bundleShare(b, bundle);
    });
  }

  b.add(bundle.add);
  b.require(bundle.add, {
    expose: bundle.expose
  });
  bundleShare(b, bundle);
}

function bundleShare(b, bundle) {
  b.bundle()
    .pipe(source(bundle.expose + ".js"))
    .pipe(gulp.dest(bundle.dest))
    .pipe(gulpif(watch, livereload()));
}


//clear dev folder
gulp.task('clean-js', function(){
  del('build/js/dev/*');
});

gulp.task('clean-css', function(){
  del('build/css/dev/*');
});

//Takes all in the dev folder and minify it and gzip it
gulp.task('compress-js', function() {
  return gulp.src('./build/js/dev/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename(function(path){
      if(!/\.min$/.test(path.basename)){
        path.extname = ".min.js";
      }
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'))
    .pipe(gzip(gzip_options))
    .pipe(gulp.dest('build/js'));
});

//move js files from bower components into dev
gulp.task('move-js-vendor', function(){
  return gulp.src(js_vendor_sources).
    pipe(debug()).
    pipe(gulp.dest('./build/js/vendor/'));
});

//move js files from bower components into dev
gulp.task('move-js', function(){
  return gulp.src(js_sources, {base: 'src/js/'}).
    pipe(debug()).
    pipe(gulp.dest('./build/js/dev/'));
});


//takes css from bower components and move them to dev
gulp.task('move-css', ['clean-css'], function() {
  return gulp.src(css_vendor_sources).
    pipe(gulp.dest('build/css/vendor/'));
});

//compile sass and put it in dev
gulp.task('compile-sass', ['clean-css'], function() {
  return gulp.src(sass_sources, {base: 'src/scss/'}).
    pipe(sass({errLogToConsole: true})).
    pipe(gulp.dest('build/css/dev'));
});

//takes the css from temp, minify it and put it in build
gulp.task('minify-css', ['compile-sass', 'move-css'], function(){
  return gulp.src("build/css/dev/**/*.css", {base: 'build/css/dev/'})
    .pipe(sourcemaps.init())
    .pipe(minifycss())
    .pipe(rename(function(path){
      if(!/\.min$/.test(path.basename)){
        path.dir = "";
        path.extname = ".min.css";
      }
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'))
    .pipe(gzip(gzip_options))
    .pipe(gulp.dest('build/css'))
    .pipe(livereload());
});

gulp.task('prod-styles', [
  'minify-css'
], function(){return;});


gulp.task('compress-images', function(){
  return gulp.src('src/images/**').
    pipe(imagemin({progressive: true, optimizationLevel: 7})).
    pipe(gulp.dest('build/images/'));
});

gulp.task("parallel", function () {
  return gulp.src("./src/images/products/*.{jpg, jpeg}")
    .pipe(parallel(
      imageResize({ width : 121, height: 182  }),
      os.cpus().length
    )).pipe(gulp.dest("./src/images/products/small/"));
});

gulp.task('watch', ['browserify-watch'], function(){
  // gulp.watch('./src/js/**/*.js', ['move-js']);
  gulp.watch('./src/scss/**/*.scss', ['prod-styles']);
  livereload.listen(35729);
});
gulp.task('default', ['compile-styles', 'prod-js']);
