var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
  index: 'src/index.html',
  templates: 'src/templates/**/*.html',
  scripts: 'src/scripts/**/*.js',
  styles: 'src/styles/**/*.css',
  dist: 'dist'
};

// Copy Index
gulp.task('copy:index', function () {
  return gulp.src(paths.index)
    .pipe(gulp.dest(paths.dist));
});

// Copy Templates
gulp.task('copy:templates', function () {
  return gulp.src(paths.templates)
    .pipe(gulp.dest(paths.dist));
});

// Copy Scripts
gulp.task('copy:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(concat('scripts.js'))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(gulp.dest(paths.dist));
});

// Copy Styles
gulp.task('copy:styles', function () {
  return gulp.src(paths.styles)
    .pipe(gulp.dest(paths.dist));
});

// Build
gulp.task('build', ['copy:index', 'copy:templates', 'copy:scripts', 'copy:styles']);

// Watch
gulp.task('watch', function () {
  gulp.watch(paths.index, ['copy:index']);
  gulp.watch(paths.templates, ['copy:templates']);
  gulp.watch(paths.scripts, ['copy:scripts']);
  gulp.watch(paths.styles, ['copy:styles']);
});

// Default
gulp.task('default', ['build']);