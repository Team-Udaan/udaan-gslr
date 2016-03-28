var gulp = require('gulp');

var paths = {
  index: 'src/index.html',
  templates: 'src/templates/**/*.*',
  scripts: 'src/scripts/**/*.*',
  styles: 'src/styles/**/*.*',
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
    .pipe(gulp.dest(paths.dist));
});

// Copy Styles
gulp.task('copy:styles', function () {
  return gulp.src(paths.styles)
    .pipe(gulp.dest(paths.dist));
});

// Build
gulp.task('build', ['copy:index', 'copy:templates', 'copy:scripts', 'copy:styles']);

// Default
gulp.task('default', ['build']);