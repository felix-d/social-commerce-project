var gulp = require('gulp');
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

var gzip_options = {
    threshold: '1kb',
    gzipOptions: {
        level: 9
    }
};

var browserify_sources = [
    "./src/js/review-widget/review-widget.js",
];
var js_sources = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js'
];
//css sources are prepended to sass!!
var css_sources = [
    'bower_components/bootstrap/dist/css/bootstrap.min.css'
];

var sass_sources = [
    'src/scss/*.scss'
];

//clear tmp folder
gulp.task('clean-js', function(){
    del('build/js/tmp/*');
});

gulp.task('clean-css', function(){
    del('build/css/tmp/*');
});

//Takes all in the tmp folder and minify it and gzip it
gulp.task('compress-js', ['build-js'], function() {
    return gulp.src('./build/js/tmp/*.js')
        .pipe(debug())
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
gulp.task('move-js', ['clean-js'], function(){
    return gulp.src(js_sources).
        pipe(debug()).
        pipe(gulp.dest('./build/js/tmp'));
});

//browserify given files and move them into tmp
function browserifyFactory(taskName, path, bundleName){
    if(!arguments.callee.browserifyTasks) arguments.callee.tasks = [];
    arguments.callee.tasks.push(taskName);
    return gulp.task(taskName, ['clean-js'], function(){
        return browserify(path)
            .bundle()
            .pipe(source(bundleName))
            .pipe(gulp.dest('./build/js/tmp'));

    });
}

//we create browserify tasks cause browserify takes one entry point
browserifyFactory('browserify-widget', './src/js/review-widget/review-widget.js', 'bundle-widget.js');

//we register the tasks in one task
gulp.task('browserify', browserifyFactory.tasks, function(){});

//Move bower js files and browserify to tmp
gulp.task('build-js', ['move-js', 'browserify'], function(){
    return;
});


//Build and minify
gulp.task('prod-js', ['compress-js'], function(){
    return;
});

//takes css from bower components and move them to tmp
gulp.task('move-css', ['clean-css'], function() {
    return gulp.src(css_sources).
        pipe(gulp.dest('build/css/tmp'));
});

//compile sass and put it in tmp
gulp.task('compile-sass', ['clean-css'], function() {
    return gulp.src(sass_sources).
        pipe(sass()).
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
        pipe(gulp.dest('build/css'));
});

gulp.task('prod-styles', [
    'minify-css'
], function(){return;});

// gulp.task('concat-sass-css', ['compile-css', 'compile-sass'], function() {
//     del('build/css/all.min.css');
//     console.log("deleted");
//     return gulp.src('build/css/*.css').
//         pipe(concat('all.min.css')).
//         pipe(gulp.dest('build/css')).
//         pipe(gzip(gzip_options)).
//         pipe(gulp.dest('build/css'));
// });


gulp.task('compress-images', function(){
    return gulp.src('src/images/**').
        pipe(imagemin({progressive: true, optimizationLevel: 7})).
        pipe(gulp.dest('build/images/'));
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/scss/*.scss', ['prod-styles']);
    gulp.watch(browserify_sources, ['prod-js']);
    /* Trigger a live reload on any Django template changes */
    gulp.watch('**/templates/*').on('change', livereload.changed);
});

gulp.task('default', ['compile-styles', 'prod-js']);
