var gulp = require('gulp');
var gulpif = require('gulp-if');
var watchify = require('watchify');
var debug = require('gulp-debug');
var _ = require('underscore');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');
var browserify = require('browserify');
var reactify = require('reactify');
var del = require('del');
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

var browserify_sources = [
    {
        taskName: 'browserify-review',
        src: './src/js/review_app/app.jsx',
        bundleName: 'review_app_bundle.js'
    }
];

var js_sources = [
    "./src/js/phase1/*.js",
    "./src/js/phase2/*.js",
    "./src/js/bower_components/*.js"
];

var js_bower_sources = [
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/bootstrap/dist/js/bootstrap.min.js'
];

//css sources are prepended to sass!!
var css_sources = [
    'bower_components/bootstrap/dist/css/bootstrap.min.css'
];

var sass_sources = [
    'src/scss/*.scss'
];

gulp.task('browserify-nowatch', function(){
    watch=false;
    browserifyShare();
});

gulp.task('browserify-watch', function(){
    watch = true;
    browserifyShare();
});

function browserifyShare() {
    var b = browserify({
        cache: {},
        transform: reactify,
        packageCache: {},
        fullPaths: true
    });

    if(watch){
        b = watchify(b);
        b.on('update', function(){
            console.log('updated');
            bundleShare(b);
        });
    }

    b.add('./src/js/phase1/review_app/app.jsx');
    b.require('./src/js/phase1/review_app/app.jsx', {expose: "review-app-bundle" });
    bundleShare(b);
}

function bundleShare(b) {
    b.bundle()
        .pipe(source('review-app-bundle.js'))
        .pipe(gulp.dest('./build/js/dev/phase1/'))
        .pipe(gulpif(watch, livereload()));
}


//clear tmp folder
gulp.task('clean-js', function(){
    del('build/js/tmp/*');
});

gulp.task('clean-css', function(){
    del('build/css/tmp/*');
});

//Takes all in the tmp folder and minify it and gzip it
gulp.task('compress-js', function() {
    return gulp.src('./build/js/tmp/*.js')
        .pipe(uglify())
        .pipe(rename(function(path){
            if(!/\.min$/.test(path.basename)){
                path.extname = ".min.js";
            }
        }))
        .pipe(gulp.dest('build/js'))
        .pipe(gzip(gzip_options))
        .pipe(gulp.dest('build/js'));
});

//move js files from bower components into tmp
gulp.task('move-js-bower', function(){
    return gulp.src(js_bower_sources).
        pipe(debug()).
        pipe(gulp.dest('./src/js/bower_components/'));
});

//move js files from bower components into tmp
gulp.task('move-js',['move-js-bower'], function(){
    return gulp.src(js_sources, {base: 'src/js/'}).
        pipe(debug()).
        pipe(gulp.dest('./build/js/tmp'));
});



//takes css from bower components and move them to tmp
gulp.task('move-css', ['clean-css'], function() {
    return gulp.src(css_sources).
        pipe(gulp.dest('build/css/tmp'));
});

//compile sass and put it in tmp
gulp.task('compile-sass', ['clean-css'], function() {
    return gulp.src(sass_sources).
        pipe(sass({errLogToConsole: true})).
        pipe(gulp.dest('build/css/tmp'));
});

//takes the css from temp, minify it and put it in build
gulp.task('minify-css', ['compile-sass', 'move-css'], function(){
    return gulp.src("build/css/tmp/*.css").
        pipe(minifycss()).
        pipe(rename(function(path){
            if(!/\.min$/.test(path.basename)){
                path.dir = "";
                path.extname = ".min.css";
            }
        })).
        pipe(gulp.dest('build/css')).
        pipe(gzip(gzip_options)).
        pipe(gulp.dest('build/css')).
        pipe(livereload());
});

gulp.task('prod-styles', [
    'minify-css'
], function(){return;});


gulp.task('compress-images', function(){
    return gulp.src('src/images/**').
        pipe(imagemin({progressive: true, optimizationLevel: 7})).
        pipe(gulp.dest('build/images/'));
});

gulp.task('watch', ['browserify-watch'], function(){
    gulp.watch('./src/js/*.js', ['move-js']);
    gulp.watch('./src/scss/*.scss', ['prod-styles']);

    livereload.listen(35729);
});
gulp.task('default', ['compile-styles', 'prod-js']);
