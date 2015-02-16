var gulp = require('gulp');
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

js_sources = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js',
    'src/js/*.js'
];
//css sources are prepended to sass!!
css_sources = [
    'bower_components/bootstrap/dist/css/bootstrap.min.css'
];

sass_sources = [
    'src/scss/*.scss'
];
gulp.task('clean-js', function(){
    del('build/js/*');
});
gulp.task('clean-css', function(){
    del('build/css/*');
});
gulp.task('compress-js', function() {
    return gulp.src(js_sources)
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

gulp.task('concat-js', ['compress-js'], function(){
    return gulp.src('build/js/*.js').
        pipe(concat('all.min.js')).
        pipe(gulp.dest('build/js')).
        pipe(gzip(gzip_options)).
        pipe(gulp.dest('build/js')).
        pipe(livereload());
});

gulp.task('compile-js', ['clean-js', 'compress-js', 'concat-js'], function(){
    return;
});

gulp.task('compile-css', function() {
    return gulp.src(css_sources).
        pipe(gulp.dest('build/css')).
        pipe(gzip(gzip_options)).
        pipe(gulp.dest('build/css'));
});

gulp.task('compile-sass', function() {
    return gulp.src(sass_sources).
        pipe(sass()).
        pipe(minifycss()).
        pipe(rename({
            extname: ".min.css"
        })).
        pipe(gulp.dest('build/css')).
        pipe(gzip(gzip_options)).
        pipe(gulp.dest('build/css'));
});
gulp.task('concat-sass-css', ['compile-css', 'compile-sass'], function() {
    del('build/css/all.min.css');
    console.log("deleted");
    return gulp.src('build/css/*.css').
        pipe(concat('all.min.css')).
        pipe(gulp.dest('build/css')).
        pipe(gzip(gzip_options)).
        pipe(gulp.dest('build/css'));
});

gulp.task('compile-styles', [
    'clean-css',
    'compile-css',
    'compile-sass',
    'concat-sass-css'
], function() {
    return gulp.src('build/css/all.min.css')
        .pipe(livereload());
});

gulp.task('compress-images', function(){
    return gulp.src('src/images/**').
        pipe(imagemin({progressive: true, optimizationLevel: 7})).
        pipe(gulp.dest('build/images/'));
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/scss/*.scss', ['compile-styles']);
    gulp.watch('src/js/*.js', ['compile-js']);
    /* Trigger a live reload on any Django template changes */
    gulp.watch('**/templates/*').on('change', livereload.changed);
});

gulp.task('default', ['compile-styles', 'compile-js']);
