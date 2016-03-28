var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var through = require('through2');
var cleanCSS = require('gulp-clean-css');

function uncommentProd(config) {
  return through.obj(function (file, enc, cb) {
    var fileContents = file.contents.toString(enc), commentedProd, uncommentedProd;
    // remove dev
    fileContents = fileContents.replace(/\s*<!-- begin:dev -->[^]*<!-- end:dev -->\s*/g, '');
    // remove prod
    commentedProd = fileContents.match(/<!-- begin:prod -->[^]*<!-- end:prod -->/g)[0];
    uncommentedProd = commentedProd
      .replace(/<!-- begin:prod -->/, '\n')
      .replace(/\s*<!-- end:prod -->\s*/, '')
      .replace(/(<!--|-->)/g, '');
    file.contents = new Buffer(fileContents.replace(commentedProd, uncommentedProd));
    cb(null, file);
  });
}

// Index
gulp.task('index', function () {
  return gulp.src('src/index.html')
    .pipe(uncommentProd())
    .pipe(gulp.dest('dist'));
});

// Templates
gulp.task('templates', function () {
  return gulp.src('src/templates/*.html')
    .pipe(gulp.dest('dist/templates'));
});

// Scripts
gulp.task('scripts', function () {
  return gulp.src('src/scripts/**/*.js')
    .pipe(concat('scripts.min.js'))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(gulp.dest('dist'));
});

// Style
gulp.task('style', function () {
  return gulp.src('src/style.css')
    .pipe(concat('styles.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
});

// Build
gulp.task('build', ['index', 'templates', 'scripts', 'style']);

// Watch
gulp.task('watch', function () {
  gulp.watch('src/index.html', ['index']);
  gulp.watch('src/templates/*.html', ['templates']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/style.css', ['style']);
});

// Default
gulp.task('default', ['build']);