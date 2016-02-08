var gulp = require('gulp');
var os = require('os');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var imageResize = require('gulp-image-resize');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var parallel = require('concurrent-transform');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var when = require('when');
var gulpBabel = require('gulp-babel');

/*
 * SCSS
 ****************/

gulp.task('build-scss', function gulpHandler() {
  return gulp.src('./src/scss/*.scss')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass({errLogToConsole: true}))
    .pipe(minifycss())
    .pipe(rename(function renameHandler(path) {
      if (!/\.min$/.test(path.basename)) {
        path.dir = '';
        path.extname = '.min.css';
      }
    }))
    .pipe(sourcemaps.write())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/css'));
});


/*
 * STANDALONE JS
 ****************/

gulp.task('build-standalone-js', function gulHandler() {
  return gulp.src('./src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(gulpBabel({
      presets: ['es2015', 'stage-0']
    }))
    .pipe(uglify())
    .pipe(rename(function renameHandler(path) {
      if (!/\.min$/.test(path.basename)) {
        path.extname = '.min.js';
      }
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/js'));
});


/*
 * BROWSERIFY
 *************/

var bundles = [{
  root: './src/js/phase1_app/app.jsx',
  name: 'phase1-app',
}, {
  root: './src/js/phase2_app/app.jsx',
  name: 'phase2-app',
}, {
  root: './src/js/track/track.js',
  name: 'track',
}];

var rebundle = function rebundle(bundler, name) {
  console.log('-> Bundling ' + name + '...');
  return when.promise(function promiseHandler(resolve) {
    bundler.bundle()
      .on('error', function handler(err) { console.error(err); this.emit('end'); })
      .pipe(source(name + '.min.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
    // .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build/js'))
      .on('end', function handler() {
        console.log('++ Done bundling ' + name + '!');
        resolve();
      });

  });

};

var updateHandler = function updateHandler(boundRebundle) {
  boundRebundle();
};

function compile(watchBundle) {
  var asyncs = [];
  for (var i = 0; i < bundles.length; i++) {
    var name = bundles[i].name;
    var root = bundles[i].root;
    var bundler = watchify(browserify(root, { debug: true }).transform(babel));
    var boundRebundle = rebundle.bind(this, bundler, name);

    if (watchBundle) {
      bundler.on('update', updateHandler.bind(this, boundRebundle));
    }
    asyncs.push(when(boundRebundle()));
  }
  return when.join.apply(this, asyncs);
}

function watch() {
  compile(true);
}

gulp.task('build-bundles', function taskHandler() {
  return compile();
});


/*
 * IMAGES
 ****************/

gulp.task('resize-product-images', function taskHandler() {
  return gulp.src('./src/images/products/*.{jpg, jpeg}')
    .pipe(parallel(
      imageResize({width: 121, height: 182}),
      os.cpus().length
    )).pipe(gulp.dest('./src/images/products/small/'));
});

gulp.task('compress-images', ['resize-product-images'], function taskHandler() {
  return gulp.src('src/images/**').
    pipe(imagemin({progressive: true, optimizationLevel: 7})).
    pipe(gulp.dest('build/images/'));
});

gulp.task('build-images', ['compress-images'], function taskHandler() { return; });


/*
 * MAIN TASKS
 ****************/

gulp.task('build', ['build-scss', 'build-standalone-js', 'build-images', 'build-bundles'], function handler() {
  console.log('Build completed.');
  process.exit(0);
});
gulp.task('watch', ['build-scss', 'build-standalone-js', 'build-images'], function handler() {
  gulp.watch('./src/scss/**/*.scss', ['build-scss']);
  gulp.watch('./src/js/*.js', ['build-standalone-js']);
  watch();
});

gulp.task('default', ['watch']);
