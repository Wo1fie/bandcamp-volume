'use strict';
// Taken from https://medium.com/devux/minifying-your-css-js-html-files-using-gulp-2113d7fcbd16 and modified for our uses.  Default task had to be modified to work.
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var merge = require('gulp-merge');
var zip = require('gulp-zip');

// Gulp task to minify CSS files
gulp.task('styles', function () {
    return gulp.src('./src/css/bandcamp-volume.css')
        // Minify the file
        .pipe(csso())
        // Output
        .pipe(gulp.dest('./dist/css'))
});

// Gulp task to minify JavaScript files
gulp.task('scripts', function () {
    return gulp.src('./src/js/**/*.js')
        // Minify the file
        .pipe(uglify())
        // Output
        .pipe(gulp.dest('./dist/js'))
});

// Clean output directory
gulp.task('clean', () => del(['dist']));
// Clean debug output directory
gulp.task('cleandebug', () => del(['debug-dist']));

gulp.task('manifest', function () {
    return gulp.src('./src/manifest.json')
    .pipe(gulp.dest('./dist'))
})

gulp.task('minifydebug', async () => {
    var manifest = gulp.src('./manifest.json')
        .pipe(gulp.dest('./debug-dist'));
    var scripts = gulp.src('./src/js/**/*.js')
        .pipe(gulp.dest('./debug-dist/js'));
    var styles = gulp.src('./src/css/bandcamp-volume.css')
        .pipe(gulp.dest('./debug-dist/css'))

    return await merge(manifest, scripts, styles);
})

gulp.task('release', function(){
    return gulp.src('./dist/**/*')
    .pipe(zip('release.zip'))
    .pipe(gulp.dest('./release'))
})

// Gulp task to minify all files
gulp.task('default', gulp.series(['clean', 'styles', 'scripts', 'manifest']));

gulp.task('debug', gulp.series(['cleandebug', 'minifydebug']));