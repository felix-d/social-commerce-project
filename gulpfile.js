var gulp = require('gulp');
var rimraf = require('gulp-rimraf');
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

gulp.task('compile-js', function() {
    return gulp.src(js_sources)
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(gzip(gzip_options))
        .pipe(gulp.dest('build/js'))
        .pipe(livereload());
});

gulp.task('compile-css', function() {
    return gulp.src(css_sources)
        .pipe(minifycss())
        .pipe(concat('allcss.min.css'))
        .pipe(gulp.dest('build/css'));
});
gulp.task('compile-sass', function() {
    return gulp.src(sass_sources)
        .pipe(sass())
        .pipe(minifycss())
        .pipe(concat('allsass.min.css'))
        .pipe(gulp.dest('build/css'));
});

gulp.task('concat-sass-css', function() {
    return gulp.src(['build/css/allcss.min.css', 'build/css/allsass.min.css']).
    pipe(concat('all.min.css')).
    pipe(gulp.dest('build/css')).
    pipe(gzip(gzip_options)).
    pipe(gulp.dest('build/css'));
});

gulp.task('clean-styles', function() {
    return gulp.src([
        'build/css/allcss.min.css',
        'build/css/allsass.min.css'
    ]).pipe(rimraf(), {
        read: false
    });
});
gulp.task('compile-styles', [
    'compile-css',
    'compile-sass',
    'concat-sass-css',
    'clean-styles'
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
